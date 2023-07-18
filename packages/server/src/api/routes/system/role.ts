import { privateProcedure, router } from "../../../trpc";
import { z } from "zod";
import { db } from "../../../shared/db";
import { createAuthMeta } from "src/shared/permissions";

const createRoleInput = z.object({
	name: z.string(),
	permissions: z.array(z.string()),
	remark: z.string().optional().nullable(),
});
const updateRoleInput = createRoleInput.partial().extend({ id: z.number() });
export const roleApi = router({
	list: privateProcedure
		.meta(createAuthMeta("role:all"))
		.input(z.object({ name: z.string() }).partial())
		.query(async ({ ctx, input }) => {
			const where = input.name ? { name: { contains: input.name } } : {};
			return await db.role.findMany({
				where,
				orderBy: { id: "desc" },
			});
		}),
	createRole: privateProcedure
		.meta(createAuthMeta("role:all"))
		.input(createRoleInput)
		.mutation(async ({ ctx, input }) => {
			await db.role.create({
				data: {
					name: input.name,
					remark: input.remark,
					permissions: input.permissions,
				},
			});
		}),
	updateRole: privateProcedure
		.meta(createAuthMeta("role:all"))
		.input(updateRoleInput)
		.mutation(async ({ ctx, input }) => {
			await db.role.update({
				where: { id: input.id },
				data: {
					name: input.name,
					remark: input.remark,
					permissions: input.permissions,
				},
			});
		}),
	deleteRoles: privateProcedure
		.meta(createAuthMeta("role:all"))
		.input(z.array(z.number()).nonempty())
		.mutation(async ({ ctx, input }) => {
			await db.role.deleteMany({ where: { id: { in: input } } });
		}),
});
