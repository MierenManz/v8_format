/**
 * @param { number } float - Float64 To Serialize
 * @returns { Uint8Array } Serialized Float64 without magic bytes
 */
export function serializeJsFloat(float: number): Uint8Array {
  if (Number.isInteger(float)) throw new Error("Not a float");

  const ab = new ArrayBuffer(9);
  const binaryView = new Uint8Array(ab);

  binaryView[0] = 0x4E;

  // Set float64 at offset=1 as little endian
  new DataView(ab).setFloat64(1, float, true);

  return binaryView;
}

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
