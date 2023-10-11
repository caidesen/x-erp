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
  ref,
} from "@mikro-orm/core";
import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";
import {
  CreateDateProperty,
  DeleteDateProperty,
  UpdateDateProperty,
} from "mikro-orm-plus";

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
