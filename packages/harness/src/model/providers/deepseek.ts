import { createDeepSeek } from "@ai-sdk/deepseek";
import type { ModelConnection } from "@sciloop/core";
import type { LanguageModel } from "ai";
import type { ModelProviderAdapter } from "../model-provider.js";

export function createDeepSeekModel(
  connection: ModelConnection
): LanguageModel {
  if (!connection.credential?.trim()) {
    throw new Error("DeepSeek requires a model credential.");
  }
  const provider = createDeepSeek({
    apiKey: connection.credential,
    ...(connection.endpoint ? { baseURL: connection.endpoint } : {})
  });

  return provider(connection.modelId);
}

export const deepSeekProvider: ModelProviderAdapter = {
  id: "deepseek",
  createModel: createDeepSeekModel
};
