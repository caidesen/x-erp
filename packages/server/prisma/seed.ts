import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

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
    },
  });
}
async function main() {
  await seedUser();
}
main();
