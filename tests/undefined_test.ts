import { assertEquals, assertThrows } from "./_deps.ts";
import {
  deserializeV8Undefined,
  serializeJsUndefined,
} from "../references/undefined.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize Undefined",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Undefined: Undefined",
      fn: function () {
        const serializedUndefined = DENO_CORE
          .serialize(undefined)
          .subarray(2);

        const res = deserializeV8Undefined(serializedUndefined);
        assertEquals(res, undefined);
      },
    });

    await t.step({
      name: "Deserialize Undefined: Not Undefined",
      fn: function () {
        const serializedUndefined = DENO_CORE
          .serialize(null)
          .subarray(2);

        assertThrows(() => deserializeV8Undefined(serializedUndefined));
      },
    });
  },
});

Deno.test({
  name: "Serialize Undefined",
  fn: async function (t) {
    await t.step({
      name: "Serialize Undefined: Undefined",
      fn: function () {
        const ref = DENO_CORE
          .serialize(undefined)
          .subarray(2);

        const res = serializeJsUndefined(undefined);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Undefined: Not Undefined",
      fn: function () {
        assertThrows(() => serializeJsUndefined(null as unknown as undefined));
      },
    });
  },
});
