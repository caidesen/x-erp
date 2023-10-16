import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  Property,
  Ref,
} from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";
import { Customer } from "@/modules/crm/entities/customer.entity";
import { User } from "@/modules/system/auth/entities/user.entity";
import { OrderStatusEnum } from "@/modules/wms/constant/order-status.enum";
import { SalesOrderItem } from "@/modules/crm/entities/sales-order-item.entity";

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

  constructor(val: Partial<SalesOrder>) {
    super();
    Object.assign(this, val);
  }
}
