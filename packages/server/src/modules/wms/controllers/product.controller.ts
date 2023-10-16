import { Controller } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { TypedBody, TypedRoute } from "@nestia/core";
import {
  CreateProductInput,
  ProductDetailVO,
  ProductVO,
  QueryProductInput,
  UpdateProductInput,
} from "@/modules/wms/dto/product.dto";
import { Product } from "@/modules/wms/entities/product.entity";
import { ProductUnit } from "@/modules/wms/entities/product-uint.entity";

import { queryCondBuilder } from "@/common/db/query-cond-builder";
import { getPageableParams } from "@/common/helpers/pagination";
import { LoadStrategy, QueryOrder, ref, serialize } from "@mikro-orm/core";
import { IdOnly, IdsOnly, PaginationResult } from "@/common/dto";
import _ from "lodash";
import { InputException } from "@/common/exception";
import { Unit } from "@/modules/system/config/unit/entities/unit.entity";
import Post = TypedRoute.Post;

@Controller("wms/product")
export class ProductController {
  constructor(private readonly em: EntityManager) {}

  @Post("list")
  async list(
    @TypedBody() input: QueryProductInput
  ): Promise<PaginationResult<ProductVO>> {
    const cond = queryCondBuilder<Product>().like("name", input.name).cond;
    const { offset, limit } = getPageableParams(input);
    const [list, total] = await this.em
      .qb(Product, "p0")
      .where(cond)
      .limit(limit, offset)
      .leftJoinAndSelect("p0.baseUnit", "b0")
      .orderBy({
        createdAt: QueryOrder.DESC,
        id: QueryOrder.DESC,
      })
      .getResultAndCount();
    return {
      list: serialize(list, {
        populate: ["baseUnit"],
      }) as unknown as ProductVO[],
      total,
    };
  }

  @Post("detail")
  async detail(@TypedBody() input: IdOnly) {
    const product = await this.em.findOne(
      Product,
      { id: input.id },
      {
        populate: ["baseUnit", "units"],
      }
    );
    if (!product) throw new InputException("此商品不存在");
    return serialize(product, {
      populate: ["baseUnit", "units"],
    }) as unknown as ProductDetailVO;
  }

  @Post("create")
  async create(@TypedBody() input: CreateProductInput) {
    const product = new Product(_.omit(input, ["units", "baseUnit"]));
    product.baseUnit = ref(Unit, input.baseUnit.id);
    if (input.multiUnitEnabled) {
      if (!input.units || input.units.length === 0) {
        throw new InputException("至少选择一个计量单位");
      }
      product.units.set(
        input.units.map(
          (it) =>
            new ProductUnit({
              transformRatio: it.transformRatio,
              unitId: it.unitId,
            })
        )
      );
    }
    await this.em.persistAndFlush(product);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateProductInput) {
    const product = await this.em.findOne(
      Product,
      { id: input.id },
      {
        populate: true,
        strategy: LoadStrategy.JOINED,
      }
    );
    if (!product) throw new InputException("此商品不存在");
    this.em.assign(
      product,
      _.pick(input, ["multiUnitEnabled", "name", "remarks"])
    );
    if (input.units) {
      const map = _.keyBy(input.units, "unitId");
      product.units.remove((it) => !_.has(map, it.unitId));
      for (const unit of product.units) {
        this.em.assign(unit, {
          transformRatio: map[unit.unitId]?.transformRatio,
        });
      }
    }
    await this.em.flush();
  }

  @Post("batchRemove")
  async batchRemove(@TypedBody() input: IdsOnly) {
    this.em.remove(input.ids.map((it) => this.em.getReference(Product, it)));
    const productUnits = await this.em.find(ProductUnit, {
      product: {
        id: {
          $in: input.ids,
        },
      },
    });
    this.em.remove(productUnits);
    await this.em.flush();
  }
}
