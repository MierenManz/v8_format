/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized float data
 * @returns { number } Deserialized Float64
 */
export function deserializeV8Float(data: Uint8Array): number {
  if (data[0] !== 0x4E) throw new Error("Not a v8 float");
  const dt = new DataView(data);
  return dt.getFloat64(1, true);
}
