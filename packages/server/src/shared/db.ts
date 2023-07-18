import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";
import { getConfig } from "../config";

export const db = new PrismaClient({
  log: getConfig().dev
    ? [
        {
          emit: "event",
          level: "query",
        },
      ]
    : undefined,
});
if (getConfig().dev) {
  // @ts-ignore
  db.$on("query", (e: any) => {
    logger.info(
      "\n%s \nParams: %s\nDuration: %s",
      e.query,
      e.params,
      e.duration
    );
  });
}
