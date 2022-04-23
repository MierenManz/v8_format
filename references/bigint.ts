import { encode as varintEncode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

/**
 * @param { BigInt } value - BigInt To Serialize
 * @returns { Uint8Array } Serialized JS BigInt without magic bytes
 */
export function serializeJsBigInt(value: bigint): Uint8Array {
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
