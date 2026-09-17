import {
  AgentWorkspace,
  useAgentConversation
} from "@/features/agent/index.js";

export function App() {
  const agent = useAgentConversation();

  return (
    <main className="h-dvh min-h-[420px] min-w-[320px] bg-surface text-ink">
      <AgentWorkspace
        conversationId="prototype"
        messages={agent.messages}
        runStatus={agent.runStatus}
        onSend={agent.sendMessage}
        onStop={agent.stopRun}
      />
    </main>
  );
}
