import type { AppRouter } from "@trpc-admin/server";
import superjson from "superjson";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createTRPCReact,
	createWSClient,
	httpBatchLink,
	loggerLink,
	splitLink,
	wsLink,
} from "@trpc/react-query";
import { message, Modal } from "antd";
import React from "react";

const rpcPrefix = "/rpc";

export const trpc = createTRPCReact<AppRouter>();
const rpcWsLink = (function() {
	if (typeof window === "undefined") return null;
	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
	const hostname = window.location.hostname;
	const port = window.location.port ? `:${window.location.port}` : "";
	const wsUrl = `${protocol}//${hostname}${port}${rpcPrefix}`;
	const client = createWSClient({
		url: wsUrl,
	});
	return wsLink<AppRouter>({
		client,
	});
})();
const httpLink = (function() {
	return httpBatchLink({
		url: `${location.origin}${rpcPrefix}`,
	});
})();
export const trpcClient = trpc.createClient({
	transformer: superjson,
	links: [
		loggerLink({
			enabled: (opts) =>
				(import.meta.env.DEV && typeof window !== "undefined") ||
				(opts.direction === "down" && opts.result instanceof Error),
		}),
		splitLink({
			condition: (op) => op.type === "subscription",
			true: rpcWsLink ?? httpLink,
			false: httpLink,
		}),
	],
});

let showToLoginModalLock = false;
function queryClientErrorHandler(err: any) {
	if (err.name === "TRPCClientError") {
		if (err.data?.code === "UNAUTHORIZED") {
			if (showToLoginModalLock) return;
			showToLoginModalLock = true;
			Modal.confirm({
				title: "登录已过期",
				content: "请重新登录!",
				okText: "去登录",
				onOk() {
					const url = new URL("/login", location.origin);
					url.searchParams.set("redirect", location.pathname);
					location.replace(url);
					showToLoginModalLock = false;
				},
				onCancel() {
					showToLoginModalLock = false;
				},
			});
		}
		message.error(errorFormat(err));
	}
}

export const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			retry: false,
			onError: queryClientErrorHandler,
		},
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: 1000,
			onError: queryClientErrorHandler,
		},
	},
});

export function errorFormat(err: any) {
	if (typeof err === "string") {
		return err;
	}
	if (err.name === "TRPCClientError") {
		const msg = err.data?.message ?? err.message ?? "";
		if (!err.data && /^Unexpected/.test(msg)) return "网络开小差了，请稍后再试";
		return msg;
	}
	return err?.message ?? err?.toString() ?? "未知错误";
}

export function TRPCProvider({ children }: { children?: React.ReactNode }) {
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
