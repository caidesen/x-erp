import { Controller } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateSalesOrderInput,
  QuerySalesOrderInput,
  SalesOrderDetailVO,
  SalesOrderVO,
  UpdateSalesOrderInput,
} from "@/modules/crm/dto/sales-order.dto";
import { SalesOrder } from "@/modules/crm/entities/sales-order.entity";
import { getPageableParams } from "@/common/helpers/pagination";
import { Serializer } from "@/common/helpers/serialize";
import { defaultOrderBy } from "@/common/db/orderBy";
import _ from "lodash";
import { SalesOrderItem } from "@/modules/crm/entities/sales-order-item.entity";
import { OrderStatusEnum } from "@/modules/wms/constant/order-status.enum";
import { InputException } from "@/common/exception";
import { IdOnly } from "@/common/dto";
import { CodeService } from "@/modules/system/code/code.service";
import { SalesOrderService } from "@/modules/crm/service/sales-order.service";
import Post = TypedRoute.Post;

@Controller("crm/sales-order")
export class SalesOrderController {
  constructor(
    private readonly em: EntityManager,
    private readonly codeService: CodeService,
    private readonly salesOrderService: SalesOrderService
  ) {}

  @Post("list")
  async list(@TypedBody() input: QuerySalesOrderInput) {
    const { offset, limit } = getPageableParams(input);
    const [list, total] = await this.em.findAndCount(
      SalesOrder,
      {},
      {
        populate: ["customer", "salesperson"],
        orderBy: defaultOrderBy,
        limit,
        offset,
      }
    );
    return Serializer(list, {
      populate: true,
    }).toPaginationResult<SalesOrderVO>(total);
  }

  @Post("detail")
  async detail(@TypedBody() input: IdOnly) {
    const salesOrder = await this.em.findOneOrFail(
      SalesOrder,
      _.pick(input, "id"),
      { populate: true }
    );
    return Serializer(salesOrder, {
      populate: true,
    }).toVO<SalesOrderDetailVO>();
  }

  @Post("create")
  async create(@TypedBody() input: CreateSalesOrderInput) {
    const salesOrder = new SalesOrder(_.omit(input, ["details"]));
    salesOrder.id = await this.codeService.generateCode("sales-order");
    salesOrder.details.set(input.details.map((it) => new SalesOrderItem(it)));
    this.salesOrderService.computeOrderAmount(salesOrder);
    salesOrder.status = OrderStatusEnum.SAVED;
    await this.em.persistAndFlush(salesOrder);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateSalesOrderInput) {
    const salesOrder = await this.em.findOneOrFail(SalesOrder, input.id, {
      populate: ["customer", "salesperson", "details", "details.product"],
    });
    if (salesOrder.status !== OrderStatusEnum.SAVED)
      throw new InputException(
        "只有处于已保存未提交的销售单才可以修改销售单内容"
      );
    this.em.assign(salesOrder, _.omit(input, ["id"]));
    this.salesOrderService.computeOrderAmount(salesOrder);
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
