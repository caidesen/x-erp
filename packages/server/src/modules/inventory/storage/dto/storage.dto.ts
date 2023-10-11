export interface CreateStorageInput {
  name: string;
  remarks: string;
}

export interface UpdateStorageInput extends Partial<CreateStorageInput> {
  id: string;
}

export interface StorageVO {
  id: string;
  name: string;
  remarks: string;
}
