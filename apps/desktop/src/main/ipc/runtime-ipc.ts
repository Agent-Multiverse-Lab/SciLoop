import { app, ipcMain } from "electron";
import type { RuntimeInfo } from "../../shared/desktop-api.js";

export const GET_RUNTIME_INFO_CHANNEL = "runtime:get-info";

export function registerRuntimeIpcHandlers(): void {
  ipcMain.removeHandler(GET_RUNTIME_INFO_CHANNEL);
  ipcMain.handle(GET_RUNTIME_INFO_CHANNEL, (): RuntimeInfo => ({
    appName: app.getName(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    platform: process.platform,
    architecture: process.arch,
    mode: "desktop"
  }));
}
