import { Controller } from "@nestjs/common";
import { TypedRoute, TypedBody } from "@nestia/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Storage } from "@/modules/inventory/storage/entities/storage.entity";
import { serialize } from "@mikro-orm/core";
import {
  CreateStorageInput,
  StorageVO,
  UpdateStorageInput,
} from "@/modules/inventory/storage/dto/storage.dto";
import { InputException } from "@/common/exception";
import { IdsOnly } from "@/common/dto";
import Post = TypedRoute.Post;

@Controller("inventory/storage")
export class StorageController {
  constructor(private readonly em: EntityManager) {}

  @Post("all")
  async all() {
    const list = await this.em.find(Storage, {});
    return serialize(list) as unknown as StorageVO[];
  }

  @Post("create")
  async create(@TypedBody() input: CreateStorageInput) {
    const storage = new Storage(input);
    await this.em.persistAndFlush(storage);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateStorageInput) {
    const storage = await this.em.findOne(Storage, { id: input.id });
    if (!storage) throw new InputException("此仓库不存在");
    this.em.assign(storage, input);
    await this.em.flush();
  }

  @Post("batchRemove")
  async batchRemove(@TypedBody() input: IdsOnly) {
    const refs = input.ids.map((it) => this.em.getReference(Storage, it));
    this.em.remove(refs);
    await this.em.flush();
  }
}
