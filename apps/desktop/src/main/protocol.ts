import { net, protocol } from "electron";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SCHEME = "sciloop";
const HOST = "app";

export function registerRendererScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true
      }
    }
  ]);
}

export function registerRendererProtocol(rendererRoot: string): void {
  protocol.handle(SCHEME, (request) => {
    const url = new URL(request.url);
    if (url.hostname !== HOST) {
      return new Response("Not found", { status: 404 });
    }

    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }

    const filePath = resolve(rendererRoot, `.${pathname}`);
    const childPath = relative(rendererRoot, filePath);
    if (childPath.startsWith("..") || isAbsolute(childPath)) {
      return new Response("Forbidden", { status: 403 });
    }

    return net.fetch(pathToFileURL(filePath).toString());
  });
}
