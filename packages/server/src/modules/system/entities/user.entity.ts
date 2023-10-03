import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToOne,
  Property,
  Ref,
} from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";
import { Account } from "./account.entity";
import { Role } from "./role.entity";

@Entity()
export class User extends CommonEntity {
  @Property()
  nickname: string;

  @OneToOne(() => Account, (account) => account.user, {
    ref: true,
    hidden: true,
    owner: true,
    cascade: [Cascade.REMOVE],
  })
  account: Ref<Account>;

  @ManyToMany(() => Role, (role) => role.users, { owner: true })
  roles = new Collection<Role>(this);

  constructor(data?: Partial<User>) {
    super();
    if (data) Object.assign(this, data);
  }
}
