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

  @CreateDateProperty({})
  createdAt: Date = new Date();

  @UpdateDateProperty({})
  updatedAt: Date = new Date();

  @DeleteDateProperty({})
  deletedAt?: Date;
}
