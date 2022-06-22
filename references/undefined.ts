import { consume } from "./_util.ts";

/**
 * @param { undefined } val - undefined To Serialize
 * @returns { Uint8Array } Serialized undefined
 */
export function serializeJsUndefined(val?: undefined): Uint8Array {
  if (val !== undefined) throw new Error("Not Undefined");
  return Uint8Array.of(0x5F);
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized undefined data
 * @returns { undefined } Deserialized undefined
 */
export function deserializeV8Undefined(
  data: Uint8Array,
): undefined {
  if (data[0] !== 0x5F) throw new Error("Not a V8 undefined");
  // Consume bytes (this is so that we don't need to pass a offset to the next deserialize function)
  consume(data, 1);
  return undefined;
}
