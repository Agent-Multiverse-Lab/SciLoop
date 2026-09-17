import type { ModelConnection, ModelProviderId } from "@sciloop/core";
import type { LanguageModel } from "ai";

export interface ModelProviderAdapter {
  readonly id: ModelProviderId;
  /** Validate provider-specific requirements before constructing the SDK model. */
  createModel(connection: ModelConnection): LanguageModel;
}

export type ModelFactory = (connection: ModelConnection) => LanguageModel;
