import { PageableQueryInput } from "@/common/dto";
import { SimpleUserVO } from "@/modules/system/auth/dto/user.dto";

export interface QueryCustomerInput extends PageableQueryInput {
  fullName?: string;
  shortName?: string;
  property?: string;
  region?: string;
  personInChargeUser?: {
    nickname?: string;
  };
}

export class CustomerContactInfoVo {
  id?: string;
  name: string;
  phone: string;
  address: string;
}

export interface CreateCustomerInput {
  fullName: string;
  shortName: string;
  property: string;
  region: string;
  personInChargeUserId: string;
  remarks: string;
  contacts: CustomerContactInfoVo[];
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  id: string;
}

export interface CustomerVO {
  id: string;
  fullName: string;
  shortName: string;
  property: string;
  region: string;
  personInChargeUser: SimpleUserVO | null;
  remarks: string;
  contacts: CustomerContactInfoVo[];
}
