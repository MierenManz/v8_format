import { deserializeV8Array, serializeJsArray } from "../src/array.ts";
import { DENO_CORE } from "../tests/_core.ts";
import { associativeArray, denseArray, sparseArray } from "../tests/_util.ts";
const DENSE_ARRAY = denseArray();
const SPARSE_ARRAY = sparseArray();
const ASSOCIATIVE_DENSE_ARRAY = associativeArray(denseArray());
const ASSOCIATIVE_SPARSE_ARRAY = associativeArray(sparseArray());

Deno.bench("nop", () => {});

Deno.bench({
  name: "Serialize Dense Array (v8)",
  group: "Serialize Dense",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(DENSE_ARRAY);
  },
});

Deno.bench({
  name: "Serialize Dense Array (js)",
  group: "Serialize Dense",
  fn: () => {
    serializeJsArray(DENSE_ARRAY);
  },
});

Deno.bench({
  name: "Deserialize Dense Array (v8)",
  group: "Deserialize Dense",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(DENSE_ARRAY);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Dense Array (js)",
  group: "Deserialize Dense",
  fn: () => {
    const buff = DENO_CORE.serialize(DENSE_ARRAY).subarray(2);
    deserializeV8Array(buff);
  },
});

Deno.bench({
  name: "Serialize Sparse Array (v8)",
  group: "Serialize Sparse",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(SPARSE_ARRAY);
  },
});

Deno.bench({
  name: "Serialize Sparse Array (js)",
  group: "Serialize Sparse",
  fn: () => {
    serializeJsArray(SPARSE_ARRAY);
  },
});

Deno.bench({
  name: "Deserialize Sparse Array (v8)",
  group: "Deserialize Sparse",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(SPARSE_ARRAY);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Sparse Array (js)",
  group: "Deserialize Sparse",
  fn: () => {
    const buff = DENO_CORE.serialize(SPARSE_ARRAY).subarray(2);
    deserializeV8Array(buff);
  },
});

Deno.bench({
  name: "Serialize Associative Dense Array (v8)",
  group: "Serialize Associative Dense",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(ASSOCIATIVE_DENSE_ARRAY);
  },
});

Deno.bench({
  name: "Serialize Associative Dense Array (js)",
  group: "Serialize Associative Dense",
  fn: () => {
    serializeJsArray(ASSOCIATIVE_DENSE_ARRAY);
  },
});

Deno.bench({
  name: "Deserialize Associative Dense Array (v8)",
  group: "Deserialize Associative Dense",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(ASSOCIATIVE_DENSE_ARRAY);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Associative Dense Array (js)",
  group: "Deserialize Associative Dense",
  fn: () => {
    const buff = DENO_CORE.serialize(ASSOCIATIVE_DENSE_ARRAY).subarray(2);
    deserializeV8Array(buff);
  },
});

Deno.bench({
  name: "Serialize Associative Sparse Array (v8)",
  group: "Serialize Associative Sparse",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(ASSOCIATIVE_SPARSE_ARRAY);
  },
});

Deno.bench({
  name: "Serialize Associative Sparse Array (js)",
  group: "Serialize Associative Sparse",
  fn: () => {
    serializeJsArray(ASSOCIATIVE_SPARSE_ARRAY);
  },
});

Deno.bench({
  name: "Deserialize Associative Sparse Array (v8)",
  group: "Deserialize Associative Sparse",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(ASSOCIATIVE_SPARSE_ARRAY);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Associative Sparse Array (js)",
  group: "Deserialize Associative Sparse",
  fn: () => {
    const buff = DENO_CORE.serialize(ASSOCIATIVE_SPARSE_ARRAY).subarray(2);
    deserializeV8Array(buff);
  },
});
