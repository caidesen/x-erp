import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { StockRecord } from "@/modules/wms/entities/stock-record.entity";
import { QueryOrder, ref } from "@mikro-orm/core";
import { Big } from "big.js";
import { Product } from "@/modules/wms/entities/product.entity";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";
import { StockRecordBizType } from "@/modules/wms/constant/biz-type.enum";

@Injectable()
export class StockService {
  constructor(private readonly em: EntityManager) {}

  /**
   * 查询实时库存，如果没有就返回0
   * @param productId
   * @param warehouseId
   */
  async getCurrentStock(productId: string, warehouseId: string) {
    const recode = await this.em.findOne(
      StockRecord,
      {
        product: {
          id: productId,
        },
        warehouse: {
          id: warehouseId,
        },
      },
      {
        orderBy: {
          createdAt: QueryOrder.DESC,
          id: QueryOrder.DESC,
        },
      }
    );
    return recode?.finalQuantity ?? "0";
  }

  /**
   *  更新库存, 需要手动flush
   */
  async updateStock(options: {
    productId: string;
    warehouseId: string;
    quantity: string;
    /** 业务单id */
    bizOrderId: string;
    /** 业务类型 */
    bizType: StockRecordBizType;
  }) {
    const currentQuantity = await this.getCurrentStock(
      options.productId,
      options.warehouseId
    );
    const newQuantity = Big(currentQuantity).plus(options.quantity);
    const newRecord = new StockRecord({
      product: ref(Product, options.productId),
      warehouse: ref(Warehouse, options.warehouseId),
      initialQuantity: currentQuantity,
      changQuantity: options.quantity,
      finalQuantity: newQuantity.toString(),
      bizOrderId: options.bizOrderId,
      bizType: options.bizType,
    });
    this.em.persist(newRecord);
  }
}
