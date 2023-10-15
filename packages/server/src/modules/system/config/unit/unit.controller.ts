import { Unit } from "@/modules/system/config/unit/entities/unit.entity";
import { serialize } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateUnitInput,
  UnitVO,
  UpdateUnitInput,
} from "@/modules/system/config/unit/dto/unit.dto";
import { InputException } from "@/common/exception";
import { IdsOnly } from "@/common/dto";
import { Controller } from "@nestjs/common";
import { HasAuthority } from "@/common/decorator/has-authority.decorator";
import _ from "lodash";
import Post = TypedRoute.Post;

@Controller("config/unit")
export class UnitController {
  constructor(private readonly em: EntityManager) {}

  @Post("all")
  async all() {
    const list = await this.em.find(Unit, {});
    return serialize(list) as unknown as UnitVO[];
  }

  @Post("create")
  @HasAuthority("config:all")
  async create(@TypedBody() input: CreateUnitInput) {
    const unit = new Unit(input);
    await this.em.persistAndFlush(unit);
  }

  @Post("update")
  @HasAuthority("config:all")
  async update(@TypedBody() input: UpdateUnitInput) {
    const unit = await this.em.findOne(Unit, {
      id: input.id,
    });
    if (!unit) throw new InputException("此计量单位不存在");
    // 只能改大，不能改小，不然会出事
    if (!_.isNil(input.decimals) && unit.decimals > input.decimals!) {
      throw new InputException("修改后精度不能小于原精度");
    }
    this.em.assign(unit, input);
    await this.em.flush();
  }

  @Post("unit")
  @HasAuthority("config:all")
  async batchRemove(@TypedBody() input: IdsOnly) {
    const units = input.ids.map((it) => this.em.getReference(Unit, it));
    // todo: 这里以后要检查一下是否被使用
    await this.em.removeAndFlush(units);
  }
}
