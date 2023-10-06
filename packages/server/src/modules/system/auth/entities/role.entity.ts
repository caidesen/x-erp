import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";
import { User } from "./user.entity";

@Entity()
export class Role extends CommonEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property({ type: "array" })
  permissions: string[];

  @ManyToMany(() => User, (user) => user.roles)
  users = new Collection<User>(this);

  constructor(data?: Partial<Role>) {
    super();
    if (data) Object.assign(this, data);
  }
}
