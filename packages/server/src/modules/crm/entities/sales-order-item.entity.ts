import { Entity, ManyToOne, Property, ref, Ref, types } from "@mikro-orm/core";
import { CommonEntity, ConstructorVal } from "@/common/entity";
import { Product } from "@/modules/wms/entities/product.entity";
import _ from "lodash";

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

  constructor(val?: ConstructorVal<SalesOrderItem, "product">) {
    super();
    if (!val) return;
    Object.assign(this, _.pick(val, ["quantity", "price", "amount"]));
    if (val.product) this.product = ref(Product, val.product.id);
  }
}
