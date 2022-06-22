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
    bigintArray.push(value);
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
  const bigintCount = bitfield / 16 | 0;
  // Create bigint dataview
  const dataview = new DataView(data.buffer, data.byteOffset + bytesUsed);

  let num = 0n;
  for (let i = 0; i < bigintCount; i++) {
    num = num << 64n | dataview.getBigUint64((bigintCount - i) * 8 - 8, true);
  }

  consume(data, bigintCount * 8 + bytesUsed);
  return (bitfield % 16 === 1) ? -num : num;
}
