import { assertEquals, assertThrows } from "./_deps.ts";
import { deserializeV8Array, serializeJsArray } from "../references/array.ts";
import { DENO_CORE } from "./_core.ts";
import {
  associativeArray,
  denseArray,
  mixedArray,
  sparseArray,
} from "./_util.ts";

Deno.test({
  name: "Deserialize Dense Array",

  fn: async function (t) {
    await t.step({
      name: "Deserialize Dense Array: Empty Array",
      fn: function () {
        const input = DENO_CORE
          .serialize([])
          .subarray(2);

        assertEquals(input[0], 0x41);
        const res = deserializeV8Array(input);
        assertEquals(res, []);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Dense Array: Regular Array",
      fn: function () {
        const data = denseArray();

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        assertEquals(input[0], 0x41);
        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Dense Array: Associative Array",
      fn: function () {
        const data = associativeArray(denseArray());

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        assertEquals(input[0], 0x41);
        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Dense Array: Mixed Array",
      fn: function () {
        const data = mixedArray(true);

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        assertEquals(input[0], 0x41);
        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });
  },
});

Deno.test({
  name: "Deserialize Sparse Array",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Sparse Array: Object As Array",
      fn: function () {
        const input = DENO_CORE
          .serialize({})
          .subarray(2);
        assertThrows(() => deserializeV8Array(input));
      },
    });

    await t.step({
      name: "Deserialize Sparse Array: Regular Array",
      fn: function () {
        const data = sparseArray();

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        assertEquals(input[0], 0x61);
        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize Sparse Array: Mixed Array",
      fn: function () {
        const data = mixedArray(false);

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        assertEquals(input[0], 0x61);
        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });
  },
});

Deno.test({
  name: "Serialize Dense Array",
  fn: async function (t) {
    await t.step({
      name: "Serialize Dense Array: Empty Array",
      fn: function () {
        const data: string[] = [];
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res[0], 0x41);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Dense Array: Regular Array",
      fn: function () {
        const data = denseArray();

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Dense Array: Associative Array",
      fn: function () {
        const data = associativeArray(denseArray());

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);
        assertEquals(res[0], 0x41);
        assertEquals(ref, res);
      },
    });

    await t.step({
      name: "Serialize Dense Array: Mixed Array",
      fn: function () {
        const data = mixedArray(true);

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res[0], 0x41);
        assertEquals(res, ref);
      },
    });
  },
});

Deno.test({
  name: "Serialize Sparse Array",
  fn: async function (t) {
    await t.step({
      name: "Serialize Sparse Array: Object As Array",
      fn: function () {
        // deno-lint-ignore no-explicit-any
        assertThrows(() => serializeJsArray({} as any));
      },
    });

    await t.step({
      name: "Serialize Sparse Array: Regular Array",
      fn: function () {
        const data = sparseArray();
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res[0], 0x61);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Sparse Array: Mixed Array",
      fn: function () {
        const data = mixedArray(false);

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });
  },
});
