import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  deserializeV8Integer,
  serializeJsInteger,
} from "../references/integer.ts";
import { DENO_CORE } from "./core.ts";

const MIN_INT_VALUE = -1_073_741_824;
const MAX_INT_VALUE = 1_073_741_823;

Deno.test({
  name: "Deserialize Integer",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Positive Integer",
      fn: function () {
        const serializedInteger = DENO_CORE
          .serialize(12)
          .subarray(2);

        const res = deserializeV8Integer(serializedInteger);
        assertEquals(res, 12);
      },
    });

    await t.step({
      name: "Deserialize Negative Integer",
      fn: function () {
        const serializedInteger = DENO_CORE
          .serialize(-12)
          .subarray(2);

        const res = deserializeV8Integer(serializedInteger);
        assertEquals(res, -12);
      },
    });

    await t.step({
      name: "Deserialize Max Integer",
      fn: function () {
        const serializedInteger = DENO_CORE
          .serialize(MAX_INT_VALUE)
          .subarray(2);

        const res = deserializeV8Integer(serializedInteger);
        assertEquals(res, MAX_INT_VALUE);
      },
    });

    await t.step({
      name: "Deserialize Min Integer",
      fn: function () {
        const serializedInteger = DENO_CORE
          .serialize(MIN_INT_VALUE)
          .subarray(2);

        const res = deserializeV8Integer(serializedInteger);
        assertEquals(res, MIN_INT_VALUE);
      },
    });

    await t.step({
      name: "Deserialize non Integer",
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
      name: "Serialize Positive Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(12)
          .subarray(2);

        const res = serializeJsInteger(12);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Negative Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(-12)
          .subarray(2);

        const res = serializeJsInteger(-12);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Max Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(MAX_INT_VALUE)
          .subarray(2);

        const res = serializeJsInteger(MAX_INT_VALUE);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Min Integer",
      fn: function () {
        const ref = DENO_CORE
          .serialize(MIN_INT_VALUE)
          .subarray(2);

        const res = serializeJsInteger(MIN_INT_VALUE);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize non Integer",
      fn: function () {
        assertThrows(() => serializeJsInteger(null as unknown as number));
      },
    });
  },
});
