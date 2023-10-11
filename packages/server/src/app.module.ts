import { LibrariesModule } from "./libraries/libraries.module";
import { Module } from "@nestjs/common";
import { SystemModule } from "@/modules/system/system.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CrmModule } from "@/modules/crm/crm.module";
import { InventoryModule } from "@/modules/inventory/inventory.module";
import ormConfig from "./mikro-orm.config";
import _ from "lodash";

@Module({
  imports: [
    SystemModule,
    MikroOrmModule.forRoot({
      ..._.omit(ormConfig, "entities"),
      autoLoadEntities: true,
    }),
    LibrariesModule,
    CrmModule,
    InventoryModule,
  ],
})
export class AppModule {}
