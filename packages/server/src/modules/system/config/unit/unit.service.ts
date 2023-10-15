import { Unit } from "@/modules/system/config/unit/entities/unit.entity";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";

export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: EntityRepository<Unit>
  ) {}
}
