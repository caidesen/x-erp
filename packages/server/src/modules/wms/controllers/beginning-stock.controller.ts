import { Controller } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  BeginningStockVO,
  CreateBeginningStockInput,
  QueryBeginningStockInput,
  UpdateBeginningStockInput,
} from "@/modules/wms/dto/beginning-stock.dto";
import { BeginningStock } from "@/modules/wms/entities/beginning-stock.entity";
import { queryCondBuilder } from "@/common/db/query-cond-builder";
import { getPageableParams } from "@/common/helpers/pagination";
import { PaginationResult } from "@/common/dto";
import { Serializer } from "@/common/helpers/serialize";
import { ref } from "@mikro-orm/core";
import { Product } from "@/modules/wms/entities/product.entity";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";
import { UserId } from "@/common/decorator/user-id.decorator";
import { User } from "@/modules/system/auth/entities/user.entity";
import { InputException } from "@/common/exception";
import { StockService } from "@/modules/wms/services/stock.service";
import { StockRecordBizType } from "@/modules/wms/constant/biz-type.enum";
import { Big } from "big.js";
import Post = TypedRoute.Post;

@Controller("wms/beginning-stock")
export class BeginningStockController {
  constructor(
    private readonly em: EntityManager,
    private readonly stockService: StockService
  ) {}

  @Post("list")
  async list(
    @TypedBody() input: QueryBeginningStockInput
  ): Promise<PaginationResult<BeginningStockVO>> {
    const { offset, limit } = getPageableParams(input);
    const cond = queryCondBuilder<BeginningStock>().like(
      "product.name",
      input.product?.name
    ).cond;
    const [list, total] = await this.em.findAndCount(BeginningStock, cond, {
      populate: ["product", "creator", "updater", "warehouse"],
      offset,
      limit,
    });
    return Serializer(list, {
      populate: true,
    }).toPaginationResult<BeginningStockVO>(total);
  }

  @Post("create")
  async create(
    @UserId() userId: string,
    @TypedBody() input: CreateBeginningStockInput
  ) {
    await this.em.begin();
    try {
      const beginningStock = new BeginningStock();
      beginningStock.quantity = input.quantity;
      beginningStock.product = ref(Product, input.product.id);
      beginningStock.warehouse = ref(Warehouse, input.warehouse.id);
      beginningStock.creator = ref(User, userId);
      beginningStock.updater = ref(User, userId);
      await this.em.persistAndFlush(beginningStock);
      await this.stockService.updateStock({
        productId: input.product.id,
        warehouseId: input.warehouse.id,
        quantity: input.quantity,
        bizOrderId: beginningStock.id,
        bizType: StockRecordBizType.BEGINNING_STOCK,
      });
      await this.em.commit();
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  @Post("update")
  async update(
    @UserId() userId: string,
    @TypedBody() input: UpdateBeginningStockInput
  ) {
    const beginningStock = await this.em.findOne(BeginningStock, {
      id: input.id,
    });
    if (!beginningStock) throw new InputException("此计量单位不存在");
    if (beginningStock.quantity === input.quantity) {
      return;
    }
    await this.em.begin();
    try {
      const changQuantity = Big(input.quantity)
        .minus(beginningStock.quantity)
        .toString();
      await this.stockService.updateStock({
        productId: beginningStock.product.id,
        warehouseId: beginningStock.warehouse.id,
        quantity: changQuantity,
        bizOrderId: beginningStock.id,
        bizType: StockRecordBizType.CHANGE_BEGINNING_STOCK,
      });
      this.em.assign(beginningStock, {
        quantity: input.quantity,
        updater: ref(User, userId),
      });
      await this.em.commit();
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }
}
