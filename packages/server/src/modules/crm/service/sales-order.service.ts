import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { SalesOrder } from "@/modules/crm/entities/sales-order.entity";
import { Big } from "big.js";

@Injectable()
export class SalesOrderService {
  constructor(private readonly em: EntityManager) {}

  computeOrderAmount(salesOrder: SalesOrder) {
    let orderAmount = Big("0");
    for (const detail of salesOrder.details) {
      const amount = Big(detail.price)
        .times(Big(detail.quantity))
        .round(2, Big.roundUp);
      orderAmount = orderAmount.plus(amount);
      detail.amount = amount.toString();
    }
    salesOrder.amount = orderAmount.toString();
  }
}
