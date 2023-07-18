import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superJson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superJson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
