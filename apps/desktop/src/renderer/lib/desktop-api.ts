import type {
  AgentSendInput,
  AgentStreamEvent,
  RuntimeInfo
} from "../../shared/desktop-api.js";

const browserRuntime: RuntimeInfo = {
  appName: "SciLoop",
  appVersion: "web preview",
  electronVersion: null,
  nodeVersion: null,
  platform: "browser",
  architecture: "web",
  mode: "browser"
};

export async function getRuntimeInfo(): Promise<RuntimeInfo> {
  return window.sciloop?.runtime.getInfo() ?? browserRuntime;
}

export function sendAgentMessage(input: AgentSendInput): Promise<void> {
  const agent = window.sciloop?.agent;
  if (!agent) {
    return Promise.reject(
      new Error("Agent runtime is only available in the Electron desktop app.")
    );
  }
  return agent.send(input);
}

export function stopAgentRun(runId: string): Promise<void> {
  return window.sciloop?.agent.stop(runId) ?? Promise.resolve();
}

export function subscribeToAgentStream(
  handler: (event: AgentStreamEvent) => void
): () => void {
  return window.sciloop?.agent.onStream(handler) ?? (() => undefined);
}
