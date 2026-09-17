export type AgentMessageRole = "user" | "assistant" | "system";

export type AgentRunStatus =
  | "idle"
  | "submitting"
  | "streaming"
  | "failed";

export interface AgentMessage {
  id: string;
  role: AgentMessageRole;
  content: string;
  createdAt: number;
}
