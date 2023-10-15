import { Entity, ManyToOne, Property, Ref, types } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";
import { Product } from "@/modules/wms/entities/product.entity";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";

@Entity()
export class Stock extends CommonEntity {
  constructor(val: Partial<Stock>) {
    super();
    Object.assign(this, val);
  }

  @ManyToOne(() => Product)
  product: Ref<Product>;

  @ManyToOne(() => Warehouse)
  warehouse: Ref<Warehouse>;

  /** 实时库存 */
  @Property({ type: types.decimal })
  currentQuantity: string;

  /** 预出库存 */
  @Property({ type: types.decimal })
  preOunBoundQuantity: string;

  /** 预入库存 */
  @Property({ type: types.decimal })
  preInBoundQuantity: string;
}
