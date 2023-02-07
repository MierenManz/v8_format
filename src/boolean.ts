import { consume } from "./_util.ts";

/**
 * @param { boolean } bool - Boolean To Serialize
 * @returns { Uint8Array } Serialized JS boolean without magic bytes
 */
export function serializeJsBoolean(bool: boolean): Uint8Array {
  if (typeof bool !== "boolean") throw new Error("Not a boolean");
  return Uint8Array.of(bool ? 0x54 : 0x46);
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized boolean data
 * @returns { boolean } Deserialized boolean
 */
export function deserializeV8Boolean(data: Uint8Array): boolean {
  const bool = data[0];
  if (bool !== 0x54 && bool !== 0x46) throw new Error("Not a v8 boolean");
  // Consume bytes (this is so that we don't need to pass a offset to the next deserialize function)
  consume(data, 1);
  return bool === 0x54;
}
