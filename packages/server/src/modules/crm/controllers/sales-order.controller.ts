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
import _ from "lodash";
import { SalesOrderItem } from "@/modules/crm/entities/sales-order-item.entity";
import { UpdateCustomerInput } from "@/modules/crm/dto/customer.dto";
import { OrderStatusEnum } from "@/modules/wms/constant/order-status.enum";
import { InputException } from "@/common/exception";
import { IdOnly } from "@/common/dto";
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
    const salesOrder = new SalesOrder(_.omit(input, ["details"]));
    salesOrder.details.set(input.details.map((it) => new SalesOrderItem(it)));
    await this.em.persistAndFlush(salesOrder);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateCustomerInput) {
    const salesOrder = await this.em.findOneOrFail(SalesOrder, input.id);
    if (salesOrder.status !== OrderStatusEnum.SAVED)
      throw new InputException(
        "只有处于已保存未提交的销售单才可以修改销售单内容"
      );
    this.em.assign(salesOrder, input);
    await this.em.flush();
  }

  @Post("submit")
  async submit(@TypedBody() input: IdOnly) {
    const salesOrder = await this.em.findOneOrFail(SalesOrder, input.id);
    if (salesOrder.status !== OrderStatusEnum.SAVED)
      throw new InputException("不符合流程");
    salesOrder.status = OrderStatusEnum.SUBMITTED;
    await this.em.flush();
  }

  @Post("approve")
  async approve(@TypedBody() input: IdOnly) {
    const salesOrder = await this.em.findOneOrFail(SalesOrder, input.id);
    if (salesOrder.status !== OrderStatusEnum.SUBMITTED)
      throw new InputException("不符合流程");
    salesOrder.status = OrderStatusEnum.APPROVED;
    await this.em.flush();
  }

  @Post("reject")
  async reject(@TypedBody() input: IdOnly) {
    const salesOrder = await this.em.findOneOrFail(SalesOrder, input.id);
    if (salesOrder.status !== OrderStatusEnum.SUBMITTED)
      throw new InputException("不符合流程");
    salesOrder.status = OrderStatusEnum.CANCELED;
    await this.em.flush();
  }

  @Post("cancel")
  async cancel(@TypedBody() input: IdOnly) {
    const salesOrder = await this.em.findOneOrFail(SalesOrder, input.id);
    if (salesOrder.status !== OrderStatusEnum.APPROVED)
      throw new InputException("不符合流程");
    salesOrder.status = OrderStatusEnum.CANCELED;
    await this.em.flush();
  }
}
