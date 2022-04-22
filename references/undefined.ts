/**
 * @param { undefined } val - undefined To Serialize
 * @returns { Uint8Array } Serialized undefined
 */
export function serializeJsNull(val?: undefined): Uint8Array {
  if (val === undefined) {
    return new Uint8Array([0x5F]);
  }

  throw new Error("Not Undefined");
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized undefined data
 * @returns { undefined } Deserialized undefined
 */
export function deserializeV8Null(
  data: Uint8Array,
): undefined {
  if (data[0] === 0x5F) return undefined;
  throw new Error("Not a V8 undefined");
}
