import { consume } from "./_util.ts";

/**
 * @param { null } val - null To Serialize
 * @returns { Uint8Array } Serialized null
 */
export function serializeJsNull(val: null): Uint8Array {
  if (val !== null) throw new Error("Not Null");
  return Uint8Array.of(0x30);
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized null data
 * @returns { null } Deserialized null
 */
export function deserializeV8Null(
  data: Uint8Array,
): null {
  if (data[0] !== 0x30) throw new Error("Not a V8 null");
  // Consume bytes (this is so that we don't need to pass a offset to the next deserialize function)
  consume(data, 1);
  return null;
}
