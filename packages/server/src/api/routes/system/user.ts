import { privateProcedure, router } from "../../../trpc";
import { queryPageable } from "../../../shared/zod-schame";
import { z } from "zod";
import { db } from "../../../shared/db";
import { newInputError } from "../../../shared/error";
import { hashPassword } from "../../../service/auth";

const createInput = z.object({
  username: z.string(),
  nickname: z.string(),
  avatar: z.string().optional(),
  roles: z.array(z.number()).optional(),
});
const updateInput = createInput.partial().extend({ id: z.number() });
export const userApi = router({
  list: privateProcedure
    .input(queryPageable.extend({ nickname: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { pageSize, current, nickname } = input;
      const where = nickname ? { nickname: { contains: nickname } } : {};
      const [total, data] = await Promise.all([
        db.user.count({ where }),
        db.user.findMany({
          where,
          skip: (current - 1) * pageSize,
          take: pageSize,
          include: { account: true, roles: true },
        }),
      ]);
      return { total, data };
    }),
  createUser: privateProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const auth = await db.account.findFirst({
        where: { username: input.username },
      });
      if (auth) throw newInputError("用户名已存在");
      await db.user.create({
        data: {
          nickname: input.nickname,
          account: {
            create: {
              username: input.username,
              password: await hashPassword("123456"),
            },
          },
        },
      });
    }),
  deleteUsers: privateProcedure
    .input(z.array(z.number()).nonempty())
    .mutation(async ({ ctx, input }) => {
      await db.user.deleteMany({ where: { id: { in: input } } });
    }),
  updateUser: privateProcedure
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      const roles = input.roles
        ? { set: input.roles.map((id) => ({ id })) }
        : undefined;
      const account = input.username
        ? { update: { username: input.username } }
        : undefined;
      await db.user.update({
        where: { id: input.id },
        data: { nickname: input.nickname, roles, account },
      });
    }),
  resetPassword: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.account.update({
        where: { id: input.id },
        data: { password: await hashPassword("123456") },
      });
    }),
});
