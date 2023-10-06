export type PermissionKey = keyof typeof fixedPermissions;

export function createAuthMeta(...permissions: PermissionKey[]) {
  return {
    permissions,
  };
}

const customerPermissions = {
  "customer:query": "客户查询",
  "customer:create": "客户创建",
  "customer:update": "客户更新",
  "customer:delete": "客户删除",
  "customer:import": "客户导入",
  "customer:export": "客户导出",
} as const;
const configPermissions = {
  "config:all": "计量单位查询",
} as const;
export const fixedPermissions = {
  "role:all": "角色管理",
  "user:all": "用户管理",
  ...customerPermissions,
  ...configPermissions,
} as const;
export type permissionKeys = keyof typeof fixedPermissions;
