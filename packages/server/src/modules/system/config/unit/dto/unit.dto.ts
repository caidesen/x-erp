export interface CreateUnitInput {
  name: string;
  abbreviation?: string;
  decimals: number;
}

export interface UpdateUnitInput extends Partial<CreateUnitInput> {
  id: string;
}

export interface UnitVO {
  id: string;
  name: string;
  abbreviation?: string;
  decimals: number;
}
