# Repository Guidelines

## Technology Stack & Project Structure

SciLoop uses Node.js, npm workspaces, Electron, React, TypeScript, Vite, Tailwind CSS, and Radix Icons.

```text
SciLoop/
├── apps/
│   └── desktop/
├── packages/
│   ├── core/
│   └── harness/
└── docs/
```

Edit source files, not generated `dist/` files.

## Build, Test, and Development Commands

Use Node.js 22.12+ and npm; Node.js 24 is the documented development baseline. Run commands from the repository root:

- `npm ci`: install locked dependencies.
- `npm run build`: build core, harness, and desktop in dependency order.
- `npm run typecheck`: build shared packages and check desktop types.
- `npm start` or `npm run dev`: build and launch Electron.
- `npm run dev:web`: launch the Vite browser preview with hot reload; Electron IPC requires the desktop app.

## Coding Style & Naming Conventions

Follow existing TypeScript style: two-space indentation, double quotes, semicolons, and explicit `import type` for type-only imports. Preserve strict compiler checks. Use `.js` extensions in relative TypeScript imports for NodeNext compatibility.

Use PascalCase for React components and types, camelCase for functions and variables, and kebab-case for non-component modules. Import shared packages through their public exports. No formatter or lint script is currently configured; avoid unrelated formatting changes.

## Testing Guidelines

Tests use Node's `node:test` and `node:assert/strict`, with `*.test.mjs` filenames. Build first because tests import compiled output:

```sh
node --test packages/harness/test/model-factory.test.mjs apps/desktop/test/model-config.test.mjs
```

Cover changed behavior and failure cases without real credentials or network calls. No coverage threshold is configured. Report desktop or live-provider checks separately from automated tests.

## Commit & Pull Request Guidelines

The existing commit uses `chore: scaffold ...`; follow the Conventional Commit form `type: description`, adding a scope when useful. Keep changes focused. PRs should explain behavior changes, link relevant issues, list validation performed, and include screenshots for UI changes.

## Security & Configuration

Keep credentials in the main process/harness, outside renderer IPC payloads. Configure models through `SCILOOP_MODEL_*`; DeepSeek also accepts `DEEPSEEK_API_KEY`. Never commit secrets. Expose privileged operations through typed main-process IPC and the preload bridge.
