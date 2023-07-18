import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { authApi } from "./routes/auth";
import { router } from "../trpc";
import { systemApi } from "./routes/system";
import { fileApi } from "./routes/file";
import { crmApi } from "./routes/crm";

export const appRouter = router({
  auth: authApi,
  system: systemApi,
	crm: crmApi,
	file: fileApi,
});

export type AppRouter = typeof appRouter;
export type RpcInput = inferRouterInputs<AppRouter>;
export type RpcOutput = inferRouterOutputs<AppRouter>;
