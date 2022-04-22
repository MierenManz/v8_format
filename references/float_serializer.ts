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
