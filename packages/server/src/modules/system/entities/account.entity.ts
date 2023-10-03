import { CommonEntity } from "@/common/entity";
import {
  Entity,
  Index,
  OneToOne,
  Property,
  Ref,
  Unique,
} from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
export class Account extends CommonEntity {
  @Property()
  @Index({
    name: "username_index",
    expression:
      'CREATE UNIQUE INDEX "account_username_index" ON "account" ("username") WHERE "deleted_at" IS NULL',
  })
  username: string;

  @Property({ nullable: true, hidden: true })
  password: string;

  /** 企业微信userId */
  @Property({ nullable: true })
  wecomUserId: string;

  @OneToOne(() => User, (user) => user.account, {
    ref: true,
    hidden: true,
  })
  user: Ref<User>;

  constructor(data?: Partial<Account>) {
    super();
    if (data) Object.assign(this, data);
  }
}
