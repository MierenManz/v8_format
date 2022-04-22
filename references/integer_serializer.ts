import { encode as varintEncode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

/**
 * @param { number } value - Integer To Serialize
 * @returns { Uint8Array } Serialized JS Integer without magic bytes
 */
export function serializeJsInteger(value: number): Uint8Array {
  if (value < -1_073_741_824 || value > 1_073_741_823) {
    throw new Error("Outside of the integer range");
  }

  if (!Number.isInteger(value)) {
    throw new Error("Not a integer");
  }

  // ZigZag Encode
  const v = (value >> 31) ^ (value << 1);

  // Varint Encode
  const [varintBytes, length] = varintEncode(v);

  const buffer = new Uint8Array(length + 1);
  buffer[0] = 0x49;
  buffer.set(varintBytes, 1);

  return buffer;
}
