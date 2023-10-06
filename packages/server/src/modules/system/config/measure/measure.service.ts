import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";

export class MeasureService {
  constructor(
    @InjectRepository(MeasurementUnit)
    private readonly measureRepository: EntityRepository<MeasurementUnit>
  ) {}
}
