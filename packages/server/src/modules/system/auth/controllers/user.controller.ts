import { Controller } from "@nestjs/common";
import {
  CreateUserInput,
  MyUserInfoVo,
  UpdateUserInput,
  UserVO,
} from "@/modules/system/auth/dto/user.dto";
import { EntityRepository } from "@mikro-orm/postgresql";
import { User } from "@/modules/system/auth/entities/user.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { UserService } from "../services/user.service";
import { IdsOnly } from "@/common/dto";
import { Reference, serialize } from "@mikro-orm/core";
import { UserId } from "@/common/decorator/user-id.decorator";
import _ from "lodash";
import { Role } from "@/modules/system/auth/entities/role.entity";
import { TypedBody, TypedRoute } from "@nestia/core";

const { Post } = TypedRoute;

@Controller("system/auth/user")
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly userService: UserService
  ) {}

  @Post("createUser")
  async create(@TypedBody() input: CreateUserInput) {
    await this.userService.createUser(input);
  }

  @Post("getAllUser")
  async findAll() {
    const list = await this.userRepository.findAll({
      populate: ["account", "roles"],
    });
    return serialize(list, {
      populate: ["roles", "account"],
    }) as unknown as UserVO[];
  }

  @Post("updateUser")
  async update(@TypedBody() input: UpdateUserInput) {
    const user = await this.userRepository.findOneOrFail(input.id, {
      populate: ["account", "roles"],
    });
    _.assign(user, _.pick(input, ["nickname"]));
    if (!_.isNil(input.roles)) {
      user.roles.set(input.roles.map((it) => Reference.createFromPK(Role, it)));
    }
    return this.userRepository.getEntityManager().flush();
  }

  @Post("batchRemoveUser")
  async remove(@TypedBody() input: IdsOnly) {
    const users = input.ids.map((it) => this.userRepository.getReference(it));
    await this.userRepository.getEntityManager().removeAndFlush(users);
  }

  @Post("getMine")
  async getMine(@UserId() userId: string) {
    const userInfo = await this.userRepository.findOneOrFail(userId);
    const permissions = await this.userService.getUserPermissions(userId);
    return {
      ...serialize(userInfo, {}),
      permissions,
    } as MyUserInfoVo;
  }
}
