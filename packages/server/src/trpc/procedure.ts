import { procedure } from "./trpc";
import { authMiddleware, loggerMiddleware } from "./middleware";

export const publicProcedure = procedure.use(loggerMiddleware);

export const privateProcedure = publicProcedure.use(authMiddleware);
