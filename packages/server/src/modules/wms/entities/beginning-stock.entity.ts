import {
  Entity,
  ManyToOne,
  Property,
  Ref,
  types,
  Unique,
} from "@mikro-orm/core";
import { Product } from "@/modules/wms/entities/product.entity";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";
import { CommonEntity } from "@/common/entity";
import { User } from "@/modules/system/auth/entities/user.entity";

@Entity()
@Unique({ properties: ["product", "warehouse"] })
export class BeginningStock extends CommonEntity {
  @ManyToOne(() => Product, { ref: true })
  product: Ref<Product>;

  @ManyToOne(() => Warehouse, { ref: true })
  warehouse: Ref<Warehouse>;

  @Property({ type: types.decimal })
  quantity: string;

  @ManyToOne(() => User, { ref: true, hidden: true })
  creator: Ref<User>;

  @ManyToOne(() => User, { ref: true, hidden: true })
  updater: Ref<User>;
}
