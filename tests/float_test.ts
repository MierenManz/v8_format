import { deserializeV8Float, serializeJsFloat } from "../references/float.ts";
import { DENO_CORE } from "./_core.ts";
import { assertEquals, assertThrows } from "./_deps.ts";

Deno.test({
  name: "Deserialize Float",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Positive Float",
      fn: function () {
        const input = DENO_CORE
          .serialize(12.69)
          .subarray(2);

        const res = deserializeV8Float(input);

        assertEquals(res, 12.69);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Positive Float",
      fn: function () {
        const input = DENO_CORE
          .serialize(12.69)
          .subarray(2);

        const res = deserializeV8Float(input);

        assertEquals(res, 12.69);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Positive Float",
      fn: function () {
        const input = DENO_CORE
          .serialize(12.69)
          .subarray(2);

        const res = deserializeV8Float(input);

        assertEquals(res, 12.69);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Serialize Number.MAX_SAFE_INTEGER + 0.69",
      fn: function () {
        const input = DENO_CORE
          .serialize(Number.MAX_SAFE_INTEGER + 0.69)
          .subarray(2);
        const res = deserializeV8Float(input);

        assertEquals(res, Number.MAX_SAFE_INTEGER + 0.69);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Number.MIN_VALUE",
      fn: function () {
        const input = DENO_CORE
          .serialize(Number.MIN_VALUE)
          .subarray(2);

        const res = deserializeV8Float(input);

        assertEquals(res, Number.MIN_VALUE);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Number.EPSILON",
      fn: function () {
        const input = DENO_CORE
          .serialize(Number.EPSILON)
          .subarray(2);
        const res = deserializeV8Float(input);

        assertEquals(res, Number.EPSILON);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize non float",
      fn: function () {
        const input = DENO_CORE
          .serialize(10)
          .subarray(2);
        assertThrows(() => deserializeV8Float(input));
      },
    });
  },
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

    await t.step({
      name: "Serialize non float",
      fn: function () {
        assertThrows(() => serializeJsFloat(10));
      },
    });
  },
});
