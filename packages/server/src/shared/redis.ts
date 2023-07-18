import { Redis } from "ioredis";
import { getConfig } from "../config";
export const redis = new Redis({
  host: getConfig().redisHost,
  port: getConfig().redisPort,
  // connectTimeout: 1000,
  // commandTimeout: 2000,
});
