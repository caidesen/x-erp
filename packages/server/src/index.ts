import { createServer } from "./server";
import { logger } from "./shared/logger";
import { redis } from "./shared/redis";
import process from "process";
import { db } from "./shared/db";

const server = createServer();
redis.ping((err, result) => {
	if (err) {
		logger.error("redis connect error", err);
		process.exit(1);
	}
	logger.info("redis connect success");
});
db.$connect()
	.then(() => {
		logger.info("db connect success");
	})
	.catch((err) => {
		logger.error("db connect error", err);
		process.exit(1);
	});

void server.start();
export type { AppRouter, RpcInput, RpcOutput } from "./api/index";
export type { PermissionKey } from "./shared/permissions";
