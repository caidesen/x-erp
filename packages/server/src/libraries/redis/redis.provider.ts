import Redis from "ioredis";
export const REDIS_CLIENT = Symbol("REDIS_CLIENT");
export const RedisProvider = {
  useFactory: (): Redis => {
    return new Redis({
      host: "localhost",
      port: 6379,
    });
  },
  provide: REDIS_CLIENT,
};
