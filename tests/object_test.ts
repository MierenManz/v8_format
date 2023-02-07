import {
  deserializeV8Object,
  serializeJsObject,
} from "../src/objects.ts";
import { DENO_CORE } from "./_core.ts";
import { fullObject } from "./_util.ts";
import { assertEquals, assertThrows } from "./_deps.ts";

Deno.test({
  name: "Deserialize V8 object",
  fn: async function (t) {
    await t.step({
      name: "Deserialize non-object",
      fn: function () {
        const data = DENO_CORE.serialize([]).subarray(2);
        assertThrows(() => deserializeV8Object(data));
      },
    });

    await t.step({
      name: "Deserialize Empty Object",
      fn: function () {
        const input = DENO_CORE
          .serialize({})
          .subarray(2);

        const res = deserializeV8Object(input);
        assertEquals(res, {});
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize self as ref",
      fn: function () {
        const data: Record<string, unknown> = {};
        data["self"] = data;
        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Object(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize string key",
      fn: function () {
        const data = { "key": null };

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Object(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize string key as int",
      fn: function () {
        const data = { "12": null };

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Object(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize string & int keys",
      fn: function () {
        const data = { "key": null, "12": null, 13: null };

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Object(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize full object",
      fn: function () {
        const data = fullObject();

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Object(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });
  },
});

Deno.test({
  name: "Serialize JS Object",
  fn: async function (t) {
    await t.step({
      name: "Serialize non-object",
      fn: function () {
        assertThrows(() => serializeJsObject([]));
      },
    });

    await t.step({
      name: "Serialize Empty Object",
      fn: function () {
        const data = {};
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsObject(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize self as ref",
      fn: function () {
        const data: Record<string, unknown> = {};
        data["self"] = data;

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsObject(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize string key",
      fn: function () {
        const data = { "key": null };
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsObject(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize string key as int",
      fn: function () {
        const data = { "12": null };
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsObject(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize string & int keys",
      fn: function () {
        const data = { "key": null, "12": null, 13: null };
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsObject(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize full object",
      fn: function () {
        const data = fullObject();
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsObject(data);

        assertEquals(res, ref);
      },
    });
  },
});
