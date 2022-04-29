import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { serializeJsArray } from "../references/array.ts";

// deno-lint-ignore no-explicit-any
const DENO_CORE = (Deno as any).core;

Deno.test({
  name: "Serialize Dense Array",
  fn: async function (t) {
    await t.step({
      name: "Serialize empty array",
      fn: function () {
        const data: string[] = [];
        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "Serialize regular array",
      fn: function () {
        const data: unknown[] = [
          "value",
          12,
          12.58,
          true,
          false,
          null,
          undefined,
          12n,
        ];
        data.push(data);

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "serialize associative array",
      fn: function () {
        // deno-lint-ignore no-explicit-any
        const data = [] as any;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);
        assertEquals(ref, res);
      },
    });

    await t.step({
      name: "Serialize mixed array",
      fn: function () {
        const data = [
          "value",
          12,
          12.58,
          true,
          false,
          null,
          undefined,
          12n,
          // deno-lint-ignore no-explicit-any
        ] as any;
        data.push(data);

        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });
  },
});

Deno.test({
  name: "Serialize Sparse Array",
  fn: async function (t) {
    await t.step({
      name: "Serialize object as array",
      fn: function () {
        // deno-lint-ignore no-explicit-any
        assertThrows(() => serializeJsArray({} as any));
      },
    });
    await t.step({
      name: "Serialize regular array",
      fn: function () {
        const data: unknown[] = [
          "value",
          12,
          12.58,
          true,
          false,
          null,
          undefined,
          ,
          12n,
        ];
        data.push(data);

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });

    await t.step({
      name: "serialize associative array",
      fn: function () {
        // deno-fmt-ignore
        // deno-lint-ignore no-explicit-any
        const data = [,,] as any;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);
        assertEquals(ref, res);
      },
    });

    await t.step({
      name: "Serialize mixed array",
      fn: function () {
        const data = [
          "value",
          12,
          12.58,
          true,
          false,
          null,
          undefined,
          ,
          12n,
          // deno-lint-ignore no-explicit-any
        ] as any;
        data.push(data);

        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });
  },
});
