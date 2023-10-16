import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import {
  Customer,
  CustomerContactInfo,
  CustomerLog,
} from "./entities/customer.entity";
import { CustomerController } from "./controllers/customer.controller";
import { SalesOrder } from "@/modules/crm/entities/sales-order.entity";
import { SalesOrderItem } from "@/modules/crm/entities/sales-order-item.entity";
import { SalesOrderController } from "@/modules/crm/controllers/sales-order.controller";

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Customer,
      CustomerContactInfo,
      CustomerLog,
      SalesOrder,
      SalesOrderItem,
    ]),
  ],
  controllers: [CustomerController, SalesOrderController],
})
export class CRMModule {}
