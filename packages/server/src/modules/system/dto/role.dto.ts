export interface CreateRoleInput {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  id: string;
}

export interface RoleVO {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
