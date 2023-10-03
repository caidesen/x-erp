import { CommonEntity } from "@/common/entity";
import { User } from "@/modules/system/entities/user.entity";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  QueryOrder,
  Ref,
} from "@mikro-orm/core";

/** 企业客户 */
@Entity()
export class Customer extends CommonEntity {
  @Property()
  fullName: string;

  @Property()
  shortName: string;

  @Property()
  property: string;

  @Property()
  region: string;

  @ManyToOne(() => User, { nullable: true, ref: true })
  personInChargeUser: Ref<User>;

  @Property()
  remarks: string;

  @OneToMany(() => CustomerContactInfo, (v) => v.customer, {
    orderBy: {
      createdAt: QueryOrder.DESC,
      id: QueryOrder.DESC,
    },
  })
  contacts = new Collection<CustomerContactInfo>(this);
}

/** 客户联系人 */
@Entity()
export class CustomerContactInfo extends CommonEntity {
  constructor(data?: Partial<CustomerContactInfo>) {
    super();
    if (!data) return;
    Object.assign(this, data);
  }

  @Property()
  name: string;

  @Property()
  phone: string;

  @Property()
  address: string;

  @ManyToOne(() => Customer, { ref: true, nullable: true })
  customer?: Ref<Customer>;
}

/** 客户日志 */
@Entity()
export class CustomerLog extends CommonEntity {
  @Property()
  logType: string;

  /** 文本内容 */
  @Property()
  content: string;

  /** 日志数据 */
  @Property()
  logData: string;

  @ManyToOne(() => Customer, { ref: true })
  customer: Ref<Customer>;

  @ManyToOne(() => User, { ref: true })
  creator: Ref<User>;
}
