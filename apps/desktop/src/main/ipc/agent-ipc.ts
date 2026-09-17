import type { ConversationMessage, ModelConnection } from "@sciloop/core";
import { runAgentConversation, type ModelFactory } from "@sciloop/harness";
import { ipcMain, type IpcMainInvokeEvent } from "electron";
import type {
  AgentSendInput,
  AgentStreamEvent
} from "../../shared/desktop-api.js";

export const AGENT_SEND_CHANNEL = "agent:send";
export const AGENT_STOP_CHANNEL = "agent:stop";
export const AGENT_STREAM_CHANNEL = "agent:stream";

const MAX_RUN_ID_LENGTH = 128;
const MAX_MESSAGES = 200;
const MAX_MESSAGE_LENGTH = 100_000;
const activeAgentRuns = new Map<
  string,
  { controller: AbortController; senderId: number }
>();

interface AgentIpcDependencies {
  getModelConnection(): ModelConnection;
  modelFactory: ModelFactory;
}

export function registerAgentIpcHandlers({
  getModelConnection,
  modelFactory
}: AgentIpcDependencies): void {
  ipcMain.removeHandler(AGENT_SEND_CHANNEL);
  ipcMain.removeHandler(AGENT_STOP_CHANNEL);

  ipcMain.handle(
    AGENT_SEND_CHANNEL,
    async (event, rawInput: unknown): Promise<void> => {
      const input = parseAgentSendInput(rawInput);
      if (activeAgentRuns.has(input.runId)) {
        throw new Error(`Agent run already exists: ${input.runId}`);
      }

      const controller = new AbortController();
      const activeRun = { controller, senderId: event.sender.id };
      activeAgentRuns.set(input.runId, activeRun);

      const abortWhenDestroyed = () => controller.abort();
      event.sender.once("destroyed", abortWhenDestroyed);

      try {
        await runAgentConversation({
          connection: getModelConnection(),
          modelFactory,
          messages: input.messages,
          signal: controller.signal,
          onTextDelta: (text) => {
            sendAgentEvent(event, {
              runId: input.runId,
              type: "text-delta",
              text
            });
          }
        });

        sendAgentEvent(event, {
          runId: input.runId,
          type: controller.signal.aborted ? "stopped" : "finished"
        });
      } catch (error) {
        sendAgentEvent(
          event,
          controller.signal.aborted
            ? { runId: input.runId, type: "stopped" }
            : {
                runId: input.runId,
                type: "failed",
                message: errorMessage(error)
              }
        );
      } finally {
        event.sender.removeListener("destroyed", abortWhenDestroyed);
        if (activeAgentRuns.get(input.runId) === activeRun) {
          activeAgentRuns.delete(input.runId);
        }
      }
    }
  );

  ipcMain.handle(
    AGENT_STOP_CHANNEL,
    (event, rawRunId: unknown): void => {
      const runId = parseRunId(rawRunId);
      const activeRun = activeAgentRuns.get(runId);
      if (activeRun?.senderId === event.sender.id) {
        activeRun.controller.abort();
      }
    }
  );
}

function sendAgentEvent(
  event: IpcMainInvokeEvent,
  streamEvent: AgentStreamEvent
): void {
  if (!event.sender.isDestroyed()) {
    event.sender.send(AGENT_STREAM_CHANNEL, streamEvent);
  }
}

function parseAgentSendInput(value: unknown): AgentSendInput {
  if (!isRecord(value)) throw new Error("Invalid Agent send input.");

  const runId = parseRunId(value.runId);
  if (!Array.isArray(value.messages) || value.messages.length === 0) {
    throw new Error("Agent messages must be a non-empty array.");
  }
  if (value.messages.length > MAX_MESSAGES) {
    throw new Error(`Agent messages exceed the ${MAX_MESSAGES} message limit.`);
  }

  return {
    runId,
    messages: value.messages.map(parseAgentMessage)
  };
}

function parseRunId(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > MAX_RUN_ID_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(value)
  ) {
    throw new Error("Invalid Agent run ID.");
  }
  return value;
}

function parseAgentMessage(value: unknown): ConversationMessage {
  if (!isRecord(value)) throw new Error("Invalid Agent message.");
  if (value.role !== "user" && value.role !== "assistant") {
    throw new Error("Invalid Agent message role.");
  }
  if (
    typeof value.content !== "string" ||
    value.content.length === 0 ||
    value.content.length > MAX_MESSAGE_LENGTH
  ) {
    throw new Error("Invalid Agent message content.");
  }

  return { role: value.role, content: value.content };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim().length > 0
    ? error.message
    : "Agent request failed.";
}
