import { varintDecode, varintEncode } from "./_deps.ts";
import { consume, strIsIntIndex } from "./_util.ts";
import { deserializeV8Integer, serializeJsInteger } from "./integer.ts";
import { deserializeAny, serializeAny } from "./mod.ts";
import { deserializeV8String, serializeJsString } from "./string.ts";
import {
  deserializeReference,
  serializeReference,
} from "./object_reference.ts";
export function serializeJsObject(
  // deno-lint-ignore ban-types
  object: {},
  // deno-lint-ignore ban-types
  objRefs: {}[] = [],
): Uint8Array {
  if (object.constructor.name !== "Object") {
    throw new Error("Not a JS object");
  }

  if (objRefs.includes(object)) {
    return serializeReference(objRefs.length);
  } else {
    objRefs.push(object);
  }

  const values: Uint8Array[] = [Uint8Array.of(0x6F)];
  for (const [key, value] of Object.entries(object)) {
    const keySerialized = strIsIntIndex(key)
      ? serializeJsInteger(parseInt(key))
      : serializeJsString(key);
    values.push(keySerialized, serializeAny(value, objRefs));
  }

  // Push ending byte and length
  values.push(Uint8Array.of(0x7B), varintEncode(Object.keys(object).length)[0]);
  // Create new slice
  const serializedData = new Uint8Array(
    values.reduce((x, y) => x + y.length, 0),
  );

  // Copy all Uint8Array's in `values` into `serializedData`
  values.reduce((ptr, current) => {
    // Copy current dataslice to ptr
    serializedData.set(current, ptr);
    return ptr + current.length;
  }, 0);

  return serializedData;
}

export function deserializeV8Object<T>(
  data: Uint8Array,
  // deno-lint-ignore ban-types
  objRefs: {}[] = [],
): Record<string | number, T> {
  if (data[0] as number !== 0x6F) throw new Error("Not a v8 object");
  const obj: Record<string | number, T> = {};
  objRefs.push(obj);
  // Consume indicator byte
  consume(data, 1);

  while (data[0] !== 0x7B) {
    // Deserialize key as string or integer
    const key = data[0] === 0x63 || data[0] === 0x22
      ? deserializeV8String(data)
      : deserializeV8Integer(data);

    const value = deserializeAny(data, objRefs);

    obj[key] = value;
  }
  // TODO: assert that deserialized length is the one provided
  // Decode trailing varint's to know their byte length. Then return just that length.
  const tailBytesLength = varintDecode(data)[1];
  // Consume tail bytes length + 1 (ending array byte)
  consume(data, tailBytesLength + 1);

  return obj;
}
