import type { ConversationMessage, ConversationRole } from "@sciloop/core";

export type RuntimeMode = "desktop" | "browser";

export interface RuntimeInfo {
  appName: string;
  appVersion: string;
  electronVersion: string | null;
  nodeVersion: string | null;
  platform: string;
  architecture: string;
  mode: RuntimeMode;
}

export type AgentConversationRole = ConversationRole;
export type AgentConversationMessage = ConversationMessage;

export interface AgentSendInput {
  runId: string;
  messages: AgentConversationMessage[];
}

export type AgentStreamEvent =
  | { runId: string; type: "text-delta"; text: string }
  | { runId: string; type: "finished" }
  | { runId: string; type: "stopped" }
  | { runId: string; type: "failed"; message: string };

export interface DesktopApi {
  runtime: {
    getInfo(): Promise<RuntimeInfo>;
  };
  agent: {
    send(input: AgentSendInput): Promise<void>;
    stop(runId: string): Promise<void>;
    onStream(handler: (event: AgentStreamEvent) => void): () => void;
  };
}
