import { deserializeV8Float, serializeJsFloat } from "../references/float.ts";
import { DENO_CORE } from "./core.ts";
import { assertEquals } from "https://deno.land/std@0.138.0/testing/asserts.ts";

Deno.test({
  name: "Deserialize Float",
  fn: async function (t) {},
});

Deno.test({
  name: "Serialize Float",
  fn: async function (t) {
    await t.step({
      name: "Serialize Positive Float",
      fn: function () {
        const ref = DENO_CORE
          .serialize(12.69)
          .subarray(2);

        const res = serializeJsFloat(12.69);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Negative Float",
      fn: function () {
        const ref = DENO_CORE
          .serialize(-12.69)
          .subarray(2);

        const res = serializeJsFloat(-12.69);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Number.MAX_SAFE_INTEGER + 0.69",
      fn: function () {
        const ref = DENO_CORE
          .serialize(Number.MAX_SAFE_INTEGER + 0.69)
          .subarray(2);

        const res = serializeJsFloat(Number.MAX_SAFE_INTEGER + 0.69);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Number.MIN_VALUE",
      fn: function () {
        const ref = DENO_CORE
          .serialize(Number.MIN_VALUE)
          .subarray(2);

        const res = serializeJsFloat(Number.MIN_VALUE);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Number.EPSILON",
      fn: function () {
        const ref = DENO_CORE
          .serialize(Number.EPSILON)
          .subarray(2);

        const res = serializeJsFloat(Number.EPSILON);

        assertEquals(res, ref);
      },
    });
  },
});
