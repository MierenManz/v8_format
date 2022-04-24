import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";

import {
  deserializeV8Undefined,
  serializeJsUndefined,
} from "../references/undefined.ts";

// deno-lint-ignore no-explicit-any
const DENO_CORE = (Deno as any).core;

Deno.test({
  name: "Deserialize undefined",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Undefined",
      fn: function () {
        const serializedUndefined = DENO_CORE
          .serialize(undefined)
          .subarray(2);

        const res = deserializeV8Undefined(serializedUndefined);
        assertEquals(res, undefined);
      },
    });

    await t.step({
      name: "Deserialize non undefined",
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
      name: "Serialize undefined",
      fn: function () {
        const ref = DENO_CORE
          .serialize(undefined)
          .subarray(2);

        const res = serializeJsUndefined(undefined);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize non undefined",
      fn: function () {
        assertThrows(() => serializeJsUndefined(null as unknown as undefined));
      },
    });
  },
});
