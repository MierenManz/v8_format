import { assertEquals, assertThrows } from "./_deps.ts";
import { deserializeV8Null, serializeJsNull } from "../references/null.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize Null",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Null: Null",
      fn: function () {
        const input = DENO_CORE
          .serialize(null)
          .subarray(2);

        const res = deserializeV8Null(input);
        assertEquals(res, null);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Null: Non-Null",
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
      name: "Serialize Null: Null",
      fn: function () {
        const ref = DENO_CORE
          .serialize(null)
          .subarray(2);

        const res = serializeJsNull(null);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Null: Non-Null",
      fn: function () {
        assertThrows(() => serializeJsNull(undefined as unknown as null));
      },
    });
  },
});
