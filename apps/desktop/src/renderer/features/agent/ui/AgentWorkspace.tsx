import type { AgentMessage, AgentRunStatus } from "../model/agent-types.js";
import { AgentInputArea } from "./AgentInputArea.js";
import { AgentMessageArea } from "./AgentMessageArea.js";

interface AgentWorkspaceProps {
  conversationId: string;
  messages: AgentMessage[];
  runStatus: AgentRunStatus;
  onSend(content: string): void;
  onStop(): void;
}

export function AgentWorkspace({
  conversationId,
  messages,
  runStatus,
  onSend,
  onStop
}: AgentWorkspaceProps) {
  return (
    <section
      aria-label="Agent workspace"
      className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] bg-surface"
      data-conversation-id={conversationId}
    >
      <AgentMessageArea messages={messages} runStatus={runStatus} />
      <AgentInputArea runStatus={runStatus} onSubmit={onSend} onStop={onStop} />
    </section>
  );
}
