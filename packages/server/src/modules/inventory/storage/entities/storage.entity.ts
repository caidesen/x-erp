import { Entity, Property } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";

@Entity()
export class Storage extends CommonEntity {
  @Property()
  name: string;
  @Property({ default: "" })
  remarks: string;

  constructor(value: Partial<Storage>) {
    super();
    Object.assign(this, value);
  }
}
