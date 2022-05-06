import { arrayMetadata } from "./util.ts";
import { encode as varintEncode } from "https://deno.land/x/varint@v2.0.0/varint.ts";
import { serializeJsString } from "./string.ts";
import { serializeJsInteger } from "./integer.ts";
import { serializeJsNull } from "./null.ts";
import { serializeJsFloat } from "./float.ts";
import { serializeJsUndefined } from "./undefined.ts";
import { serializeJsBigInt } from "./bigint.ts";
import { serializeJsBoolean } from "./boolean.ts";
import { serializeReference } from "./object_reference.ts";

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
    const keyAsInt = parseInt(key);
    // If key is not a number (eg is a string) then serialize it as kv pair
    if (Number.isNaN(keyAsInt)) {
      serializedValues.push(serializeJsString(key));
      // If key is a int and array is sparse then serialize as kv pair
    } else if (metadata.isSparse) {
      serializedValues.push(serializeJsInteger(keyAsInt));
    }

    // Serialize value
    const value = array[key];

    // If object already serialized. Just put in a reference
    const refIndex = objRefs.findIndex((x) => value === x);
    if (refIndex > -1) {
      serializedValues.push(serializeReference(refIndex));
      continue;
    }

    switch (typeof value) {
      case "bigint":
        serializedValues.push(serializeJsBigInt(value));
        break;
      case "boolean":
        serializedValues.push(serializeJsBoolean(value));
        break;
      case "number": {
        let serialized: Uint8Array;
        try {
          serialized = serializeJsInteger(value);
        } catch {
          serialized = serializeJsFloat(value);
        } finally {
          serializedValues.push(serialized!);
        }
        break;
      }

      case "string":
        serializedValues.push(serializeJsString(value));
        break;
      case "undefined":
        serializedValues.push(serializeJsUndefined(value));
        break;
      case "object": {
        if (value === null) {
          // Null
          serializedValues.push(serializeJsNull(value as unknown as null));
          continue;
        }

        if (Array.isArray(value)) {
          // Array (either dense or sparse)
          serializedValues.push(serializeJsArray(value));
          objRefs.push(value);
          continue;
        }

        if (value instanceof Object) {
          // Plain object
          objRefs.push(value);
          continue;
        }

        throw new Error("Object cannot be serialized");
      }
      default:
        throw new Error("Type cannot be serialized");
    }
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
