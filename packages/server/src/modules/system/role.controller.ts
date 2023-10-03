import { InjectRepository } from "@mikro-orm/nestjs";
import { Controller } from "@nestjs/common";
import { Role } from "./entities/role.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { CreateRoleInput, RoleVO, UpdateRoleInput } from "./dto/role.dto";
import { IdsOnly } from "@/common/dto";
import { fixedPermissions } from "@/common/permissions";
import { serialize } from "@mikro-orm/core";
import { TypedBody, TypedRoute } from "@nestia/core";

@Controller("system/role")
export class RoleController {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>
  ) {}
  @TypedRoute.Post("create")
  async create(@TypedBody() body: CreateRoleInput) {
    const role = new Role(body);
    await this.roleRepository.getEntityManager().persistAndFlush(role);
    return role;
  }
  @TypedRoute.Post("batchRemove")
  async remove(@TypedBody() input: IdsOnly) {
    const roles = input.ids.map((it) => this.roleRepository.getReference(it));
    await this.roleRepository.getEntityManager().removeAndFlush(roles);
  }
  @TypedRoute.Post("all")
  async findAll() {
    const roles = await this.roleRepository.findAll();
    return serialize(roles) as unknown as RoleVO[];
  }
  @TypedRoute.Post("update")
  async update(@TypedBody() input: UpdateRoleInput) {
    const role = await this.roleRepository.findOneOrFail(input.id);
    Object.assign(role, input);
    await this.roleRepository.getEntityManager().flush();
  }
  @TypedRoute.Post("getPermissions")
  permissions() {
    return fixedPermissions as Record<string, string>;
  }
}
