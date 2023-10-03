import { defineAPI } from "@/shared";
import * as API from "@nest-admin/server";
const api = {
  auth: {
    loginByLocal: defineAPI<API.LoginInput, void>("auth/loginByLocal"),
    updatePassword: defineAPI<API.UpdatePasswordInput, void>(
      "auth/updatePassword"
    ),
  },
  system: {
    role: {
      all: defineAPI<void, API.RoleVO[]>("system/role/all"),
      create: defineAPI<API.CreateRoleInput, void>("system/role/create"),
      update: defineAPI<API.UpdateRoleInput, void>("system/role/update"),
      batchRemove: defineAPI<API.IdsOnly, void>("system/role/batchRemove"),
      getPermissions: defineAPI<void, Record<string, string>>(
        "system/role/getPermissions"
      ),
    },
    user: {
      all: defineAPI<void, API.UserVO[]>("system/user/all"),
      create: defineAPI<API.CreateUserInput, void>("system/user/create"),
      update: defineAPI<API.UpdateUserInput, void>("system/user/update"),
      batchRemove: defineAPI<API.IdsOnly, void>("system/user/batchRemove"),
      setRoles: defineAPI<API.SetUserRolesInput, void>("system/user/setRoles"),
      getMine: defineAPI<void, API.MyUserInfoVo & { permissions: string[] }>(
        "system/user/getMine"
      ),
    },
  },
  crm: {
    customer: {
      list: defineAPI<
        API.QueryCustomerInput,
        API.PaginationResult<API.CustomerVO>
      >("crm/customer/list"),
      create: defineAPI<API.CreateCustomerInput, void>("crm/customer/create"),
      update: defineAPI<API.UpdateCustomerInput, void>("crm/customer/update"),
      batchRemove: defineAPI<API.IdsOnly, void>("crm/customer/batchRemove"),
    },
  },
};
export { api, API };
