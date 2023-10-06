import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { User } from "@/modules/system/auth/entities/user.entity";
import { Account } from "@/modules/system/auth/entities/account.entity";
import { UserService } from "./auth/services/user.service";
import { Role } from "@/modules/system/auth/entities/role.entity";
import { RoleController } from "./auth/controllers/role.controller";
import { UserController } from "./auth/controllers/user.controller";
import { AuthController } from "./auth/controllers/auth.controller";
import { ConfigModule } from "@/modules/system/config/config.module";

@Module({
  imports: [MikroOrmModule.forFeature([User, Account, Role]), ConfigModule],
  providers: [UserService],
  controllers: [RoleController, UserController, AuthController],
})
export class SystemModule {}
