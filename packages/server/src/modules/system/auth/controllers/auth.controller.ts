import { Controller, Req } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { LoginInput, UpdatePasswordInput } from "../dto/auth.dto";
import { Request } from "express";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Account } from "../entities/account.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import bcrypt from "bcrypt";
import { UserId } from "@/common/decorator/user-id.decorator";
import { TypedBody, TypedRoute } from "@nestia/core";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>
  ) {}

  @TypedRoute.Post("loginByLocal")
  async loginByLocal(@TypedBody() input: LoginInput, @Req() res: Request) {
    const account = await this.userService.validaUserByLocal(
      input.username,
      input.password
    );
    (res.session as any).userId = (await account.user.load()).id;
  }

  @TypedRoute.Post("updatePassword")
  async updatePassword(
    @TypedBody() input: UpdatePasswordInput,
    @UserId() userId: string
  ) {
    const account = await this.accountRepository.findOne({
      user: { id: userId },
    });
    if (!account) throw new Error("用户不存在");
    const isMatch = await bcrypt.compare(input.oldPassword, account.password);
    if (!isMatch) throw new Error("旧密码错误");
    account.password = await bcrypt.hash(input.newPassword, 10);
    await this.accountRepository.getEntityManager().flush();
  }
}
