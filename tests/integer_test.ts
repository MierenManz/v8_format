import { assertEquals, assertThrows } from "./_deps.ts";
import {
  deserializeV8Integer,
  serializeJsInteger,
} from "../references/integer.ts";
import { DENO_CORE } from "./_core.ts";

const MIN_INT_VALUE = -1_073_741_824;
const MAX_INT_VALUE = 1_073_741_823;

Deno.test({
  name: "Deserialize Integer",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Integer: Positive Integer",
      fn: function () {
        const input = DENO_CORE
          .serialize(12)
          .subarray(2);

        const res = deserializeV8Integer(input);
        assertEquals(res, 12);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Integer: Negative Integer",
      fn: function () {
        const input = DENO_CORE
          .serialize(-12)
          .subarray(2);

        const res = deserializeV8Integer(input);
        assertEquals(res, -12);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Integer: Max Integer",
      fn: function () {
        const input = DENO_CORE
          .serialize(MAX_INT_VALUE)
          .subarray(2);

        const res = deserializeV8Integer(input);
        assertEquals(res, MAX_INT_VALUE);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Integer: Min Integer",
      fn: function () {
        const input = DENO_CORE
          .serialize(MIN_INT_VALUE)
          .subarray(2);

        const res = deserializeV8Integer(input);
        assertEquals(res, MIN_INT_VALUE);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Integer: Non-Integer",
      fn: function () {
        const serializedBool = DENO_CORE
          .serialize(true)
          .subarray(2);

        assertThrows(() => deserializeV8Integer(serializedBool));
      },
    });
  },
});

Deno.test({
  name: "Serialize Integer",
  fn: async function (t) {
    await t.step({
      name: "Serialize Integer: Positive Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(12)
          .subarray(2);

        const res = serializeJsInteger(12);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Integer: Negative Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(-12)
          .subarray(2);

        const res = serializeJsInteger(-12);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Integer: Max Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(MAX_INT_VALUE)
          .subarray(2);

        const res = serializeJsInteger(MAX_INT_VALUE);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Integer: Min Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(MIN_INT_VALUE)
          .subarray(2);

        const res = serializeJsInteger(MIN_INT_VALUE);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Bad Integer",
      fn: function() {
        assertThrows(() => serializeJsInteger(MAX_INT_VALUE + 2));
      }
    })

    await t.step({
      name: "Serialize Integer: Non-Integer",
      fn: function () {
        assertThrows(() => serializeJsInteger(null as unknown as number), undefined, "Not a integer");
      },
    });
  },
});
