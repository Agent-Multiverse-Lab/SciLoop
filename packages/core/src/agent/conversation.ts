export type Role = "user" | "assistant";

export interface AgentRequestMessage {
  role: Role;
  content: string;
}
