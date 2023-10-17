import { PageableQueryInput } from "@/common/dto";
import { tags } from "typia";
import { UnitVO } from "@/modules/system/config/unit/dto/unit.dto";

export interface QueryProductInput extends PageableQueryInput {
  name?: string;
}

export interface ProductVO {
  id: string;
  name: string;
  remarks: string;
  baseUnit: UnitVO;
  multiUnitEnabled: boolean;
}

export interface ProductDetailVO extends ProductVO {
  units: ProductUnitVO[];
}

export interface ProductUnitVO {
  unitId: string;
  name: string;
  transformRatio: string;
}

export interface CreateProductInput {
  name: string & tags.MaxLength<20>;
  remarks: string;
  baseUnit: {
    id: string;
  };
  multiUnitEnabled: boolean;
  units?: Omit<ProductUnitVO, "name">[];
}

export interface UpdateProductInput
  extends Partial<Omit<CreateProductInput, "baseUnit">> {
  id: string;
}
