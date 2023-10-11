import { Global, Module } from "@nestjs/common";
import "./dayjs.import";
import { RedisModule } from "@/libraries/redis/redis.module";

@Global()
@Module({
  imports: [RedisModule],
  exports: [RedisModule],
})
export class LibrariesModule {}
