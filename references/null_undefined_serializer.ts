/**
 * @param { null | undefined } val - `null` or `undefined` To Serialize
 * @returns { Uint8Array } Serialized null or undefined
 */
export function serializeJsNullOrUndefined(val?: null | undefined): Uint8Array {
  if (typeof val === "undefined") {
    return new Uint8Array([0x5F]);
  }

  if (val === null) {
    return new Uint8Array([0x30]);
  }

  throw new Error("Not Null or Undefined");
}
