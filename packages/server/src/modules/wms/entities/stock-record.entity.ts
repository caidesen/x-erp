import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Ref,
  types,
} from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";
import { Product } from "@/modules/wms/entities/product.entity";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";
import { StockRecordBizType } from "@/modules/wms/constant/biz-type.enum";

@Entity()
export class StockRecord extends CommonEntity {
  constructor(val: Partial<StockRecord>) {
    super();
    Object.assign(this, val);
  }

  @ManyToOne(() => Product, { ref: true })
  product: Ref<Product>;

  @ManyToOne(() => Warehouse, { ref: true })
  warehouse: Ref<Warehouse>;

  /** 变化前库存 */
  @Property({ type: types.decimal })
  initialQuantity: string;

  /** 库存变化数量 */
  @Property({ type: types.decimal })
  changQuantity: string;

  /** 变化后库存 */
  @Property({ type: types.decimal })
  finalQuantity: string;

  /** 业务单id */
  @Property()
  @Index()
  bizOrderId: string;

  @Enum(() => StockRecordBizType)
  bizType: StockRecordBizType;
}
