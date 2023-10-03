import { LibrariesModule } from "./libraries/libraries.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SystemModule } from "./modules//system/system.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CrmModule } from "./modules//crm/crm.module";
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
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
