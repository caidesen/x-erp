import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Product } from "@/modules/wms/product/entities/product.entity";
import { ProductController } from "@/modules/wms/product/controllers/product.controller";
import { ProductUnit } from "@/modules/wms/product/entities/product-uint.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Product, ProductUnit])],
  controllers: [ProductController],
})
export class ProductModule {}
