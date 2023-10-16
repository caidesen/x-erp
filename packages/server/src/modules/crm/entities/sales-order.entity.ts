import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  Property,
  ref,
  Ref,
} from "@mikro-orm/core";
import { CommonEntity, ConstructorVal } from "@/common/entity";
import { Customer } from "@/modules/crm/entities/customer.entity";
import { User } from "@/modules/system/auth/entities/user.entity";
import { OrderStatusEnum } from "@/modules/wms/constant/order-status.enum";
import { SalesOrderItem } from "@/modules/crm/entities/sales-order-item.entity";
import _ from "lodash";

@Entity()
export class SalesOrder extends CommonEntity {
  /** 相关账户 */
  @ManyToOne(() => Customer, { ref: true })
  customer: Ref<Customer>;

  /** 订单状态 */
  @Enum(() => OrderStatusEnum)
  status: OrderStatusEnum;

  /** 销售员工 */
  @ManyToOne(() => User, { ref: true })
  salesperson: Ref<User>;

  /** 备注 */
  @Property()
  remarks: string;

  /** 订单金额 */
  @Property()
  amount: string;

  /** 订单明细 */
  @ManyToOne(() => SalesOrderItem)
  details = new Collection<SalesOrderItem>(this);

  constructor(val?: ConstructorVal<SalesOrder, "customer" | "salesperson">) {
    super();
    if (!val) return;
    Object.assign(this, _.omit(val, ["customer", "salesperson", "details"]));
    if (val.customer) this.customer = ref(Customer, val.customer.id);
    if (val.salesperson) this.salesperson = ref(User, val.salesperson.id);
  }
}
