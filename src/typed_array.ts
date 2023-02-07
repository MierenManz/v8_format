import { varintDecode, varintEncode } from "./_deps.ts";
import {
  deserializeArrayBuffer,
  serializeArrayBuffer,
} from "./array_buffer.ts";
import { consume } from "./_util.ts";

type UnsignedTypedArray =
  | Uint8ClampedArray
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigUint64Array;

type SignedTypedArray =
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array;

type FloatTypedArray = Float32Array | Float64Array;

type TypedArray = UnsignedTypedArray | SignedTypedArray | FloatTypedArray;

const TYPED_ARRAY_TO_INDICATOR: Record<string, number> = {
  Int8Array: "b".charCodeAt(0),
  Uint8Array: "B".charCodeAt(0),
  Uint8ClampedArray: "C".charCodeAt(0),
  Int16Array: "w".charCodeAt(0),
  Uint16Array: "W".charCodeAt(0),
  Int32Array: "d".charCodeAt(0),
  Uint32Array: "D".charCodeAt(0),
  Float32Array: "f".charCodeAt(0),
  Float64Array: "F".charCodeAt(0),
  BigInt64Array: "q".charCodeAt(0),
  BigUint64Array: "Q".charCodeAt(0),
};

type TypedArrayConstructor =
  | Uint8ArrayConstructor
  | Int8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | BigInt64ArrayConstructor
  | BigUint64ArrayConstructor;

const INDICATOR_TO_TYPED_ARRAY_CONSTRUCTOR: Record<
  number,
  TypedArrayConstructor
> = {
  98: Int8Array,
  66: Uint8Array,
  67: Uint8ClampedArray,
  119: Int16Array,
  87: Uint16Array,
  100: Int32Array,
  68: Uint32Array,
  102: Float32Array,
  70: Float64Array,
  113: BigInt64Array,
  81: BigUint64Array,
};
export function serializeTypedArray(typedArray: TypedArray) {
  const indicator =
    // deno-lint-ignore no-explicit-any
    TYPED_ARRAY_TO_INDICATOR[(typedArray as any).constructor.name];
  if (indicator === undefined) throw new Error("Not a js TypedArray");

  const serializedAB = serializeArrayBuffer(typedArray.buffer);
  const buffer = new Uint8Array(serializedAB.length + 12);

  buffer.set(serializedAB, 0);

  let offset = serializedAB.length;
  // TypedArray Indicator
  buffer[offset++] = 0x56;
  // Buffer View Indicator
  buffer[offset++] = indicator;

  const byteOffset = varintEncode(typedArray.byteOffset)[0];
  buffer.set(byteOffset, offset--);
  offset += byteOffset.length;
  const byteLength = varintEncode(typedArray.byteLength)[0];
  offset += byteLength.length;
  buffer.set(byteLength, offset);
  // buffer[sr];
  buffer[offset + 1] = 232;
  buffer[offset + 2] = 71;
  return buffer.subarray(0, offset + 3);
}

export function deserializeTypedArray(data: Uint8Array): TypedArray {
  const ab = deserializeArrayBuffer(data);
  if (data[0] !== 0x56) throw new Error("Not a TypedArray");
  const constructor = INDICATOR_TO_TYPED_ARRAY_CONSTRUCTOR[data[1]];
  let byteLength, [byteOffset, offset] = varintDecode(data, 1);
  [byteLength, offset] = varintDecode(data, offset);
  return new constructor(ab, byteOffset, byteLength);
}
