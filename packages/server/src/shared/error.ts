import { TRPCError } from "@trpc/server";

export function newInputError(message: string) {
  return new TRPCError({
    message,
    code: "BAD_REQUEST",
  });
}
