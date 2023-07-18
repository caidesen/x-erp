import { z } from "zod";

export const queryPageable = z.object({
  current: z.number().default(1),
  pageSize: z.number().default(10),
});
