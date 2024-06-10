import { isLocalEnvironment } from "./core/devtools.js";

export const DEV = isLocalEnvironment();
export const STEAM = false;
export const MAC = false;
