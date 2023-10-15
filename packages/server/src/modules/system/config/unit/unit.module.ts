import { Module } from "@nestjs/common";
import { UnitService } from "@/modules/system/config/unit/unit.service";
import { UnitController } from "@/modules/system/config/unit/unit.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Unit } from "@/modules/system/config/unit/entities/unit.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Unit])],
  providers: [UnitService],
  controllers: [UnitController],
})
export class UnitModule {}
