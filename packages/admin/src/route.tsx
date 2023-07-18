import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  useRoutes,
} from "react-router-dom";
import React from "react";
import { MenuDataItem } from "@ant-design/pro-components";

export const routes: MenuDataItem[] = [
  {
    path: "/",
    lazy: () => import("@/layout/AdminLayout"),
    children: [
      {
        path: "/system",
        name: "系统管理",
        element: <Outlet />,
        children: [
          {
            path: "/system",
            element: <Navigate to="user" />,
          },
          {
            path: "/system/role",
            name: "角色管理",
            lazy: () => import("@/views/system/role/list"),
          },
          {
            path: "/system/user",
            name: "用户管理",
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
						path: "/crm",
						element: <Navigate to="customer" />,
					},
					{
						path: "/crm/customer",
						name: "客户列表",
						lazy: () => import("@/views/crm/customer"),
					}
				]
			},
    ],
  },
  {
    path: "/login",
    lazy: () => import("@/views/login"),
  },
];

export const router = createBrowserRouter(routes);
