import { consume } from "./_util.ts";

const MIN_INT_VALUE = -1_073_741_824;
const MAX_INT_VALUE = 1_073_741_823;

/**
 * @param { number } float - Float64 To Serialize
 * @returns { Uint8Array } Serialized Float64 without magic bytes
 */
export function serializeJsFloat(float: number): Uint8Array {
  if (
    Number.isInteger(float) &&
    float > MIN_INT_VALUE &&
    float < MAX_INT_VALUE
  ) {
    throw new Error("Not a float");
  }

  const binaryView = new Uint8Array(9);

  binaryView[0] = 0x4E;

  // Set float64 at offset=1 as little endian
  new DataView(binaryView.buffer).setFloat64(1, float, true);

  return binaryView;
}

/**
 * This function assumes that there is no magic bytes and the first element is the type indicator
 * @param { Uint8Array } data - Serialized float data
 * @returns { number } Deserialized Float64
 */
export function deserializeV8Float(data: Uint8Array): number {
  if (data[0] !== 0x4E) throw new Error("Not a v8 float");
  // Create new slice
  const dt = new DataView(data.buffer, data.byteOffset + 1);
  const val = dt.getFloat64(0, true);
  // Consume bytes (this is so that we don't need to pass a offset to the next deserialize function)
  consume(data, 9);
  return val;
}
