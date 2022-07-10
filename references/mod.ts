import { deserializeV8Array, serializeJsArray } from "./array.ts";
import { deserializeV8BigInt, serializeJsBigInt } from "./bigint.ts";
import { deserializeV8Boolean, serializeJsBoolean } from "./boolean.ts";
import { deserializeV8Float, serializeJsFloat } from "./float.ts";
import { deserializeReference } from "./object_reference.ts";
import { deserializeV8Integer, serializeJsInteger } from "./integer.ts";
import { deserializeV8Null, serializeJsNull } from "./null.ts";
import { deserializeV8String, serializeJsString } from "./string.ts";
import { deserializeV8Undefined, serializeJsUndefined } from "./undefined.ts";
import { deserializeV8Object, serializeJsObject } from "./objects.ts";
import { isValidInt } from "./_util.ts";
// deno-lint-ignore no-explicit-any ban-types
export function serializeAny(value: any, objRefs: {}[] = []): Uint8Array {
  switch (typeof value) {
    case "bigint":
      return serializeJsBigInt(value);
    case "boolean":
      return serializeJsBoolean(value);
    case "number": {
      return isValidInt(value)
        ? serializeJsInteger(value)
        : serializeJsFloat(value);
    }

    case "string":
      return serializeJsString(value);
    case "undefined":
      return serializeJsUndefined(value);
    case "object": {
      if (value === null) {
        // Null
        return serializeJsNull(value);
      }

      if (Array.isArray(value)) {
        // Array (either dense or sparse)
        return serializeJsArray(value, objRefs);
      }

      if (value instanceof Object) {
        // Plain object
        return serializeJsObject(value, objRefs);
      }

      throw new Error("Object cannot be serialized");
    }
    default:
      throw new Error("Type cannot be serialized");
  }
}

// deno-lint-ignore no-explicit-any ban-types
export function deserializeAny(data: Uint8Array, objRefs: {}[] = []): any {
  switch (data[0]) {
    // String
    case 0x63:
    case 0x22:
      return deserializeV8String(data);
    // Integer
    case 0x49:
      return deserializeV8Integer(data);
    // Bigint
    case 0x5A:
      return deserializeV8BigInt(data);
    // Float
    case 0x4E:
      return deserializeV8Float(data);
    // Boolean
    case 0x46:
    case 0x54:
      return deserializeV8Boolean(data);
    // Null
    case 0x30:
      return deserializeV8Null(data);
    // Undefined
    case 0x5F:
      return deserializeV8Undefined(data);
    // Array
    case 0x61:
    case 0x41:
      return deserializeV8Array(data, objRefs);
    // Object Reference
    case 0x5E:
      return deserializeReference(data, objRefs);
    // Object
    case 0x6F:
      return deserializeV8Object(data, objRefs);
    default:
      throw new Error("Could not deserialize value");
  }
}
