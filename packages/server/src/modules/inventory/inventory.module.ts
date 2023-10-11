import { Module } from "@nestjs/common";
import { ProductModule } from "@/modules/inventory/product/product.module";
import { StorageModule } from "@/modules/inventory/storage/storage.module";

@Module({
  imports: [ProductModule, StorageModule],
  exports: [ProductModule, StorageModule],
})
export class InventoryModule {}
