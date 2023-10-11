import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Storage } from "@/modules/inventory/storage/entities/storage.entity";
import { StorageController } from "@/modules/inventory/storage/controllers/storage.controller";

@Module({
  imports: [MikroOrmModule.forFeature([Storage])],
  controllers: [StorageController],
})
export class StorageModule {}
