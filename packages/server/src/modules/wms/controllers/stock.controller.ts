import { Controller } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";

@Controller("wms/stock")
export class StockController {
  constructor(private readonly em: EntityManager) {}
}
