import { z } from "zod";
import { router } from "../../trpc";
import { db } from "../../shared/db";
import {
	comparePassword,
	getUserPermissions,
	hashPassword,
} from "../../service/auth";
import { createSession, resetSession } from "../../shared/session";
import { privateProcedure, publicProcedure } from "../../trpc";
import { newInputError } from "../../shared/error";

export const authApi = router({
	loginByLocal: publicProcedure
		.input(z.object({ username: z.string(), password: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const auth = await db.account.findFirst({
				where: { username: input.username },
			});
			if (!auth || !auth.password) throw newInputError("用户名或密码错误");
			const isMatch = await comparePassword(input.password, auth.password);
			if (!isMatch) throw newInputError("用户名或密码错误");
			const sessionId = await createSession({
				id: auth.userId,
			});
			ctx.res.setCookie("sessionId", sessionId, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				path: "/",
			});
		}),
	updatePassword: privateProcedure
		.input(
			z.object({ password: z.string(), newPassword: z.string().min(6).max(20) })
		)
		.mutation(async ({ ctx, input }) => {
			const auth = await db.account.findFirst({
				where: { userId: ctx.session.userId },
			});
			if (!auth || !auth.password) throw newInputError("用户名或密码错误");
			const isMatch = await comparePassword(input.password, auth.password);
			if (!isMatch) throw newInputError("用户名或密码错误");
			const password = await hashPassword(input.newPassword);
			await db.account.update({
				where: { id: auth.id },
				data: { password },
			});
		}),
	getUserInfo: privateProcedure.query(async ({ ctx }) => {
		const user = await db.user.findFirst({
			where: { id: ctx.session.userId },
		});
		if (!user) throw newInputError("用户不存在");
		const permissions = await getUserPermissions(ctx.session.userId);
		return {
			...user,
			permissions,
		};
	}),
	updateUserInfo: privateProcedure
		.input(z.object({ nickname: z.string() }).partial())
		.mutation(async ({ ctx, input }) => {
			const user = await db.user.findUnique({
				where: { id: ctx.userId },
			});
			if (!user) throw newInputError("用户不存在");
			await db.user.update({
				where: { id: ctx.userId },
				data: { ...input },
			});
		}),
	ping: privateProcedure.mutation(async ({ ctx }) => {
		const sessionId = ctx.req.cookies.sessionId;
		await resetSession(sessionId!);
		return "pong";
	}),
});
