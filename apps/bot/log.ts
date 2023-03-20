import debug from "debug";
import { env } from "./env.js";

if (env.NODE_ENV === "development") {
  debug.enable("discord,discord:*");
}

export const baseLog = debug("discord");
