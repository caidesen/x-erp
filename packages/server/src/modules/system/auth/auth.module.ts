import { Module } from "@nestjs/common";
import { UserService } from "@/modules/system/auth/services/user.service";
import { RoleController } from "@/modules/system/auth/controllers/role.controller";
import { UserController } from "@/modules/system/auth/controllers/user.controller";
import { AuthController } from "@/modules/system/auth/controllers/auth.controller";

@Module({
  imports: [],
  providers: [UserService],
  controllers: [RoleController, UserController, AuthController],
})
export class SystemModule {}
