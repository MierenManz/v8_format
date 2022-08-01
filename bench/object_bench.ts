import {
  deserializeV8Object,
  serializeJsObject,
} from "../references/objects.ts";
import { DENO_CORE } from "../tests/_core.ts";
import { fullObject } from "../tests/_util.ts";

const INPUT = fullObject();

Deno.bench({
  name: "Serialize Object (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(INPUT);
  },
});

Deno.bench({
  name: "Serialize Object (js)",
  group: "Serialize",
  fn: () => {
    serializeJsObject(INPUT, []);
  },
});

Deno.bench({
  name: "Deserialize Object (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Object (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT).subarray(2);
    deserializeV8Object(buff, []);
  },
});
