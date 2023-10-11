import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";
import { serialize } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateMeasurementUnitInput,
  MeasurementUnitVO,
  UpdateMeasurementUnitInput,
} from "@/modules/system/config/measure/dto/measure.dto";
import { InputException } from "@/common/exception";
import { IdsOnly } from "@/common/dto";
import { Controller } from "@nestjs/common";
import { HasAuthority } from "@/common/decorator/has-authority.decorator";
import _ from "lodash";
import Post = TypedRoute.Post;

@Controller("config/measure")
export class MeasureController {
  constructor(private readonly em: EntityManager) {}

  @Post("getAllMeasurementUnit")
  async all() {
    const list = await this.em.find(MeasurementUnit, {});
    return serialize(list) as unknown as MeasurementUnitVO[];
  }

  @Post("createMeasurementUnit")
  @HasAuthority("config:all")
  async create(@TypedBody() input: CreateMeasurementUnitInput) {
    const measurementUnit = new MeasurementUnit(input);
    await this.em.persistAndFlush(measurementUnit);
  }

  @Post("updateMeasurementUnit")
  @HasAuthority("config:all")
  async update(@TypedBody() input: UpdateMeasurementUnitInput) {
    const measurementUnit = await this.em.findOne(MeasurementUnit, {
      id: input.id,
    });
    if (!measurementUnit) throw new InputException("此计量单位不存在");
    // 只能改大，不能改小，不然会出事
    if (
      !_.isNil(input.decimals) &&
      measurementUnit.decimals > input.decimals!
    ) {
      throw new InputException("修改后精度不能小于原精度");
    }
    this.em.assign(measurementUnit, input);
    await this.em.flush();
  }

  @Post("batchRemoveMeasurementUnit")
  @HasAuthority("config:all")
  async batchRemove(@TypedBody() input: IdsOnly) {
    const measurementUnits = input.ids.map((it) =>
      this.em.getReference(MeasurementUnit, it)
    );
    // todo: 这里以后要检查一下是否被使用
    await this.em.removeAndFlush(measurementUnits);
  }
}
