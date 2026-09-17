import type { AgentRequestMessage, ModelConnection } from "@sciloop/core";
import { streamText, type ModelMessage } from "ai";
import { createModel } from "../model/model-factory.js";
import type { ModelFactory } from "../model/model-provider.js";

export interface AgentRunInput {
  connection: ModelConnection;
  modelFactory?: ModelFactory;
  messages: AgentRequestMessage[];
  signal: AbortSignal;
  onTextDelta(text: string): void;
}

export async function runAgent({
  connection,
  modelFactory = createModel,
  messages,
  signal,
  onTextDelta
}: AgentRunInput): Promise<void> {
  const modelMessages: ModelMessage[] = messages.map((message) => ({
    role: message.role,
    content: message.content
  }));
  const result = streamText({
    model: modelFactory(connection),
    messages: modelMessages,
    abortSignal: signal
  });

  for await (const text of result.textStream) {
    onTextDelta(text);
  }
}
