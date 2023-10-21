import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@/libraries/redis/redis.decorator";
import Redis from "ioredis";
import dayjs from "dayjs";
import _ from "lodash";

@Injectable()
export class CodeService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /** redis中key的生成 */
  private genKey(namespace: string) {
    return `x-erp:unique-biz-code-${namespace}`;
  }

  private async getCurrentUniqueNumber(namespace: string) {
    const key = this.genKey(namespace);
    const number = await this.redis.incr(key);
    if (number === 1) {
      const unix = dayjs().startOf("hour").add(1, "second").unix();
      await this.redis.expireat(key, unix);
    }
    return _.padStart(number.toString(), 2, "0");
  }

  /**
   * 生成唯一的业务流水号
   * @param namespace
   */
  async generateCode(namespace: string) {
    const number = await this.getCurrentUniqueNumber(namespace);
    const now = dayjs();
    const seconds = now.diff(now.startOf("day"), "second");
    const year = now.format("YYYYMMDD");
    return `${year}${seconds}${number}`;
  }
}
