import assert from "node:assert/strict";
import test from "node:test";
import { loadModelConnection } from "../dist/main/config/model-config.js";

test("legacy DeepSeek configuration is preserved", () => {
  assert.deepEqual(loadModelConnection({ DEEPSEEK_API_KEY: " key " }), {
    provider: "deepseek", modelId: "deepseek-v4-flash", credential: "key"
  });
});

test("generic configuration takes precedence over legacy aliases", () => {
  assert.deepEqual(loadModelConnection({
    DEEPSEEK_API_KEY: "old", DEEPSEEK_BASE_URL: "https://old.example",
    SCILOOP_MODEL_API_KEY: "new", SCILOOP_MODEL_BASE_URL: "https://new.example",
    SCILOOP_MODEL_ID: "other-model"
  }), { provider: "deepseek", modelId: "other-model", credential: "new", endpoint: "https://new.example" });
});

test("custom providers do not inherit DeepSeek credentials or defaults", () => {
  const environment = { SCILOOP_MODEL_PROVIDER: "local", DEEPSEEK_API_KEY: "secret" };
  assert.throws(() => loadModelConnection(environment), /SCILOOP_MODEL_ID/);
  assert.deepEqual(loadModelConnection({ ...environment, SCILOOP_MODEL_ID: "local-model" }), {
    provider: "local", modelId: "local-model"
  });
});
