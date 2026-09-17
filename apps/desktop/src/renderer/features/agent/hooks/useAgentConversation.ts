import { useEffect, useRef, useState } from "react";
import {
  sendAgentMessage,
  stopAgentRun,
  subscribeToAgentStream
} from "@/lib/desktop-api.js";
import type { AgentMessage, AgentRunStatus } from "../model/agent-types.js";

const initialMessages: AgentMessage[] = [];

export function useAgentConversation() {
  const [messages, setMessages] = useState(initialMessages);
  const [runStatus, setRunStatus] = useState<AgentRunStatus>("idle");
  const activeRunId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = subscribeToAgentStream((event) => {
      if (event.runId !== activeRunId.current) return;

      if (event.type === "text-delta") {
        setRunStatus("streaming");
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessageId(event.runId)
              ? { ...message, content: message.content + event.text }
              : message
          )
        );
        return;
      }

      activeRunId.current = undefined;
      if (event.type === "failed") {
        setMessages((current) => appendRunError(current, event.runId, event.message));
        setRunStatus("failed");
        return;
      }

      setMessages((current) => removeEmptyAssistant(current, event.runId));
      setRunStatus("idle");
    });

    return () => {
      unsubscribe();
      const runId = activeRunId.current;
      if (runId) void stopAgentRun(runId);
    };
  }, []);

  function sendMessage(content: string) {
    if (activeRunId.current) return;

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const now = Date.now();
    const runId = crypto.randomUUID();
    const userMessage: AgentMessage = {
      id: `message-${runId}-user`,
      role: "user",
      content: trimmedContent,
      createdAt: now
    };
    const assistantMessage: AgentMessage = {
      id: assistantMessageId(runId),
      role: "assistant",
      content: "",
      createdAt: now
    };
    const requestMessages = [...messages, userMessage].flatMap((message) =>
      message.role === "system"
        ? []
        : [{ role: message.role, content: message.content }]
    );

    activeRunId.current = runId;
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setRunStatus("submitting");

    void sendAgentMessage({ runId, messages: requestMessages }).catch((error: unknown) => {
      if (activeRunId.current !== runId) return;
      activeRunId.current = undefined;
      setMessages((current) => appendRunError(current, runId, errorMessage(error)));
      setRunStatus("failed");
    });
  }

  function stopRun() {
    const runId = activeRunId.current;
    if (!runId) return;

    void stopAgentRun(runId).catch((error: unknown) => {
      if (activeRunId.current !== runId) return;
      activeRunId.current = undefined;
      setMessages((current) => appendRunError(current, runId, errorMessage(error)));
      setRunStatus("failed");
    });
  }

  return {
    messages,
    runStatus,
    sendMessage,
    stopRun
  };
}

function assistantMessageId(runId: string): string {
  return `message-${runId}-assistant`;
}

function removeEmptyAssistant(
  messages: AgentMessage[],
  runId: string
): AgentMessage[] {
  const assistantId = assistantMessageId(runId);
  return messages.filter(
    (message) => message.id !== assistantId || message.content.length > 0
  );
}

function appendRunError(
  messages: AgentMessage[],
  runId: string,
  error: string
): AgentMessage[] {
  return [
    ...removeEmptyAssistant(messages, runId),
    {
      id: `message-${runId}-error`,
      role: "system",
      content: `DeepSeek: ${error}`,
      createdAt: Date.now()
    }
  ];
}

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim().length > 0
    ? error.message
    : "Request failed.";
}
