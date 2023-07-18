import { middleware } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getSession } from "../shared/session";
import { logger } from "../shared/logger";
import { getUserPermissions } from "src/service/auth";

const createUnauthorizedError = () =>
  new TRPCError({ code: "UNAUTHORIZED", message: "当前未登陆" });
/**
 *
 */
export const authMiddleware = middleware(async ({ ctx, next }) => {
  const req = ctx.req;
  const cookie = req.headers.cookie;
  if (!cookie) {
    throw createUnauthorizedError();
  }
  const sessionId = cookie.match(/sessionId=([^;]+)/)?.[1];
  if (!sessionId) {
    throw createUnauthorizedError();
  }
  const session = await getSession(sessionId);
  if (!session) {
    throw createUnauthorizedError();
  }

  const permissions = await getUserPermissions(session.userId);
  return next({
    ctx: {
      ...ctx,
      session,
      userId: session.userId,
      permissions,
    },
  });
});
export const loggerMiddleware = middleware(
  async ({ path, type, next, ctx }) => {
    const start = Date.now();
    try {
      const result = await next();
      const durationMs = Date.now() - start;
      if (result.ok) logger.info({ path, type, durationMs });
      else logger.info({ path, type, durationMs, err: result.error });
      return result;
    } catch (err) {
      const durationMs = Date.now() - start;
      logger.error({ path, type, durationMs, err });
      throw err;
    }
  }
);
