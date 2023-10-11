import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import session from "express-session";
import { REDIS_CLIENT } from "@/libraries/redis/redis.provider";
import Redis from "ioredis";
import RedisStore from "connect-redis";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: app.get<Redis>(REDIS_CLIENT),
        ttl: 1000 * 60 * 60 * 24 * 7,
        prefix: "x-erp:sess:",
      }),
      secret: "i am a secret",
      resave: false,
      saveUninitialized: false,
      name: "erp.connect.sid",
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
  await app.listen(3000);
}

bootstrap();
