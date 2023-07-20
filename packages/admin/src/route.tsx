import { Navigate, Outlet } from "react-router-dom";
import { MenuDataItem } from "@ant-design/pro-components";
import { PermissionKey } from "@trpc-admin/server";
import { trpc } from "./shared";
import _ from "lodash";
import { useMemo } from "react";
type RouteType = MenuDataItem & {
  needPermissions?: PermissionKey[];
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

export function useFilteredRoutes() {
  const isLoginPage = location.pathname === "/login";
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery(undefined, {
    enabled: !isLoginPage,
  });
  const filteredRoutes = useMemo(
    () =>
      routesFilterWithPermissions(
        _.cloneDeep(bizPageRoutes),
        userInfo?.permissions || []
      ),
    [userInfo?.permissions]
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
