import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  deserializeV8Boolean,
  serializeJsBoolean,
} from "../references/boolean.ts";
import { DENO_CORE } from "./core.ts";

Deno.test({
  name: "Deserialize Boolean",
  fn: async function (t) {
    await t.step({
      name: "Deserialize true",
      fn: function () {
        const serializedBoolean = DENO_CORE
          .serialize(true)
          .subarray(2);

        const s = deserializeV8Boolean(serializedBoolean);

        assertEquals(s, true);
      },
    });

    await t.step({
      name: "Deserialize false",
      fn: function () {
        const serializedBoolean = DENO_CORE
          .serialize(false)
          .subarray(2);

        const s = deserializeV8Boolean(serializedBoolean);

        assertEquals(s, false);
      },
    });

    await t.step({
      name: "Deserialize not a boolean",
      fn: function () {
        const serializedBoolean = DENO_CORE
          .serialize(0)
          .subarray(2);

        assertThrows(() => deserializeV8Boolean(serializedBoolean));
      },
    });
  },
});

Deno.test({
  name: "Serialize Boolean",
  fn: async function (t) {
    await t.step({
      name: "Serialize true",
      fn: function () {
        const ref = DENO_CORE
          .serialize(true)
          .subarray(2);

        const res = serializeJsBoolean(true);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize false",
      fn: function () {
        const ref = DENO_CORE
          .serialize(false)
          .subarray(2);

        const res = serializeJsBoolean(false);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize not a boolean",
      fn: function () {
        assertThrows(() => serializeJsBoolean(0 as unknown as boolean));
      },
    });
  },
});
