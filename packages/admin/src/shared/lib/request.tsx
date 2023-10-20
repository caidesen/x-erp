import type {
  DefinedUseQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
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
      try {
        return JSON.parse(res);
      } catch (e) {
        return res;
      }
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

interface IQueryApi<P, R> extends IApi<P, R> {
  useQuery(
    params: P,
    options: Omit<
      UseQueryOptions<R, unknown, R, [string, P]>,
      "queryKey" | "queryFn" | "initialData"
    > & { initialData: R | (() => R) }
  ): DefinedUseQueryResult<R>;

  useQuery(
    params: P,
    options?: Omit<
      UseQueryOptions<R, unknown, R, [string, P]>,
      "queryKey" | "queryFn"
    >
  ): UseQueryResult<R>;
}

interface IMutationApi<P, R> extends IApi<P, R> {
  useMutation(
    options?: Omit<UseMutationOptions<R, Error, P>, "queryKey" | "queryFn">
  ): UseMutationResult<R, Error, P>;
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

export function defineQueryAPI<P, R>(url: string): IQueryApi<P, R> {
  const fn = defineAPI(url) as IQueryApi<P, R>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fn.useQuery = (params: P, options?) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      ...options,
      queryKey: [url, params],
      queryFn: (a) => fn(params, { signal: a.signal }),
    });
  return fn;
}

export function defineMutationAPI<P, R>(url: string): IMutationApi<P, R> {
  const fn = defineAPI(url) as IMutationApi<P, R>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fn.useMutation = (options?) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMutation<R, Error, P>({
      ...options,
      mutationKey: [url],
      mutationFn: (params: P) => fn(params),
    });
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
