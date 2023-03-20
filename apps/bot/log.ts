import debug from "debug";
import { env } from "./env.js";

if (env.NODE_ENV === "development") {
  debug.enable("discord,discord:*");
}

// https://github.com/debug-js/debug/issues/922#issuecomment-1374524350
(debug as any).useColors = () => true;

export const baseLog = debug("discord");
