import { Module } from "@nestjs/common";
import { ProductModule } from "@/modules/inventory/product/product.module";

@Module({
  imports: [ProductModule],
})
export class InventoryModule {}
