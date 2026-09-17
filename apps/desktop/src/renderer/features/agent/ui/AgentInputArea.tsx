import { PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";
import {
  useEffect,
  useRef,
  useState,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent
} from "react";
import type { AgentRunStatus } from "../model/agent-types.js";

interface AgentInputAreaProps {
  runStatus: AgentRunStatus;
  disabled?: boolean;
  onSubmit(content: string): void;
  onStop(): void;
}

const statusLabels: Record<AgentRunStatus, string> = {
  idle: "Agent ready",
  submitting: "Starting run",
  streaming: "Agent is responding",
  failed: "Run failed"
};

export function AgentInputArea({
  runStatus,
  disabled = false,
  onSubmit,
  onStop
}: AgentInputAreaProps) {
  const [draft, setDraft] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRunning = runStatus === "submitting" || runStatus === "streaming";
  const canSubmit = draft.trim().length > 0 && !disabled && !isRunning;

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [draft]);

  function submitDraft(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || disabled || isRunning) return;

    onSubmit(content);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      isComposing ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  function handleComposition(event: CompositionEvent<HTMLTextAreaElement>) {
    setIsComposing(event.type === "compositionstart");
  }

  return (
    <div className="px-4 pb-5 pt-2 sm:px-8 lg:px-12">
      <form
        className="mx-auto w-full max-w-[52rem] rounded-input border border-line-strong bg-surface px-3 py-2.5 transition-colors focus-within:border-ink-muted"
        onSubmit={submitDraft}
      >
        <label className="sr-only" htmlFor="agent-input">
          Message the Agent
        </label>
        <textarea
          ref={textareaRef}
          id="agent-input"
          className="block max-h-40 min-h-11 w-full resize-none overflow-y-auto border-0 bg-transparent px-1 py-2 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onCompositionEnd={handleComposition}
          onCompositionStart={handleComposition}
          onKeyDown={handleKeyDown}
          placeholder="Message the Agent..."
          rows={1}
          value={draft}
        />

        <div className="mt-1 flex min-w-0 items-center gap-3">
          <span className="flex min-w-0 items-center gap-2 text-xs text-ink-muted">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-ink-muted"
            />
            <span className="truncate">{statusLabels[runStatus]}</span>
          </span>
          <span className="ml-auto hidden text-[11px] text-ink-faint sm:inline">
            Enter to send · Shift+Enter for a new line
          </span>

          {isRunning ? (
            <button
              aria-label="Stop Agent"
              className="grid size-9 shrink-0 place-items-center rounded-control border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onStop}
              type="button"
            >
              <StopIcon aria-hidden="true" />
            </button>
          ) : (
            <button
              aria-label="Send message"
              className="grid size-9 shrink-0 place-items-center rounded-control border border-ink bg-ink text-surface transition-colors hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-hover disabled:text-ink-faint"
              disabled={!canSubmit}
              type="submit"
            >
              <PaperPlaneIcon aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function resizeTextarea(textarea: HTMLTextAreaElement | null) {
  if (!textarea) return;

  textarea.style.height = "0px";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
}
