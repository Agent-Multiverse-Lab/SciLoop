const { contextBridge, ipcRenderer } = require("electron") as typeof import("electron");

type DesktopApi = import("../shared/desktop-api.js").DesktopApi;
type AgentSendInput = import("../shared/desktop-api.js").AgentSendInput;
type AgentStreamEvent = import("../shared/desktop-api.js").AgentStreamEvent;
type RuntimeInfo = import("../shared/desktop-api.js").RuntimeInfo;

const GET_RUNTIME_INFO_CHANNEL = "runtime:get-info";
const AGENT_SEND_CHANNEL = "agent:send";
const AGENT_STOP_CHANNEL = "agent:stop";
const AGENT_STREAM_CHANNEL = "agent:stream";

const desktopApi = {
  runtime: {
    getInfo: () => ipcRenderer.invoke(GET_RUNTIME_INFO_CHANNEL) as Promise<RuntimeInfo>
  },
  agent: {
    send: (input: AgentSendInput) =>
      ipcRenderer.invoke(AGENT_SEND_CHANNEL, input) as Promise<void>,
    stop: (runId: string) =>
      ipcRenderer.invoke(AGENT_STOP_CHANNEL, runId) as Promise<void>,
    onStream: (handler: (event: AgentStreamEvent) => void) => {
      const listener = (_event: unknown, streamEvent: AgentStreamEvent) => {
        handler(streamEvent);
      };

      ipcRenderer.on(AGENT_STREAM_CHANNEL, listener);
      return () => ipcRenderer.removeListener(AGENT_STREAM_CHANNEL, listener);
    }
  }
} satisfies DesktopApi;

contextBridge.exposeInMainWorld("sciloop", desktopApi);
