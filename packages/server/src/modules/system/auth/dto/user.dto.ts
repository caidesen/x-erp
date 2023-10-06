import { IdsOnly } from "@/common/dto";
import { RoleVO } from "./role.dto";

export interface CreateUserInput {
  nickname: string;
  roles: string[];
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}

export interface SetUserRolesInput extends IdsOnly {
  roles: number[];
}

export interface SimpleUserVO {
  id: string;
  nickname: string;
}

export interface UserVO {
  id: string;
  nickname: string;
  roles: RoleVO[];
}

export interface MyUserInfoVo {
  id: string;
  nickname: string;
  permissions: string[];
}
