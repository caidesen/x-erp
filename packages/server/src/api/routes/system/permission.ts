import { privateProcedure, router } from "../../../trpc";
import { z } from "zod";
import { createAuthMeta, fixedPermissions } from "../../../shared/permissions";

export const permissionApi = router({
	list: privateProcedure
		.meta(createAuthMeta("user:all"))
		.input(z.object({ name: z.string() }).partial())
		.query(
			() =>
				Object.entries(fixedPermissions).map(([code, name]) => ({
					code,
					name,
				})) as { code: string; name: string }[]
		),
});
