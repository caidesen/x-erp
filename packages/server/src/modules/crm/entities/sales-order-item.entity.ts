import { Entity, ManyToOne, Property, Ref, types } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";
import { Product } from "@/modules/wms/entities/product.entity";

@Entity()
export class SalesOrderItem extends CommonEntity {
  /** 物料 */
  @ManyToOne(() => Product, { ref: true })
  product: Ref<Product>;

  /** 数量 */
  @Property({ type: types.decimal })
  quantity: string;

  /** 单价 */
  @Property({ type: types.decimal })
  price: string;

  /** 金额 */
  @Property({ type: types.decimal })
  amount: string;
}
