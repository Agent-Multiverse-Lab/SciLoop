import { app, type BrowserWindow } from "electron";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers } from "./ipc/register.js";
import { registerRendererProtocol, registerRendererScheme } from "./protocol.js";
import { lockDownPermissions } from "./security.js";
import { createMainWindow } from "./window.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | null = null;

registerRendererScheme();
app.setName("SciLoop");

async function bootstrap(): Promise<void> {
  registerIpcHandlers();
  registerRendererProtocol(resolve(currentDirectory, "../renderer"));
  lockDownPermissions();

  mainWindow = createMainWindow();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      mainWindow = createMainWindow();
    }
  });
}

app.whenReady().then(bootstrap).catch((error: unknown) => {
  console.error("Failed to start SciLoop", error);
  app.exit(1);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
