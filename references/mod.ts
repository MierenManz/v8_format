import { serializeJsArray } from "./array.ts";
import { serializeJsBigInt } from "./bigint.ts";
import { serializeJsBoolean } from "./boolean.ts";
import { serializeJsFloat } from "./float.ts";
import { serializeJsInteger } from "./integer.ts";
import { serializeJsNull } from "./null.ts";
import { serializeJsString } from "./string.ts";
import { serializeJsUndefined } from "./undefined.ts";

// deno-lint-ignore no-explicit-any ban-types
export function serializeAny(value: any, objRefs: {}[] = []): Uint8Array {
  switch (typeof value) {
    case "bigint":
      return serializeJsBigInt(value);
    case "boolean":
      return serializeJsBoolean(value);
    case "number": {
      let serialized: Uint8Array;
      try {
        serialized = serializeJsInteger(value);
      } catch {
        serialized = serializeJsFloat(value);
      }

      return serialized;
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
        objRefs.push(value);
        return serializeJsArray(value, objRefs);
      }

      if (value instanceof Object) {
        // Plain object
        objRefs.push(value);
        // return serializeObject(value, objRefs);
      }

      throw new Error("Object cannot be serialized");
    }
    default:
      throw new Error("Type cannot be serialized");
  }
}
