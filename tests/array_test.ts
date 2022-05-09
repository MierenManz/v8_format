import { assertEquals, assertThrows } from "./_deps.ts";
import { deserializeV8Array, serializeJsArray } from "../references/array.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize Dense Array",
  fn: async function (t) {
    await t.step({
      name: "Deserialize empty array",
      fn: function () {
        const input = DENO_CORE
          .serialize([])
          .subarray(2);

        const res = deserializeV8Array(input);
        assertEquals(res, []);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize regular array",
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
          [null],
        ];
        data.push(data);

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize associative array",
      fn: function () {
        // deno-lint-ignore no-explicit-any
        const data = [] as any;
        data[1.1] = null;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;
        data["arr"] = [null];

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize mixed array",
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
          [null],
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
        data["arr"] = [null];

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

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
      name: "Deserialize object as array",
      fn: function () {
        const input = DENO_CORE
          .serialize({})
          .subarray(2);
        assertThrows(() => deserializeV8Array(input));
      },
    });

    await t.step({
      name: "Deserialize regular array",
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
          [null],
        ];
        data.push(data);

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize associative array",
      fn: function () {
        // deno-fmt-ignore
        // deno-lint-ignore no-explicit-any
        const data = [,,] as any;
        data[1.1] = null;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;
        data["arr"] = null;

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = deserializeV8Array(input);
        assertEquals(res, data);
        assertEquals(input, new Uint8Array(input.length).fill(0));
      },
    });

    await t.step({
      name: "Deserialize mixed array",
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
          [null],
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
        data["arr"] = [null];

        const input = DENO_CORE
          .serialize(data)
          .subarray(2);

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
          [null],
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
        data[1.1] = null;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;
        data["arr"] = [null];

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
          [null],
          // deno-lint-ignore no-explicit-any
        ] as any;
        data.push(data);

        data[1.1] = null;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;
        data["arr"] = [null];

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
          [null],
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
        data[1.1] = null;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;
        data["arr"] = [null];

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
          [null],
          // deno-lint-ignore no-explicit-any
        ] as any;
        data.push(data);

        data[1.1] = null;
        data["key"] = "value";
        data["int"] = 12;
        data["float"] = 12.58;
        data["boolT"] = true;
        data["boolF"] = false;
        data["NULL"] = null;
        data["undefined"] = undefined;
        data["bigint"] = 12n;
        data["ref"] = data;
        data["arr"] = [null];

        const ref = DENO_CORE
          .serialize(data)
          .subarray(2);

        const res = serializeJsArray(data);

        assertEquals(res, ref);
      },
    });
  },
});
