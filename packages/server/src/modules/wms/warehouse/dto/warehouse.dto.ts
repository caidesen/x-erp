export interface CreateWarehouseInput {
  name: string;
  remarks: string;
}

export interface UpdateWarehouseInput extends Partial<CreateWarehouseInput> {
  id: string;
}

export interface WarehouseVO {
  id: string;
  name: string;
  remarks: string;
}
