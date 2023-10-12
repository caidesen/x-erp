import { Module } from "@nestjs/common";
import { ProductModule } from "@/modules/wms/product/product.module";
import { WarehouseModule } from "@/modules/wms/warehouse/warehouse.module";

@Module({
  imports: [ProductModule, WarehouseModule],
  exports: [ProductModule, WarehouseModule],
})
export class WMSModule {}
