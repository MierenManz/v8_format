import { varintDecode, varintEncode } from "./_deps.ts";
import { arrayMetadata, consume, strIsIntIndex } from "./_util.ts";
import { deserializeV8BigInt } from "./bigint.ts";
import { deserializeV8Boolean } from "./boolean.ts";
import { deserializeV8Float } from "./float.ts";
import { deserializeV8Integer, serializeJsInteger } from "./integer.ts";
import { serializeAny } from "./mod.ts";
import { deserializeV8Null } from "./null.ts";
import {
  deserializeReference,
  serializeReference,
} from "./object_reference.ts";
import { deserializeV8String, serializeJsString } from "./string.ts";
import { deserializeV8Undefined } from "./undefined.ts";

export function serializeJsArray<T>(
  array: T[],
  // deno-lint-ignore ban-types
  objRefs: {}[] = [array],
): Uint8Array {
  if (!Array.isArray(array)) {
    throw new Error("Not a JS array");
  }
  // parse metadata from array
  const metadata = arrayMetadata(array);
  const indicatorByte = metadata.isSparse ? 0x61 : 0x41;
  const endingByte = metadata.isSparse ? 0x40 : 0x24;
  const serializedValues: Uint8Array[] = [];

  for (const key in array) {
    // If key is not a valid v8 integer then serialize it as string.
    // Else if array is sparse serialize as v8 integer
    if (!strIsIntIndex(key)) {
      serializedValues.push(serializeJsString(key));
    } else if (metadata.isSparse) {
      serializedValues.push(serializeJsInteger(parseInt(key)));
    }

    // Serialize value
    const value = array[key];

    // If object already serialized. Just put in a reference
    const refIndex = objRefs.findIndex((x) => value === x);
    if (refIndex > -1) {
      serializedValues.push(serializeReference(refIndex));
      continue;
    }

    serializedValues.push(serializeAny(value));
  }

  // varint encode amount of kvPairs
  const kvPairsVarint = varintEncode(
    metadata.isSparse
      ? metadata.indexedLength + metadata.unindexedLength
      : metadata.unindexedLength,
  )[0];

  // varint encode length of array
  const indexedValuesVarint = varintEncode(array.length)[0];

  // Shift beginning byte and arrayLength into the Uint8Array[]
  serializedValues.unshift(
    new Uint8Array([indicatorByte, ...indexedValuesVarint]),
  );

  // Push array ending byte and lengths into the Uint8Array[]
  serializedValues.push(
    new Uint8Array([endingByte]),
    kvPairsVarint,
    indexedValuesVarint,
  );

  // Calculate the length for a new Uint8Array slice
  const length = serializedValues.reduce((x, y) => x + y.length, 0);
  // Create new slice
  const serializedArray = new Uint8Array(length);

  // Copy all Uint8Array's in `serializedValues` into `serializedArray`
  serializedValues.reduce((ptr, current) => {
    // Copy current dataslice to ptr
    serializedArray.set(current, ptr);
    return ptr + current.length;
  }, 0);

  // Return
  return serializedArray;
}

export function deserializeV8Array<T>(
  data: Uint8Array,
  // deno-lint-ignore ban-types
  objRefs: {}[] = [],
): T[] {
  if (data[0] as number !== 0x61 && data[0] !== 0x41) {
    throw new Error("Not a V8 array");
  }
  const startingByte = data[0];
  const endingByte = startingByte === 0x61 ? 0x40 : 0x24;

  const [arrayLength, bytesUsed] = varintDecode(data, 1);
  const arr: T[] = [];
  objRefs.push(arr);

  let useKvPairs = data[0] === 0x61 || arr.length === arrayLength;

  consume(data, bytesUsed);
  while (data[0] !== endingByte) {
    let key: string | number | undefined = undefined;
    if (useKvPairs) {
      key = data[0] === 0x63 || data[0] === 0x22
        ? deserializeV8String(data)
        : deserializeV8Integer(data);
    }

    let value: T;
    switch (data[0]) {
      // String
      case 0x63:
      case 0x22:
        value = deserializeV8String(data) as unknown as T;
        break;
      // Integer
      case 0x49:
        value = deserializeV8Integer(data) as unknown as T;
        break;
      // Bigint
      case 0x5A:
        value = deserializeV8BigInt(data) as unknown as T;
        break;
      // Float
      case 0x4E:
        value = deserializeV8Float(data) as unknown as T;
        break;
      // Boolean
      case 0x46:
      case 0x54:
        value = deserializeV8Boolean(data) as unknown as T;
        break;
      // Null
      case 0x30:
        value = deserializeV8Null(data) as unknown as T;
        break;
      // Undefined
      case 0x5F:
        value = deserializeV8Undefined(data) as unknown as T;
        break;
      // Array
      case 0x61:
      case 0x41:
        value = deserializeV8Array(data, objRefs) as unknown as T;
        break;
      case 0x5E:
        value = deserializeReference(data, objRefs) as unknown as T;
        break;
      default:
        throw new Error("Could not deserialize value");
    }

    if (key !== undefined) {
      arr[key as number] = value!;
    } else {
      arr.push(value!);
    }

    useKvPairs = useKvPairs || arr.length === arrayLength;
  }
  // Decode trailing varint's to know their byte length. Then return just that length.
  const tailBytesLength = varintDecode(data, varintDecode(data)[1])[1];
  // Consume tail bytes length + 1 (ending array byte)
  consume(data, tailBytesLength + 1);
  return arr;
}
