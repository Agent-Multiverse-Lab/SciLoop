import assert from "node:assert/strict";
import test from "node:test";
import { createModel, createModelFactory, deepSeekProvider, runAgentConversation } from "../dist/index.js";

test("custom providers receive the connection without requiring credentials", () => {
  const model = { modelId: "local" };
  const connection = { provider: "local", modelId: "local", options: { region: "test" } };
  const factory = createModelFactory([{
    id: "local",
    createModel(input) { assert.equal(input, connection); return model; }
  }]);
  assert.equal(factory(connection), model);
  assert.throws(() => createModel(connection), /Unsupported model provider/);
});

test("registration and dispatch reject ambiguous or invalid configuration", () => {
  assert.throws(() => createModelFactory([deepSeekProvider, deepSeekProvider]), /Duplicate/);
  assert.throws(() => createModelFactory([{ id: " " }]), /provider ID/);
  assert.throws(() => createModel({ provider: "missing", modelId: "test" }), /Unsupported/);
  assert.throws(() => createModel({ provider: "deepseek", modelId: " " }), /Model ID/);
  assert.throws(() => createModel({ provider: "deepseek", modelId: "test" }), /credential/);
});

test("DeepSeek remains available without making a network request", () => {
  const model = createModel({ provider: "deepseek", modelId: "test-model", credential: "test-key" });
  assert.equal(model.modelId, "test-model");
});

test("Agent uses the injected factory", async () => {
  const marker = new Error("injected factory reached");
  await assert.rejects(runAgentConversation({
    connection: { provider: "custom", modelId: "test" },
    modelFactory() { throw marker; },
    messages: [{ role: "user", content: "hello" }],
    signal: new AbortController().signal,
    onTextDelta() {}
  }), (error) => error === marker);
});
