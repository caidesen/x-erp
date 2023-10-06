import { Module } from "@nestjs/common";
import { MeasureService } from "@/modules/system/config/measure/measure.service";
import { MeasureController } from "@/modules/system/config/measure/measure.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";

@Module({
  imports: [MikroOrmModule.forFeature([MeasurementUnit])],
  providers: [MeasureService],
  controllers: [MeasureController],
})
export class MeasureModule {}
