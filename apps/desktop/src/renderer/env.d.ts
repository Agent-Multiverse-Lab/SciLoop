/// <reference types="vite/client" />

import type { DesktopApi } from "../shared/desktop-api.js";

declare global {
  interface Window {
    sciloop?: DesktopApi;
  }
}

export {};
