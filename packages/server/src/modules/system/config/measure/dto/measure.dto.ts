export interface CreateMeasurementUnitInput {
  name: string;
  abbreviation?: string;
  decimals: number;
}

export interface UpdateMeasurementUnitInput
  extends Partial<CreateMeasurementUnitInput> {
  id: string;
}

export interface MeasurementUnitVO {
  id: string;
  name: string;
  abbreviation?: string;
  decimals: number;
}
