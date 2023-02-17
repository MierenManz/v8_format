import { assertEquals, assertThrows } from "./_deps.ts";
import { deserializeV8BigInt, serializeJsBigInt } from "../src/bigint.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize BigInt",
  fn: async function (t) {
    await t.step({
      name: "Deserialize BigInt: Positive BigInt",
      fn: function () {
        const input = DENO_CORE
          .serialize(12n)
          .subarray(2);

        const res = deserializeV8BigInt(input);
        assertEquals(res, 12n);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize BigInt: Negative BigInt",
      fn: function () {
        const input = DENO_CORE
          .serialize(-12n)
          .subarray(2);

        const res = deserializeV8BigInt(input);
        assertEquals(res, -12n);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize BigInt: Number.MAX_VALUE as BigInt",
      fn: function () {
        const input = DENO_CORE
          .serialize(BigInt(Number.MAX_VALUE))
          .subarray(2);

        const res = deserializeV8BigInt(input);
        assertEquals(res, BigInt(Number.MAX_VALUE));
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize BigInt: Number.MIN_VALUE as BigInt",
      fn: function () {
        const input = DENO_CORE
          .serialize(BigInt(Number.MIN_VALUE | 0))
          .subarray(2);

        const res = deserializeV8BigInt(input);
        assertEquals(res, BigInt(Number.MIN_VALUE | 0));
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize BigInt: Invalid BigInt",
      fn: function () {
        const serializedNumber = DENO_CORE
          .serialize(12)
          .subarray(2);

        assertThrows(() => deserializeV8BigInt(serializedNumber));
      },
    });
  },
});

Deno.test({
  name: "Serialize BigInt",
  fn: async function (t) {
    await t.step({
      name: "Serialize BigInt: Positive BigInt",
      fn: function () {
        const ref = DENO_CORE
          .serialize(12n)
          .subarray(2);

        const res = serializeJsBigInt(12n);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize BigInt: Negative BigInt",
      fn: function () {
        const ref = DENO_CORE
          .serialize(-12n)
          .subarray(2);

        const res = serializeJsBigInt(-12n);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize BigInt: Number.MAX_VALUE as BigInt",
      fn: function () {
        const ref = DENO_CORE
          .serialize(BigInt(Number.MAX_VALUE))
          .subarray(2);

        const res = serializeJsBigInt(BigInt(Number.MAX_VALUE));

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize BigInt: Number.MIN_VALUE as BigInt",
      fn: function () {
        const ref = DENO_CORE
          .serialize(BigInt(Number.MIN_VALUE | 0))
          .subarray(2);

        const res = serializeJsBigInt(BigInt(Number.MIN_VALUE | 0));

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize BigInt: Bad BigInt",
      fn: function () {
        assertThrows(() => serializeJsBigInt(12 as unknown as bigint));
      },
    });
  },
});
