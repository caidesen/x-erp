import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useFilteredRoutes } from "./route";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export default function App() {
  const isLoginPage = location.pathname === "/login";
  const { data: userInfo, isLoading: userInfoLoading } = useQuery({
    queryKey: [api.system.user.getMine.cacheKey],
    queryFn: () => api.system.user.getMine(),
    enabled: !isLoginPage,
  });
  const routes = useFilteredRoutes(userInfo?.permissions ?? []);
  const router = useMemo(() => createBrowserRouter(routes), [routes]);
  if (userInfoLoading) {
    return <div>loading...</div>;
  }
  return <RouterProvider router={router} />;
}
