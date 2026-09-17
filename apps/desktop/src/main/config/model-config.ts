import type { ModelConnection, ModelProviderId } from "@sciloop/core";

const DEFAULT_MODEL_PROVIDER: ModelProviderId = "deepseek";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";

export function loadModelConnection(
  environment: NodeJS.ProcessEnv = process.env
): ModelConnection {
  const provider =
    environment.SCILOOP_MODEL_PROVIDER?.trim() || DEFAULT_MODEL_PROVIDER;

  // Legacy aliases are confined to the application configuration boundary.
  const isDeepSeek = provider === "deepseek";
  const modelId = environment.SCILOOP_MODEL_ID?.trim() ||
    (isDeepSeek ? DEFAULT_DEEPSEEK_MODEL : undefined);
  if (!modelId) {
    throw new Error("SCILOOP_MODEL_ID is not configured.");
  }
  const credential = environment.SCILOOP_MODEL_API_KEY?.trim() ||
    (isDeepSeek ? environment.DEEPSEEK_API_KEY?.trim() : undefined);
  const endpoint = environment.SCILOOP_MODEL_BASE_URL?.trim() ||
    (isDeepSeek ? environment.DEEPSEEK_BASE_URL?.trim() : undefined);
  return {
    provider,
    modelId,
    ...(credential ? { credential } : {}),
    ...(endpoint ? { endpoint } : {})
  };
}
