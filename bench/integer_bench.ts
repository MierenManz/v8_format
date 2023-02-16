import { deserializeV8Integer, serializeJsInteger } from "../src/integer.ts";
import { DENO_CORE } from "../tests/_core.ts";

const INPUT = Math.random() * 100 | 0;
const MIN_INT_VALUE = -1_073_741_824;
const MAX_INT_VALUE = 1_073_741_823;

Deno.bench("nop", () => {});

Deno.bench({
  name: "Serialize Integer (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(MIN_INT_VALUE);
    DENO_CORE.serialize(INPUT);
    DENO_CORE.serialize(MAX_INT_VALUE);
  },
});

Deno.bench({
  name: "Serialize Integer (js)",
  group: "Serialize",
  fn: () => {
    serializeJsInteger(MIN_INT_VALUE);
    serializeJsInteger(INPUT);
    serializeJsInteger(MAX_INT_VALUE);
  },
});

Deno.bench({
  name: "Deserialize Integer (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff0 = DENO_CORE.serialize(INPUT);
    const buff1 = DENO_CORE.serialize(MIN_INT_VALUE);
    const buff2 = DENO_CORE.serialize(MAX_INT_VALUE);
    DENO_CORE.deserialize(buff0);
    DENO_CORE.deserialize(buff1);
    DENO_CORE.deserialize(buff2);
  },
});

Deno.bench({
  name: "Deserialize Integer (js)",
  group: "Deserialize",
  fn: () => {
    const buff0 = DENO_CORE.serialize(INPUT).subarray(2);
    const buff1 = DENO_CORE.serialize(MIN_INT_VALUE).subarray(2);
    const buff2 = DENO_CORE.serialize(MAX_INT_VALUE).subarray(2);
    deserializeV8Integer(buff0);
    deserializeV8Integer(buff1);
    deserializeV8Integer(buff2);
  },
});
