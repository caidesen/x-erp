import { Navigate, Outlet } from "react-router-dom";
import { MenuDataItem } from "@ant-design/pro-components";
import _ from "lodash";
import { useMemo } from "react";

type RouteType = MenuDataItem & {
  needPermissions?: string[];
  children?: RouteType[];
};

const bizPageRoutes: RouteType[] = [
  {
    path: "",
    name: "首页",
    element: <div>欢迎</div>,
  },
  {
    path: "/system",
    name: "系统管理",
    element: <Outlet />,
    children: [
      {
        path: "/system/role",
        name: "角色管理",
        needPermissions: ["role:all"],
        lazy: () => import("@/views/system/role/list"),
      },
      {
        path: "/system/user",
        name: "用户管理",
        needPermissions: ["user:all"],
        lazy: () => import("@/views/system/user/list"),
      },
      {
        path: "/system/config/unit",
        name: "计量单位管理",
        needPermissions: ["config:unit:all"],
        lazy: () => import("@/views/system/config/unit/list"),
      },
    ],
  },
  {
    path: "/crm",
    name: "销售管理",
    element: <Outlet />,
    children: [
      {
        path: "/crm/customer",
        name: "客户列表",
        needPermissions: ["customer:query"],
        lazy: () => import("@/views/crm/customer/customer"),
      },
      {
        path: "/crm/sales-order",
        name: "销售单",
        element: <Outlet />,
        children: [
          {
            path: "/crm/sales-order/list",
            name: "销售单列表",
            hideInMenu: true,
            lazy: () => import("@/views/crm/sales-order/list"),
          },
          {
            path: "/crm/sales-order/create",
            name: "新建销售单",
            hideInMenu: true,
            lazy: () => import("@/views/crm/sales-order/form"),
          },
          {
            path: "/crm/sales-order/detail/:id",
            name: "销售单详情",
            hideInMenu: true,
            lazy: () => import("@/views/crm/sales-order/detail"),
          },
          {
            path: "/crm/sales-order/edit/:id",
            name: "销售单编辑",
            hideInMenu: true,
            lazy: () => import("@/views/crm/sales-order/form"),
          },
        ],
      },
    ],
  },
  {
    path: "/wms",
    name: "库存管理",
    element: <Outlet />,
    children: [
      {
        path: "/wms/product",
        name: "商品管理",
        needPermissions: ["wms:query"],
        lazy: () => import("@/views/wms/product/list"),
      },
      {
        path: "/wms/warehouse",
        name: "仓库管理",
        needPermissions: ["wms:query"],
        lazy: () => import("@/views/wms/warehouse/list"),
      },
      {
        path: "/wms/begging-stock",
        name: "期初库存",
        needPermissions: ["wms:query"],
        lazy: () => import("@/views/wms/beginning-stock/list"),
      },
    ],
  },
];

export function routesFilterWithPermissions(
  routes: RouteType[],
  permissions: string[]
) {
  const result: RouteType[] = [];
  for (const route of routes) {
    if (route.children?.length) {
      route.children = routesFilterWithPermissions(route.children, permissions);
    }
    if (!route.children || route.children.length) result.push(route);
    else if (
      route.needPermissions &&
      route.needPermissions.some((permission) =>
        permissions?.includes(permission)
      )
    )
      result.push(route);
    if (route.children?.length) {
      route.children.unshift({
        path: route.path,
        element: <Navigate to={route.children[0].path!} />,
      });
    }
  }
  return result;
}

export function useFilteredRoutes(permissions: string[]) {
  const filteredRoutes = useMemo(
    () =>
      routesFilterWithPermissions(
        _.cloneDeep(bizPageRoutes),
        permissions || []
      ),
    [permissions]
  );
  return [
    {
      id: "root",
      path: "/",
      lazy: () => import("@/layout/AdminLayout"),
      children: filteredRoutes,
    },
    {
      path: "/login",
      name: "登录",
      lazy: () => import("@/views/login"),
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ];
}
