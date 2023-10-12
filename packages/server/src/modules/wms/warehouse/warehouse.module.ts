import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Warehouse } from "@/modules/wms/warehouse/entities/warehouse.entity";
import { WarehouseController } from "@/modules/wms/warehouse/controllers/warehouse.controller";

@Module({
  imports: [MikroOrmModule.forFeature([Warehouse])],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
