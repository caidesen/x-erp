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
        path: "/system/config/measure",
        name: "计量单位管理",
        needPermissions: ["config:measure:all"],
        lazy: () => import("@/views/system/config/measure/list"),
      },
    ],
  },
  {
    path: "/crm",
    name: "客户管理",
    element: <Outlet />,
    children: [
      {
        path: "/crm/customer",
        name: "客户列表",
        needPermissions: ["customer:query"],
        lazy: () => import("@/views/crm/customer"),
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
