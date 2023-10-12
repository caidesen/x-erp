import { Entity, Property } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";

@Entity()
export class Warehouse extends CommonEntity {
  @Property()
  name: string;
  @Property({ default: "" })
  remarks: string;

  constructor(value: Partial<Warehouse>) {
    super();
    Object.assign(this, value);
  }
}
