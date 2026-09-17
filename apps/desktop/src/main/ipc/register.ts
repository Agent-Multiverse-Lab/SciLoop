import { createModelFactory, deepSeekProvider } from "@sciloop/harness";
import { loadModelConnection } from "../config/model-config.js";
import { registerAgentIpcHandlers } from "./agent-ipc.js";
import { registerRuntimeIpcHandlers } from "./runtime-ipc.js";

export function registerIpcHandlers(): void {
  registerRuntimeIpcHandlers();
  registerAgentIpcHandlers({
    getModelConnection: loadModelConnection,
    modelFactory: createModelFactory([deepSeekProvider])
  });
}
