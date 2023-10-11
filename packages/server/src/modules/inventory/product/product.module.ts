import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import {
  Product,
  ProductUnit,
} from "@/modules/inventory/product/entities/product.entity";
import { ProductController } from "@/modules/inventory/product/controllers/product.controller";

@Module({
  imports: [MikroOrmModule.forFeature([Product, ProductUnit])],
  controllers: [ProductController],
})
export class ProductModule {}
