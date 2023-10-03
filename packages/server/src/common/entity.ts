import { Entity, OptionalProps, PrimaryKey, t } from "@mikro-orm/core";
import {
  CreateDateProperty,
  DeleteDateProperty,
  UpdateDateProperty,
} from "mikro-orm-plus";

@Entity({
  abstract: true,
})
export abstract class CommonEntity {
  [OptionalProps]?: "createdAt" | "updatedAt" | "id";
  @PrimaryKey({ type: t.bigint })
  id: string;

  @CreateDateProperty({ hidden: true })
  createdAt: Date = new Date();

  @UpdateDateProperty({ hidden: true })
  updatedAt: Date = new Date();

  @DeleteDateProperty({ hidden: true })
  deletedAt?: Date;
}
