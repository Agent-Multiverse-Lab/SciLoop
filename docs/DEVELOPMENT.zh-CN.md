# 开发说明

[English](DEVELOPMENT.md) | [简体中文](DEVELOPMENT.zh-CN.md)

## 技术栈

- 桌面外壳：Electron。
- 界面：React + TypeScript + Vite。
- Harness：TypeScript / Node.js，预留独立模块。
- 工程管理：npm workspaces。

## 项目结构

```text
apps/desktop/
  src/main/          Electron 入口与 preload 占位
  src/renderer/      React 空壳界面
  public/            桌面资源
packages/core/src/   共享接口占位
packages/harness/src/ Agent Harness 占位
docs/                技术栈、结构与启动说明
```

## 启动

需要 Node.js 22.12+ 和 npm，开发基准为 Node.js 24。

```sh
npm ci
npm start
```

`npm start` 构建工程并启动 Electron，`npm run dev` 使用相同流程。使用 `npm run dev:web` 可启动支持热更新的浏览器界面预览。

```sh
npm run typecheck
npm run build
```

当前仅搭建框架：模块目录、构建配置和桌面空壳。尚未实现模型接入、Agent 执行、工具、存储、远程 GPU 连接或训练 Runner。
