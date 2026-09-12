# Development

[English](DEVELOPMENT.md) | [简体中文](DEVELOPMENT.zh-CN.md)

## Stack

- Desktop: Electron.
- Interface: React + TypeScript + Vite.
- Harness: TypeScript / Node.js, reserved as an independent package.
- Workspace: npm workspaces.

## Structure

```text
apps/desktop/
  src/main/          Electron entry and preload placeholder
  src/renderer/      React application shell
  public/            Desktop assets
packages/core/src/   Shared contracts placeholder
packages/harness/src/ Agent harness placeholder
docs/                Stack, structure, and setup
```

## Run

Requires Node.js 22.12+ and npm. Node.js 24 is the development baseline.

```sh
npm ci
npm start
```

`npm start` builds the workspace and launches Electron. `npm run dev` is an alias. For a browser-only interface preview with hot reload, run `npm run dev:web`.

```sh
npm run typecheck
npm run build
```

This is a framework scaffold: package boundaries, build configuration, and a desktop shell. Model integrations, agent execution, tools, storage, remote GPU connections, and a training runner are not implemented.
