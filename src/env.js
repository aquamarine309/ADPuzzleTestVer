import { isLocalEnvironment } from "./core/devTools.js";

export const DEV = isLocalEnvironment();
export const STEAM = false;
export const MAC = false;
