interface appConfig {
  readonly dev: boolean;
  readonly port: number;
  readonly host: string;
  readonly rpcPrefix: string;
  readonly hashIdSalt: string;
  readonly redisHost: string;
  readonly redisPort: number;
  readonly staticPath: string;
	readonly fileLocalStorePath: string;
}
const config: appConfig = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3000,
  host: process.env.SERVER_HOST || "",
  rpcPrefix: process.env.RPC_PREFIX || "/rpc",
  hashIdSalt: process.env.HASH_ID_SALT || "00xx11",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  staticPath: process.env.STATIC_PATH || "../admin/dist",
	fileLocalStorePath: process.env.FILE_LOCAL_STORE_PATH || "./.file_store",
};
export function getConfig(): appConfig {
  return config;
}
