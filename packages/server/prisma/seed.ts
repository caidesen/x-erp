import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fixedPermissions } from "../src/shared/permissions";

const prisma = new PrismaClient();
async function seedUser() {
	await prisma.user.create({
		data: {
			nickname: "administrator",
			avatar: "",
			account: {
				create: {
					username: "admin",
					password: await bcrypt.hash("admin", 10),
				},
			},
			roles: {
				create: [{ name: "admin", remark: "超级管理员",permissions: Object.keys(fixedPermissions) }],
			},
		},
	});
}
async function main() {
	await seedUser();
}
main();
