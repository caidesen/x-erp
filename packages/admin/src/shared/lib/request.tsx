import { QueryClient } from "@tanstack/react-query";
import { message } from "antd";

export async function request(url: string, options?: RequestInit) {
  const mergedOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  };
  return fetch("/api/" + url, mergedOptions)
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      if (res.status === 401) {
        const url = new URL("/login", location.origin);
        url.searchParams.set("redirect", location.pathname);
        location.replace(url);
        throw new Error("未登录，或者登录已过期");
      }
      const error = new Error(res.statusText);
      return Promise.reject(error);
    })
    .then((res) => {
      if (typeof res === "string") {
        try {
          return JSON.parse(res);
        } catch (e) {
          return res;
        }
      }
      return res;
    })
    .catch((err) => {
      message.error(err.message);
      return Promise.reject(err);
    });
}
interface IApi<P, R> {
  cacheKey: string;
  (params: P, options?: RequestInit): Promise<R>;
}
export function defineAPI<P, R>(url: string): IApi<P, R> {
  const fn = function (params: P, options?: RequestInit) {
    return request(url, {
      body: JSON.stringify(params),
      ...options,
    }) as Promise<R>;
  };
  fn.cacheKey = url;
  return fn;
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 5,
      staleTime: 500,
    },
  },
});
