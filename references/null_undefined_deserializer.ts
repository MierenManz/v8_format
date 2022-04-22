/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized null or undefined data
 * @returns { number } Deserialized integer
 */
export function deserializeV8NullOrUndefined(
  data: Uint8Array,
): null | undefined {
  if (data[0] === 0x30) return null;
  if (data[0] === 0x5F) return undefined;
  throw new Error("Not a V8 null or undefined");
}
