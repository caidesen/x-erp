import { CommonEntity } from "@/common/entity";
import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  QueryOrder,
  Ref,
} from "@mikro-orm/core";
import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";
import { ProductUnit } from "@/modules/wms/product/entities/product-uint.entity";

@Entity()
export class Product extends CommonEntity {
  @Property()
  name: string;

  @Property({
    default: "",
  })
  remarks: string;

  /**
   * 基础计量单位
   */
  @ManyToOne(() => MeasurementUnit, { eager: true, ref: true })
  baseUnit: Ref<MeasurementUnit>;

  /** 是否支持多单位 */
  @Property()
  multiUnitEnabled: boolean;

  /** 多单位 */
  @OneToMany(() => ProductUnit, (pu) => pu.product, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    orderBy: {
      createdAt: QueryOrder.DESC,
      unit: {
        createdAt: QueryOrder.DESC,
        id: QueryOrder.DESC,
      },
    },
  })
  units = new Collection<ProductUnit>(this);

  constructor(val?: Partial<Product>) {
    super();
    if (val) Object.assign(this, val);
  }
}
