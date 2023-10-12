import { defineAPI } from "@/shared";
import * as API from "@nest-admin/server";
import { defineQueryAPI } from "@/shared/lib/request";

const api = {
  auth: {
    loginByLocal: defineAPI<API.LoginInput, void>("auth/loginByLocal"),
    updatePassword: defineAPI<API.UpdatePasswordInput, void>(
      "auth/updatePassword"
    ),
  },
  system: {
    auth: {
      role: {
        all: defineAPI<void, API.RoleVO[]>("system/auth/role/getAllRole"),
        create: defineAPI<API.CreateRoleInput, void>(
          "system/auth/role/createRole"
        ),
        update: defineAPI<API.UpdateRoleInput, void>(
          "system/auth/role/updateRole"
        ),
        batchRemove: defineAPI<API.IdsOnly, void>(
          "system/auth/role/batchRemoveRole"
        ),
        getPermissions: defineAPI<void, Record<string, string>>(
          "system/auth/role/getPermissions"
        ),
      },
      user: {
        all: defineAPI<void, API.UserVO[]>("system/auth/user/getAllUser"),
        create: defineAPI<API.CreateUserInput, void>(
          "system/auth/user/createUser"
        ),
        update: defineAPI<API.UpdateUserInput, void>(
          "system/auth/user/updateUser"
        ),
        batchRemove: defineAPI<API.IdsOnly, void>(
          "system/auth/user/batchRemoveUser"
        ),
        getMine: defineAPI<void, API.MyUserInfoVo & { permissions: string[] }>(
          "system/auth/user/getMine"
        ),
      },
    },
    config: {
      measure: {
        getAllMeasurementUnit: defineQueryAPI<void, API.MeasurementUnitVO[]>(
          "config/measure/getAllMeasurementUnit"
        ),
        createMeasurementUnit: defineAPI<API.CreateMeasurementUnitInput, void>(
          "config/measure/createMeasurementUnit"
        ),
        updateMeasurementUnit: defineAPI<API.UpdateMeasurementUnitInput, void>(
          "config/measure/updateMeasurementUnit"
        ),
        batchRemoveMeasurementUnit: defineAPI<API.IdsOnly, void>(
          "config/measure/batchRemoveMeasurementUnit"
        ),
      },
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
  wms: {
    warehouse: {
      all: defineAPI<void, API.WarehouseVO[]>("wms/warehouse/all"),
      create: defineAPI<API.CreateWarehouseInput, void>("wms/warehouse/create"),
      update: defineAPI<API.UpdateWarehouseInput, void>("wms/warehouse/update"),
      batchRemove: defineAPI<API.IdsOnly, void>("wms/warehouse/batchRemove"),
    },
    product: {
      list: defineAPI<
        API.QueryProductInput,
        API.PaginationResult<API.ProductVO>
      >("wms/product/list"),
      detail: defineAPI<API.IdOnly, API.ProductDetailVO>("wms/product/detail"),
      create: defineAPI<API.CreateProductInput, void>("wms/product/create"),
      update: defineAPI<API.UpdateProductInput, void>("wms/product/update"),
      batchRemove: defineAPI<API.IdsOnly, void>("wms/product/batchRemove"),
    },
  },
};
export { api, API };
