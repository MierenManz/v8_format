import { assertEquals, assertThrows } from "./_deps.ts";
import {
  deserializeArrayBuffer,
  serializeArrayBuffer,
} from "../references/array_buffer.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Serialize ArrayBuffer",
  fn: async function (t) {
    await t.step({
      name: "Serialize Empty AB",
      fn: function () {
        const ab = new ArrayBuffer(4);
        const ref = DENO_CORE.serialize(ab).subarray(2);
        const res = serializeArrayBuffer(ab);
        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Full AB",
      fn: function () {
        const view = Uint8Array.of(1, 2, 3, 4);
        const ref = DENO_CORE.serialize(view.buffer).subarray(2);
        const res = serializeArrayBuffer(view.buffer);
        assertEquals(res, ref);
      },
    });
  },
});

Deno.test({
  name: "Deserialize ArrayBuffer",
  fn: async function (t) {
    await t.step({
      name: "Deserialize Empty ArrayBuffer",
      fn: function () {
        const ab = new ArrayBuffer(4);
        const input = DENO_CORE.serialize(ab).subarray(2);
        const res = deserializeArrayBuffer(input);
        assertEquals(new Uint8Array(res), new Uint8Array(ab));
      },
    });

    await t.step({
      name: "Deserialize Full ArrayBuffer",
      fn: function () {
        const ab = Uint8Array.of(1, 2, 3, 4).buffer;
        const input = DENO_CORE.serialize(ab).subarray(2);
        const res = deserializeArrayBuffer(input);
        assertEquals(new Uint8Array(res), new Uint8Array(ab));
      },
    });

    await t.step({
      name: "Deserialize non ArrayBuffer",
      fn: function () {
        assertThrows(() => deserializeArrayBuffer(DENO_CORE.serialize(12)));
      },
    });
  },
});
