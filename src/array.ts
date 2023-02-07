import { varintDecode, varintEncode } from "./_deps.ts";
import { arrayMetadata, consume } from "./_util.ts";
import { deserializeV8Integer, serializeJsInteger } from "./integer.ts";
import { deserializeAny, serializeAny } from "./mod.ts";
import { serializeReference } from "./object_reference.ts";
import { deserializeV8String, serializeJsString } from "./string.ts";

export function serializeJsArray<T>(
  array: T[],
  // deno-lint-ignore ban-types
  objRefs: {}[] = [],
): Uint8Array {
  if (!Array.isArray(array)) {
    throw new Error("Not a JS array");
  }

  const refIdx = objRefs.indexOf(array);
  if (refIdx > -1) {
    return serializeReference(refIdx);
  }
  objRefs.push(array);

  // parse metadata from array
  const metadata = arrayMetadata(array);
  const indicatorByte = metadata.isSparse ? 0x61 : 0x41;
  const endingByte = metadata.isSparse ? 0x40 : 0x24;

  // varint encode length of array
  const indexedValuesVarint = varintEncode(array.length)[0];
  const serializedValues = [
    Uint8Array.of(indicatorByte),
    indexedValuesVarint,
  ];

  let count = 0;
  for (const key in array) {
    // If key is not a valid v8 integer then serialize it as string.
    // Else if array is sparse serialize as v8 integer
    if (count >= metadata.indexedLength) {
      serializedValues.push(serializeJsString(key));
    } else if (metadata.isSparse) {
      serializedValues.push(serializeJsInteger(parseInt(key)));
    }
    count++;

    // Serialize value
    const value = array[key];

    // If object already serialized. Just put in a reference
    const refIndex = objRefs.findIndex((x) => value === x);
    if (refIndex > -1) {
      serializedValues.push(serializeReference(refIndex));
      continue;
    }

    serializedValues.push(serializeAny(value, objRefs));
  }

  // varint encode amount of kvPairs
  const kvPairsVarint = varintEncode(
    metadata.isSparse
      ? metadata.indexedLength + metadata.unindexedLength
      : metadata.unindexedLength,
  )[0];

  // Push array ending byte and lengths into the Uint8Array[]
  serializedValues.push(
    Uint8Array.of(endingByte),
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

    const value = deserializeAny(data, objRefs);
    if (key !== undefined) {
      arr[key as number] = value!;
    } else {
      arr.push(value!);
    }

    useKvPairs = useKvPairs || arr.length === arrayLength;
  }

  // TODO: assert that deserialized length is the one provided
  // Decode trailing varint's to know their byte length. Then return just that length.
  const tailBytesLength = varintDecode(data, varintDecode(data)[1])[1];
  // Consume tail bytes length + 1 (ending array byte)
  consume(data, tailBytesLength + 1);
  return arr;
}
