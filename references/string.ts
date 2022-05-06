import {
  decode32 as varintDecode,
  encode as varintEncode,
} from "https://deno.land/x/varint@v2.0.0/varint.ts";
import { consume } from "./util.ts";

/**
 * @param { string } data - String To Serialize
 * @returns { Uint8Array } Serialized string without magic bytes
 */
export function serializeJsString(data: string): Uint8Array {
  // TODO: Add two byte string serialization
  const [varintBytes, length] = varintEncode(data.length);
  const stringEncoded = new TextEncoder().encode(data);

  const serializedData = new Uint8Array(length + stringEncoded.length + 1);
  serializedData[0] = 0x22;
  serializedData.set(varintBytes, 1);
  serializedData.set(stringEncoded, length + 1);

  return serializedData;
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized string data
 * @returns { string } Deserialized string
 */
export function deserializeV8String(data: Uint8Array): string {
  if (data[0] !== 0x22) throw new Error("Not a v8 string");

  const [stringLength, bytesUsed] = varintDecode(data, 1);
  // Copy string data
  const stringData = data.subarray(bytesUsed, bytesUsed + stringLength);
  // Decode string
  const decoded = new TextDecoder().decode(stringData);
  // Consume bytes (this is so that we don't need to pass a offset to the next deserialize function)
  consume(data, bytesUsed + stringLength);
  return decoded;
}
