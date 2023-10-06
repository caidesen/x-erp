import { Entity, Property } from "@mikro-orm/core";
import { CommonEntity } from "@/common/entity";

@Entity()
export class MeasurementUnit extends CommonEntity {
  constructor(val: Partial<MeasurementUnit>) {
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
