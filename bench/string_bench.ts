import {
  deserializeV8String,
  serializeJsString,
} from "../references/string.ts";
import { DENO_CORE } from "../tests/_core.ts";

const INPUT = "Hello Beautiful World!";

Deno.bench({
  name: "Serialize String (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(INPUT);
  },
});

Deno.bench({
  name: "Serialize String (js)",
  group: "Serialize",
  fn: () => {
    serializeJsString(INPUT);
  },
});

Deno.bench({
  name: "Deserialize String (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize String (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT).subarray(2);
    deserializeV8String(buff);
  },
});
