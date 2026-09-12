import { app, BrowserWindow, net, protocol, session } from "electron";
import { dirname, isAbsolute, relative, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
protocol.registerSchemesAsPrivileged([{ scheme: "sciloop", privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
app.setName("SciLoop");
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1120, height: 760, minWidth: 640, minHeight: 480, title: "SciLoop", backgroundColor: "#f7f9fa",
    webPreferences: { preload: join(directory, "preload.cjs"), contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", event => event.preventDefault());
  mainWindow.on("closed", () => { mainWindow = null; });
  void mainWindow.loadURL("sciloop://app/index.html");
}

app.whenReady().then(() => {
  const rendererRoot = resolve(directory, "../renderer");
  protocol.handle("sciloop", request => {
    const url = new URL(request.url);
    if (url.hostname !== "app") return new Response("Not found", { status: 404 });
    let pathname: string;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { return new Response("Invalid path", { status: 400 }); }
    const file = resolve(rendererRoot, `.${pathname}`);
    const child = relative(rendererRoot, file);
    if (child.startsWith("..") || isAbsolute(child)) return new Response("Forbidden", { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  createWindow();
  app.on("activate", () => { if (!mainWindow) createWindow(); });
}).catch(error => { console.error(error); app.exit(1); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
