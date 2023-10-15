import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Product } from "@/modules/wms/entities/product.entity";
import { ProductUnit } from "@/modules/wms/entities/product-uint.entity";
import { ProductController } from "@/modules/wms/controllers/product.controller";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";
import { WarehouseController } from "@/modules/wms/controllers/warehouse.controller";
import { Stock } from "@/modules/wms/entities/stock.entity";
import { StockService } from "@/modules/wms/services/stock.service";
import { BeginningStockController } from "@/modules/wms/controllers/beginning-stock.controller";
import { StockRecord } from "@/modules/wms/entities/stock-record.entity";
import { BeginningStock } from "@/modules/wms/entities/beginning-stock.entity";

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Product,
      ProductUnit,
      Warehouse,
      Stock,
      StockRecord,
      BeginningStock,
    ]),
  ],
  controllers: [
    ProductController,
    WarehouseController,
    BeginningStockController,
  ],
  providers: [StockService],
  exports: [],
})
export class WMSModule {}
