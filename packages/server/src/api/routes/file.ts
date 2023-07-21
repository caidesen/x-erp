import { applyUploadPath } from "../../service/file";
import { privateProcedure, router } from "../../trpc";
import { z } from "zod";

export const fileApi = router({
  getUploadUrl: privateProcedure
    .input(z.object({ filename: z.string(), remark: z.string() }))
    .query(({input}) => {
			return applyUploadPath(input.filename, input.remark)
		}),
});
