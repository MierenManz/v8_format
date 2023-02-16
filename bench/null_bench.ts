import { deserializeV8Null, serializeJsNull } from "../src/null.ts";
import { DENO_CORE } from "../tests/_core.ts";

Deno.bench({
  name: "Serialize Null (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(null);
  },
});
undefined;
Deno.bench({
  name: "Serialize Null (js)",
  group: "Serialize",
  fn: () => {
    serializeJsNull(null);
  },
});

const SERIALIZED_NULL = DENO_CORE.serialize(null);
Deno.bench({
  name: "Deserialize Null (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    DENO_CORE.deserialize(SERIALIZED_NULL);
  },
});

Deno.bench({
  name: "Deserialize Null (js)",
  group: "Deserialize",
  fn: () => {
    deserializeV8Null(serializeJsNull(null));
  },
});
