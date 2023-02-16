import { deserializeV8Boolean, serializeJsBoolean } from "../src/boolean.ts";
import { DENO_CORE } from "../tests/_core.ts";

Deno.bench("nop", () => {});

Deno.bench({
  name: "Serialize Boolean (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(true);
    DENO_CORE.serialize(false);
  },
});

Deno.bench({
  name: "Serialize Boolean (js)",
  group: "Serialize",
  fn: () => {
    serializeJsBoolean(true);
    serializeJsBoolean(false);
  },
});

Deno.bench({
  name: "Deserialize Boolean (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(true);
    DENO_CORE.deserialize(buff);
    const buff2 = DENO_CORE.serialize(false);
    DENO_CORE.deserialize(buff2);
  },
});

Deno.bench({
  name: "Deserialize Boolean (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(true).subarray(2);
    deserializeV8Boolean(buff);
    const buff2 = DENO_CORE.serialize(false).subarray(2);
    deserializeV8Boolean(buff2);
  },
});
