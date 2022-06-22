import { varintDecode, varintEncode } from "./_deps.ts";
import { consume } from "./_util.ts";

const TEXT_ENCODER = new TextEncoder();
const TWO_BYTE_STR_REGEX = /[^\x20-\x7E]+/g;
const TEXT_DECODER_UTF16 = new TextDecoder("utf-16");
const TEXT_DECODER_UTF8 = new TextDecoder("utf-8");

/**
 * @param { string } data - String To Serialize
 * @returns { Uint8Array } Serialized string without magic bytes
 */
export function serializeJsString(data: string): Uint8Array {
  if (typeof data !== "string") throw new Error("Not a string");
  const isTwoByteString = TWO_BYTE_STR_REGEX.test(data);
  const indicatorByte = isTwoByteString ? 0x63 : 0x22;

  let stringEncoded: Uint8Array;
  if (isTwoByteString) {
    const u16Array = Uint16Array.from(
      data.split("").map((c) => c.charCodeAt(0)),
    );
    stringEncoded = new Uint8Array(u16Array.buffer);
  } else {
    stringEncoded = TEXT_ENCODER.encode(data);
  }

  const [varintBytes] = varintEncode(stringEncoded.length);
  const serializedData = new Uint8Array(
    varintBytes.length + stringEncoded.length + 1,
  );
  serializedData[0] = indicatorByte;
  serializedData.set(varintBytes, 1);
  serializedData.set(stringEncoded, varintBytes.length + 1);

  return serializedData;
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized string data
 * @returns { string } Deserialized string
 */
export function deserializeV8String(data: Uint8Array): string {
  if (data[0] !== 0x22 && data[0] !== 0x63) throw new Error("Not a v8 string");
  const decoder = data[0] === 0x63 ? TEXT_DECODER_UTF16 : TEXT_DECODER_UTF8;
  const [stringLength, bytesUsed] = varintDecode(data, 1);
  // Decode string
  const decoded = decoder.decode(
    data.subarray(bytesUsed, bytesUsed + stringLength),
  );
  // Consume bytes (this is so that we don't need to pass a offset to the next deserialize function)
  consume(data, bytesUsed + stringLength);
  return decoded;
}
