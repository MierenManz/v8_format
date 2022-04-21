import { encode as varintEncode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

/**
 * @param { string } data - deserialized string
 * @returns { Uint8Array } serialized string without magic bytes
 */
export function serializeIntoV8String(data: string): Uint8Array {
  const [varintBytes, length] = varintEncode(data.length);
  const stringEncoded = new TextEncoder().encode(data);

  const serializedData = new Uint8Array(length + stringEncoded.length + 1);
  serializedData[0] = 0x21;
  serializedData.set(varintBytes, 1);
  serializedData.set(stringEncoded, length + 1);

  return serializedData;
}
