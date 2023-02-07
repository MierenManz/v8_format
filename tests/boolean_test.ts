import { assertEquals, assertThrows } from "./_deps.ts";
import {
  deserializeV8Boolean,
  serializeJsBoolean,
} from "../src/boolean.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize Boolean",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Boolean: True",
      fn: function () {
        const input = DENO_CORE
          .serialize(true)
          .subarray(2);

        const s = deserializeV8Boolean(input);

        assertEquals(s, true);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Boolean: False",
      fn: function () {
        const input = DENO_CORE
          .serialize(false)
          .subarray(2);

        const s = deserializeV8Boolean(input);

        assertEquals(s, false);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Boolean: Not A Boolean",
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
      name: "Serialize Boolean: True",
      fn: function () {
        const ref = DENO_CORE
          .serialize(true)
          .subarray(2);

        const res = serializeJsBoolean(true);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Boolean: False",
      fn: function () {
        const ref = DENO_CORE
          .serialize(false)
          .subarray(2);

        const res = serializeJsBoolean(false);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Boolean: Not A Boolean",
      fn: function () {
        assertThrows(() => serializeJsBoolean(0 as unknown as boolean));
      },
    });
  },
});
