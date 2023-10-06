import { Module } from "@nestjs/common";
import { MeasureModule } from "@/modules/system/config/measure/measure.module";

@Module({
  imports: [MeasureModule],
})
export class ConfigModule {}
