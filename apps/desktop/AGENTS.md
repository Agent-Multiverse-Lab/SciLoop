# Desktop Agent Guidelines

These instructions apply to `apps/desktop/`. Read the repository root `AGENTS.md` for workspace-wide conventions.

## Technology stack

| Layer | Current technology | Purpose |
| --- | --- | --- |
| Desktop runtime | Electron 44, with a Node.js main process and a sandboxed Chromium renderer | Native window, application lifecycle, security, and IPC |
| Language and workspace | TypeScript 7, Node.js 22.12+, npm workspaces | Shared types and ordered builds across `core`, `harness`, and `desktop` |
| Interface | React 19, React DOM, Tailwind CSS 4, Radix Icons | Renderer UI, styling, and icons |
| Build | TypeScript compiler and Vite 8 with `@tailwindcss/vite` | Compile main/preload code, check renderer types, and bundle renderer assets |
| Agent packages | `@sciloop/core` and `@sciloop/harness` | Provider-neutral contracts, model adapters, and Agent execution |

The root `npm run build` builds `core`, then `harness`, then `desktop`. The desktop build compiles main/preload with `tsc`, typechecks the renderer, and bundles the renderer with Vite. `npm start` builds and launches Electron. The current scripts do not produce an installer; no Electron packaging tool is configured in this package.

## Architecture and directory layout

```text
apps/desktop/
├── package.json                 # Desktop scripts and dependencies
├── vite.config.ts              # Renderer build and Tailwind plugin
├── tsconfig.main.json          # Main, preload, and shared compilation
├── tsconfig.renderer.json      # Renderer and shared typecheck
├── index.html                  # Renderer HTML entry
├── public/                     # Static renderer assets
├── src/
│   ├── main/                   # Privileged Electron process
│   │   ├── main.ts             # Application startup and lifecycle
│   │   ├── window.ts           # BrowserWindow and renderer loading
│   │   ├── security.ts         # Permission policy
│   │   ├── protocol.ts         # sciloop:// asset protocol
│   │   ├── config/
│   │   │   └── model-config.ts  # Model settings from environment
│   │   └── ipc/
│   │       ├── register.ts      # Handler registration and model factory
│   │       ├── agent-ipc.ts     # Agent runs and stream events
│   │       └── runtime-ipc.ts   # Desktop runtime information
│   ├── preload/
│   │   └── index.cts           # Context-isolated window.sciloop bridge
│   ├── shared/
│   │   └── desktop-api.ts      # Cross-process API and event types
│   └── renderer/               # Browser-safe React application
│       ├── main.tsx            # React mount point
│       ├── app/
│       │   └── App.tsx         # Application composition
│       ├── features/
│       │   └── agent/          # Agent UI, state hook, and view types
│       ├── lib/
│       │   └── desktop-api.ts  # Client for the preload bridge
│       └── styles.css          # Global UI styles
└── test/                       # Focused desktop tests
```

## Agent request flow

The current path is `useAgentConversation` -> renderer desktop API -> preload -> `agent-ipc.ts` -> `runAgentConversation`. Stream events return through the same bridge. When changing this path, update the shared event/input types, preload, main handler, renderer client, and focused tests together. Keep `runId` correlation, terminal events, cancellation, and listener cleanup consistent.

The main process validates IPC payloads and owns the active-run `AbortController` map. Keep credentials and provider setup in main/harness; never include credentials in renderer IPC payloads. Register model adapters in `src/main/ipc/register.ts`, and parse environment settings in `src/main/config/model-config.ts`.

## Electron security

Preserve `contextIsolation: true`, `sandbox: true`, and `nodeIntegration: false`. Expose privileged operations only through explicit, typed preload methods and validated main-process handlers. Keep navigation, window creation, permissions, and protocol file access restricted by the existing main-process controls.

`npm run dev:web` is a browser UI preview. The Agent runtime requires Electron IPC; do not add a fake browser implementation that silently claims to run the Agent.

## Verification

Run commands from the repository root. For desktop changes, use `npm run typecheck` and `npm run build`. For model configuration changes, run the focused Node tests after building:

```sh
node --test packages/harness/test/model-factory.test.mjs apps/desktop/test/model-config.test.mjs
```

Report separately whether the Electron window, a real model provider, or browser preview was actually exercised. Edit source files rather than generated `dist/` output.
