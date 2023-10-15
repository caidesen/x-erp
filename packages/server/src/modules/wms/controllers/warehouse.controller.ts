import { Controller } from "@nestjs/common";
import { TypedRoute, TypedBody } from "@nestia/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";
import { serialize } from "@mikro-orm/core";
import {
  CreateWarehouseInput,
  WarehouseVO,
  UpdateWarehouseInput,
} from "@/modules/wms/dto/warehouse.dto";
import { InputException } from "@/common/exception";
import { IdsOnly } from "@/common/dto";
import Post = TypedRoute.Post;

@Controller("wms/warehouse")
export class WarehouseController {
  constructor(private readonly em: EntityManager) {}

  @Post("all")
  async all() {
    const list = await this.em.find(Warehouse, {});
    return serialize(list) as unknown as WarehouseVO[];
  }

  @Post("create")
  async create(@TypedBody() input: CreateWarehouseInput) {
    const warehouse = new Warehouse(input);
    await this.em.persistAndFlush(warehouse);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateWarehouseInput) {
    const warehouse = await this.em.findOne(Warehouse, { id: input.id });
    if (!warehouse) throw new InputException("此仓库不存在");
    this.em.assign(warehouse, input);
    await this.em.flush();
  }

  @Post("batchRemove")
  async batchRemove(@TypedBody() input: IdsOnly) {
    const refs = input.ids.map((it) => this.em.getReference(Warehouse, it));
    this.em.remove(refs);
    await this.em.flush();
  }
}
