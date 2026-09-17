import { useEffect, useRef } from "react";
import type { AgentMessage, AgentRunStatus } from "../model/agent-types.js";

interface AgentMessageAreaProps {
  messages: AgentMessage[];
  runStatus: AgentRunStatus;
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit"
});

export function AgentMessageArea({
  messages,
  runStatus
}: AgentMessageAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMessageContent = messages.at(-1)?.content;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages.length, lastMessageContent, runStatus]);

  return (
    <div
      ref={viewportRef}
      className="min-h-0 overflow-y-auto overscroll-contain px-5 py-8 sm:px-8 lg:px-12"
    >
      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="mx-auto flex w-full max-w-[52rem] flex-col gap-7"
        role="log"
      >
        {messages.length === 0 ? <AgentEmptyState /> : null}

        {messages.map((message) => (
          <AgentMessageRow key={message.id} message={message} />
        ))}

        {runStatus === "submitting" || runStatus === "streaming" ? (
          <div className="flex items-center gap-3 pl-11 text-sm text-ink-muted">
            <span
              aria-hidden="true"
              className="size-1.5 animate-pulse rounded-full bg-ink-muted"
            />
            Agent is working
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AgentMessageRow({ message }: { message: AgentMessage }) {
  if (message.role === "system") {
    return (
      <p className="self-center text-xs text-ink-faint">
        {message.content}
      </p>
    );
  }

  const isUser = message.role === "user";

  return (
    <article
      className={
        isUser
          ? "flex max-w-[min(78%,42rem)] flex-col items-end self-end"
          : "grid max-w-[46rem] grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 self-start"
      }
    >
      {!isUser ? (
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-control border border-line bg-surface font-mono text-[11px] font-semibold text-ink"
        >
          A
        </span>
      ) : null}

      <div className={isUser ? "flex flex-col items-end" : "min-w-0"}>
        <div
          className={
            isUser
              ? "rounded-input bg-surface-active px-4 py-3 text-[15px] leading-6 text-ink shadow-user-message"
              : "rounded-input bg-surface-subtle px-4 py-3 text-[15px] leading-6 text-ink shadow-none"
          }
        >
          <p className="m-0 whitespace-pre-wrap">{message.content}</p>
        </div>
        <time
          className="mt-1.5 text-[11px] tabular-nums text-ink-faint"
          dateTime={new Date(message.createdAt).toISOString()}
        >
          {timeFormatter.format(message.createdAt)}
        </time>
      </div>
    </article>
  );
}

function AgentEmptyState() {
  return (
    <div className="m-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <span className="mb-5 grid size-9 place-items-center rounded-control border border-line font-mono text-xs font-semibold">
        A
      </span>
      <h1 className="m-0 text-lg font-semibold tracking-[-0.015em]">
        Start an Agent conversation
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Describe the result you want, then refine it with messages and runtime context.
      </p>
    </div>
  );
}
