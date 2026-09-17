import type { ModelFactory, ModelProviderAdapter } from "./model-provider.js";
import { deepSeekProvider } from "./providers/deepseek.js";

/** Each factory owns its registry; registration never mutates global state. */
export function createModelFactory(
  adapters: readonly ModelProviderAdapter[]
): ModelFactory {
  const providers = new Map<string, ModelProviderAdapter>();
  for (const adapter of adapters) {
    if (!adapter.id.trim() || adapter.id !== adapter.id.trim()) {
      throw new Error("Model provider ID must be non-empty and trimmed.");
    }
    if (providers.has(adapter.id)) {
      throw new Error(`Duplicate model provider: ${adapter.id}`);
    }
    providers.set(adapter.id, adapter);
  }

  return (connection) => {
    const provider = providers.get(connection.provider);
    if (!provider) {
      throw new Error(`Unsupported model provider: ${connection.provider}`);
    }
    if (!connection.modelId.trim()) {
      throw new Error("Model ID must not be empty.");
    }
    return provider.createModel(connection);
  };
}

export const createModel = createModelFactory([deepSeekProvider]);
