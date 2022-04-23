/**
 * @param { null } val - null To Serialize
 * @returns { Uint8Array } Serialized null
 */
export function serializeJsNull(val: null): Uint8Array {
  if (val === null) {
    return new Uint8Array([0x30]);
  }

  throw new Error("Not Null or Undefined");
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized null data
 * @returns { null } Deserialized null
 */
export function deserializeV8Null(
  data: Uint8Array,
): null {
  if (data[0] === 0x30) return null;
  throw new Error("Not a V8 null");
}
