import { defineQueryAPI, defineAPI, defineMutationAPI } from "@/shared";
import * as API from "@nest-admin/server";

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
      unit: {
        all: defineQueryAPI<void, API.UnitVO[]>("config/unit/all"),
        create: defineAPI<API.CreateUnitInput, void>("config/unit/create"),
        update: defineAPI<API.UpdateUnitInput, void>("config/unit/update"),
        Unit: defineAPI<API.IdsOnly, void>("config/unit/batchRemove"),
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
    salesOrder: {
      list: defineAPI<
        API.QuerySalesOrderInput,
        API.PaginationResult<API.SalesOrderVO>
      >("crm/sales-order/list"),
      detail: defineQueryAPI<API.IdOnly, API.SalesOrderDetailVO>(
        "crm/sales-order/detail"
      ),
      create: defineAPI<API.CreateSalesOrderInput, void>(
        "crm/sales-order/create"
      ),
      update: defineAPI<API.UpdateSalesOrderInput, void>(
        "crm/sales-order/update"
      ),
      submit: defineAPI<API.IdOnly, void>("crm/sales-order/submit"),
      reverseSubmit: defineAPI<API.IdOnly, void>(
        "crm/sales-order/reverseSubmit"
      ),
      approve: defineAPI<API.IdOnly, void>("crm/sales-order/approve"),
      reverseApprove: defineAPI<API.IdOnly, void>(
        "crm/sales-order/reverseApprove"
      ),
      reject: defineAPI<API.IdOnly, void>("crm/sales-order/reject"),
      reverseReject: defineAPI<API.IdOnly, void>(
        "crm/sales-order/reverseReject"
      ),
      cancel: defineAPI<API.IdOnly, void>("crm/sales-order/cancel"),
    },
  },
  wms: {
    warehouse: {
      all: defineQueryAPI<void, API.WarehouseVO[]>("wms/warehouse/all"),
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
    beginningStock: {
      list: defineAPI<
        API.QueryBeginningStockInput,
        API.PaginationResult<API.BeginningStockVO>
      >("/wms/beginning-stock/list"),
      create: defineAPI<API.CreateBeginningStockInput, void>(
        "wms/beginning-stock/create"
      ),
      update: defineAPI<API.UpdateBeginningStockInput, void>(
        "wms/beginning-stock/update"
      ),
    },
  },
};
export { api, API };
