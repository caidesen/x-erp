import pino from "pino";
import { getConfig } from "../config";

export const logger = pino({
  level: getConfig().dev ? "debug" : "info",
  transport: getConfig().dev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});
