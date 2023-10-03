import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Account } from "./entities/account.entity";
import { UserService } from "./user.service";
import { Role } from "./entities/role.entity";
import { RoleController } from "./role.controller";
import { UserController } from "./user.controller";
import { AuthController } from "./auth.controller";

@Module({
  imports: [MikroOrmModule.forFeature([User, Account, Role])],
  providers: [UserService],
  controllers: [RoleController, UserController, AuthController],
})
export class SystemModule {}
