import { decode32 as varintDecode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized string data
 * @returns { string } Deserialized string
 */
export function deserializeV8String(data: Uint8Array): string {
  if (data[0] !== 0x22) throw new Error("Not a v8 string");

  const [stringLength, bytesUsed] = varintDecode(data, 1);
  const stringData = data.subarray(bytesUsed, bytesUsed + stringLength);

  return new TextDecoder().decode(stringData);
}
