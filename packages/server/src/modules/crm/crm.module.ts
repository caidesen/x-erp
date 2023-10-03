import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import {
  Customer,
  CustomerContactInfo,
  CustomerLog,
} from "./entities/customer.entity";
import { CustomerController } from "./customer.controller";

@Module({
  imports: [
    MikroOrmModule.forFeature([Customer, CustomerContactInfo, CustomerLog]),
  ],
  controllers: [CustomerController],
})
export class CrmModule {}
