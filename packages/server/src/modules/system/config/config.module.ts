import { Module } from "@nestjs/common";
import { UnitModule } from "@/modules/system/config/unit/unit.module";

@Module({
  imports: [UnitModule],
})
export class ConfigModule {}
