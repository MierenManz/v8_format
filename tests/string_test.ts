import {
  deserializeV8String,
  serializeJsString,
} from "../src/string.ts";
import { assertEquals, assertThrows } from "./_deps.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize String",
  fn: async function (t) {
    await t.step({
      name: "Deserialize String: One-Byte String",
      fn: function () {
        const input = DENO_CORE
          .serialize("Hello World!")
          .subarray(2);

        const res = deserializeV8String(input);
        assertEquals(res, "Hello World!");
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize String: Two-Byte String",
      fn: function () {
        const input = DENO_CORE
          .serialize("Hello World! 😃")
          .subarray(2);

        const res = deserializeV8String(input);
        assertEquals(res, "Hello World! 😃");
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize String: Non-String",
      fn: function () {
        const input = DENO_CORE
          .serialize(null)
          .subarray(2);

        assertThrows(() => deserializeV8String(input));
      },
    });
  },
});

Deno.test({
  name: "Serialize String",
  fn: async function (t) {
    await t.step({
      name: "Serialize String: One-Byte String",
      fn: function () {
        const ref = DENO_CORE
          .serialize("Hello World!")
          .subarray(2);

        const res = serializeJsString("Hello World!");

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize String: Two-Byte String",
      fn: function () {
        const ref = DENO_CORE
          .serialize("Hello World! 😃")
          .subarray(2);

        const res = serializeJsString("Hello World! 😃");

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize String: Non-String",
      fn: function () {
        assertThrows(() => serializeJsString(null as unknown as string));
      },
    });
  },
});
