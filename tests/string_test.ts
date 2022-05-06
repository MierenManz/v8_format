import {
  deserializeV8String,
  serializeJsString,
} from "../references/string.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.138.0/testing/asserts.ts";
import { DENO_CORE } from "./core.ts";

Deno.test({
  name: "Deserialize String",
  fn: async function (t) {
    await t.step({
      name: "Deserialize One-Byte String",
      fn: function () {
        const serializedString = DENO_CORE
          .serialize("Hello World!")
          .subarray(2);

        const res = deserializeV8String(serializedString);

        assertEquals(res, "Hello World!");
      },
    });

    await t.step({
      name: "Deserialize Two-Byte String",
      fn: function () {
        const serializedString = DENO_CORE
          .serialize("Hello World! 😃")
          .subarray(2);

        const res = deserializeV8String(serializedString);

        assertEquals(res, "Hello World! 😃");
      },
      ignore: true,
    });
  },
});

Deno.test({
  name: "Serialize String",
  fn: async function (t) {
    await t.step({
      name: "Serialize One-Byte String",
      fn: function () {
        const ref = DENO_CORE
          .serialize("Hello World!")
          .subarray(2);

        const res = serializeJsString("Hello World!");

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize Two-Byte String",
      fn: function () {
        const ref = DENO_CORE
          .serialize("Hello World! 😃")
          .subarray(2);

        const res = serializeJsString("Hello World! 😃");

        assertEquals(res, ref);
      },
      ignore: true,
    });

    await t.step({
      name: "Serialize non string",
      fn: function () {
        assertThrows(() => serializeJsString(null as unknown as string));
      },
      ignore: true,
    });
  },
});
