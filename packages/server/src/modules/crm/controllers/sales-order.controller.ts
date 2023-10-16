import { Controller } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateSalesOrderInput,
  QuerySalesOrderInput,
  SalesOrderVO,
} from "@/modules/crm/dto/sales-order.dto";
import { SalesOrder } from "@/modules/crm/entities/sales-order.entity";
import { getPageableParams } from "@/common/helpers/pagination";
import { Serializer } from "@/common/helpers/serialize";
import { defaultOrderBy } from "@/common/db/orderBy";
import Post = TypedRoute.Post;

@Controller("crm/sales-order")
export class SalesOrderController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(@TypedBody() input: QuerySalesOrderInput) {
    const { offset, limit } = getPageableParams(input);
    const [list, total] = await this.em.findAndCount(
      SalesOrder,
      {},
      { orderBy: defaultOrderBy, limit, offset }
    );
    return Serializer(list, {
      populate: true,
    }).toPaginationResult<SalesOrderVO>(total);
  }

  @Post("create")
  async create(@TypedBody() input: CreateSalesOrderInput) {
    const salesOrder = new SalesOrder();
    await this.em.persistAndFlush(salesOrder);
  }

  @Post("update")
  async update() {}

  @Post("submit")
  async submit() {}

  @Post("approve")
  async approve() {}

  @Post("reject")
  async reject() {}

  @Post("cancel")
  async cancel() {}
}
