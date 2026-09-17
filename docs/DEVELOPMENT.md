# Development

## Stack

- Desktop runtime: Electron with a sandboxed renderer.
- Interface: React + TypeScript + Vite.
- Icons: Radix Icons.
- Process bridge: typed preload API over explicit IPC handlers.
- Harness: TypeScript / Node.js, reserved as an independent package.
- Workspace: npm workspaces.

## Structure

```text
apps/desktop/
  src/main/          Electron lifecycle, configuration, system adapters, and IPC
  src/preload/       Minimal context-isolated renderer bridge
  src/renderer/      React application, components, and browser-safe services
  src/shared/        Types shared across Electron processes
  public/            Renderer assets
packages/core/src/   Provider-neutral conversation and model contracts
packages/harness/src/ Model adapters, model factory, and Agent execution
docs/                Stack, structure, and setup
```

## Run

Requires Node.js 22.12+ and npm. Node.js 24 is the development baseline.

```sh
npm ci
npm start
```

`npm start` builds the workspace and launches Electron. `npm run dev` is an alias. For a browser-only interface preview with hot reload, run `npm run dev:web`.

The desktop Agent ships with the `deepseek` adapter; the model defaults to `deepseek-v4-flash`. Desktop reads `SCILOOP_MODEL_PROVIDER`, `SCILOOP_MODEL_ID`, `SCILOOP_MODEL_API_KEY`, and `SCILOOP_MODEL_BASE_URL`, then passes an explicit model connection to the Agent harness. For DeepSeek, `DEEPSEEK_API_KEY` and `DEEPSEEK_BASE_URL` remain fallback aliases; generic variables take precedence. Other providers require an explicit model ID and never inherit DeepSeek credentials. Credential requirements are validated by each adapter, allowing local providers without API keys.

```powershell
$env:DEEPSEEK_API_KEY="your-api-key"
$env:SCILOOP_MODEL_PROVIDER="deepseek"
$env:SCILOOP_MODEL_ID="deepseek-v4-flash"
npm start
```

```sh
npm run typecheck
npm run build
```

The renderer has no direct Node.js access. New privileged capabilities must be implemented in the main process, exposed through the preload bridge, and typed in `src/shared`.

## Extending model connections

`core/ModelConnection` contains provider-neutral connection data and optional provider-specific `options`. It has no SDK dependencies. Provider IDs are open strings; runtime registration determines which providers are supported. The previous `DeepSeekModelConnection` type is replaced by `ModelConnection`.

`harness/ModelProviderAdapter` maps an ID to `createModel(connection)`. Each adapter validates its own credentials and options, translates the connection into SDK settings, and returns an AI SDK `LanguageModel`. Options are not automatically forwarded to SDKs. The built-in DeepSeek adapter currently uses only credential, endpoint, and model ID.

To add a provider:

1. Implement a `ModelProviderAdapter` in `packages/harness/src/model/providers/` (or another server-side package) and export it.
2. Register it alongside `deepSeekProvider` in `apps/desktop/src/main/ipc/register.ts` using `createModelFactory([...])`.
3. Select its ID and model through the generic environment variables. Provider-specific options can be supplied by an application configuration loader through `ModelConnection.options`.

Neither the connection contract, factory dispatch, nor Agent loop needs a new provider branch. Desktop injects the factory through IPC dependencies into `runAgentConversation`. Other harness callers may pass their own `modelFactory`; omitting it preserves the built-in DeepSeek behavior. Registries are scoped to each factory, reject duplicate IDs, and fail explicitly on unknown providers or empty model IDs. Registration is static application composition, not dynamic plugin loading.

Connection credentials stay in the main process/harness and are not added to renderer IPC payloads. Environment parsing belongs to desktop; SDK construction belongs to adapters.

Run the focused connection tests after building:

```sh
node --test packages/harness/test/model-factory.test.mjs apps/desktop/test/model-config.test.mjs
```

This is the application foundation: process boundaries, secure protocol handling, typed IPC, build configuration, the desktop workspace shell, and a minimal streaming DeepSeek conversation. Agent tools, storage, remote GPU connections, and a training runner are not implemented yet.
