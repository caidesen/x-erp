import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { EntityRepository, Reference, wrap } from "@mikro-orm/core";
import { Account } from "./entities/account.entity";
import pinyin from "pinyinlite";
import { Role } from "./entities/role.entity";
import { InputException } from "@/common/exception";
import bcrypt from "bcrypt";
import _ from "lodash";
import { fixedPermissions } from "@/common/permissions";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>
  ) {}

  async createUser(input: {
    username?: string;
    nickname: string;
    roles: string[];
  }) {
    const username =
      input.username ??
      (pinyin(input.nickname) as string[][]).map((it) => it[0]).join("");
    const account = new Account({
      username,
      password: await bcrypt.hash("123456", 10),
    });
    const user = new User({
      nickname: input.nickname,
      account: wrap(account).toReference(),
    });
    user.roles.set(input.roles.map((it) => Reference.createFromPK(Role, it)));
    await this.userRepository.getEntityManager().persistAndFlush(user);
    return user;
  }

  // async setUserRoles(ids: string[], roleIds: string[]) {
  //   const roles = roleIds.map((it) => this.roleRepository.getReference(it));
  //   const users = ids.map((it) => this.userRepository.getReference(it));
  //   users.forEach((it) => it.roles.set(roles));
  //   await this.userRepository.getEntityManager().flush();
  // }
  // async getUserInfo(userId: string) {
  //   return await this.userRepository.findOneOrFail(userId);
  // }
  /**
   * 通过本地帐号验证用户
   */
  async validaUserByLocal(username: string, password: string) {
    const account = await this.accountRepository.findOne({
      username,
    });
    if (!account) throw new InputException("帐号不存在");
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) throw new InputException("密码错误");
    return account;
  }

  async getUserPermissions(userId: string) {
    if (!userId) return [];
    // const user = await this.userRepository.findOneOrFail(userId, {
    //   populate: ["roles"],
    // });
    const roles = await this.roleRepository.find({ users: { id: userId } });
    if (_.some(roles, (it) => it.id === "0")) return _.keys(fixedPermissions);
    return _(roles).map("permissions").flatten().uniq().value();
  }
}
