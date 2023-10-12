import { Entity, ManyToOne, Property, ref, Ref } from "@mikro-orm/core";
import {
  CreateDateProperty,
  DeleteDateProperty,
  UpdateDateProperty,
} from "mikro-orm-plus";
import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";
import { Product } from "@/modules/wms/product/entities/product.entity";

@Entity()
export class ProductUnit {
  @CreateDateProperty({ hidden: true })
  createdAt: Date = new Date();

  @UpdateDateProperty({ hidden: true })
  updatedAt: Date = new Date();

  @DeleteDateProperty({ hidden: true })
  deletedAt?: Date;

  @ManyToOne(() => Product, { hidden: true, primary: true })
  product: Ref<Product>;

  @ManyToOne(() => MeasurementUnit, {
    hidden: true,
    eager: true,
    primary: true,
    ref: true,
  })
  unit: Ref<MeasurementUnit>;

  /** 换算比率 */
  @Property()
  transformRatio: string;

  @Property({ persist: false })
  get unitId() {
    return this.unit.id;
  }

  @Property({ persist: false })
  get name() {
    return this.unit.getProperty("name");
  }

  @Property({ persist: false })
  get decimals() {
    return this.unit.getProperty("decimals");
  }

  constructor(
    val?: Partial<{
      unitId: string;
      transformRatio: string;
    }>
  ) {
    if (!val) return;
    this.unit = ref(MeasurementUnit, val.unitId);
    if (val.transformRatio) {
      this.transformRatio = val.transformRatio;
    }
  }
}
