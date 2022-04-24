import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { deserializeV8Null, serializeJsNull } from "../references/null.ts";

// deno-lint-ignore no-explicit-any
const DENO_CORE = (Deno as any).core;

Deno.test({
  name: "Deserialize null",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Null",
      fn: function () {
        const serializedNull = DENO_CORE
          .serialize(null)
          .subarray(2);

        const res = deserializeV8Null(serializedNull);
        assertEquals(res, null);
      },
    });

    await t.step({
      name: "Deserialize non null",
      fn: function () {
        const serializedUndefined = DENO_CORE
          .serialize(undefined)
          .subarray(2);

        assertThrows(() => deserializeV8Null(serializedUndefined));
      },
    });
  },
});

Deno.test({
  name: "Serialize Null",
  fn: async function (t) {
    await t.step({
      name: "Serialize null",
      fn: function () {
        const ref = DENO_CORE
          .serialize(null)
          .subarray(2);

        const res = serializeJsNull(null);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize non null",
      fn: function () {
        assertThrows(() => serializeJsNull(undefined as unknown as null));
      },
    });
  },
});
