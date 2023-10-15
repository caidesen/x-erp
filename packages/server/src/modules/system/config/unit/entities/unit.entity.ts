import { Entity, Property } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";

@Entity()
export class Unit extends CommonEntity {
  constructor(val: Partial<Unit>) {
    super();
    Object.assign(this, val);
  }

  /** 单位名称 */
  @Property()
  name: string;

  /** 精度 */
  @Property({ default: 0 })
  decimals: number;

  /** 缩写 */
  @Property({ nullable: true })
  abbreviation: string;
}
