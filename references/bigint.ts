import { varintDecode, varintEncode } from "./_deps.ts";
import { consume } from "./_util.ts";

/**
 * @param { BigInt } value - BigInt To Serialize
 * @returns { Uint8Array } Serialized JS BigInt without magic bytes
 */
export function serializeJsBigInt(value: bigint): Uint8Array {
  if (typeof value !== "bigint") throw new Error("Not a BigInt");
  // Check if the value is negative
  const isNegative = value < 0n;
  // make the value positive if negative
  value = isNegative ? value - value * 2n : value;
  // Construct a new u64 array
  const bigintArray = [];

  // Bitshift by 64 bits until value is 0
  while (value !== 0n) {
    // Push u64's
    bigintArray.push(BigInt.asUintN(64, value));
    value >>= 64n;
  }

  // Calculate bitfield value
  const bitfield = bigintArray.length * 16 + (isNegative ? 1 : 0);
  // Get ArrayBuffer of array
  const { buffer: bigintArrayBuffer } = new BigUint64Array(bigintArray);

  // encode bitfield bytes into a varint
  const [bitfieldVarintBytes] = varintEncode(bitfield);
  const arrayLength = 1 + bitfieldVarintBytes.length + bigintArray.length * 8;
  // Create serialized data
  const serializedData = new Uint8Array(arrayLength);

  // Set indicator byte
  serializedData[0] = 0x5A;
  // Set varint bitfield
  serializedData.set(bitfieldVarintBytes, 1);
  // Set bigint data
  serializedData.set(
    new Uint8Array(bigintArrayBuffer),
    1 + bitfieldVarintBytes.length,
  );

  return serializedData;
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized BigInt data
 * @returns { BigInt } Deserialized BigInt
 */
export function deserializeV8BigInt(data: Uint8Array): bigint {
  if (data[0] !== 0x5A) throw new Error("Not a v8 bigint");
  // Decode varint bitfield
  const [bitfield, bytesUsed] = varintDecode(data, 1);
  // Check if bigint should be negative
  const isNegative = bitfield % 16 === 1;
  const bigintCount = bitfield / 16 | 0;
  // Create a new dataview and ArrayBuffer
  const bigintDataSlice = data.slice(bytesUsed, bytesUsed + bigintCount * 8);
  // Create bigint dataview
  const u64Array = new BigUint64Array(bigintDataSlice.buffer);
  // Reverse so that we get the right order
  u64Array.reverse();

  let num = 0n;
  for (const bg of u64Array) {
    // Bitshift to make room for the new u64
    num <<= 64n;
    // Add the bit values of the new u64 to the current value
    num |= bg;
  }
  consume(data, bigintCount * 8 + bytesUsed);
  return isNegative ? -num : num;
}
