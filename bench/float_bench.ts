import { deserializeV8Float, serializeJsFloat } from "../src/float.ts";
import { DENO_CORE } from "../tests/_core.ts";

const INPUT = Math.random() * 100;

Deno.bench("nop", () => {});

Deno.bench({
  name: "Serialize Float (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(INPUT);
  },
});

Deno.bench({
  name: "Serialize Float (js)",
  group: "Serialize",
  fn: () => {
    serializeJsFloat(INPUT);
  },
});

Deno.bench({
  name: "Deserialize Float (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Float (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT).subarray(2);
    deserializeV8Float(buff);
  },
});
