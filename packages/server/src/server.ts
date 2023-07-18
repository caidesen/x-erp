import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import cookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { createContext } from "./trpc/";
import { appRouter } from "./api";
import ws from "@fastify/websocket";
import { getConfig } from "./config";
import { logger } from "./shared/logger";
import * as path from "path";
import * as process from "process";
import { deleteSession } from "./shared/session";
import { db } from "./shared/db";
import * as R from "ramda";
import { ID, decodeID } from "./shared/hashids";
import fs from "fs";
import mutipart from "@fastify/multipart";
import { getFileStream, saveLocalFileFormStream } from "./service/file";

function registerMiddleware(server: FastifyInstance) {
  const prefix = getConfig().rpcPrefix;
  // websocket 插件
  server.register(ws);
  // cookie 插件
  server.register(cookie);
  // trpc 插件
  server.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });
  // 上传文件需要的插件
  server.register(mutipart);
  // 静态文件插件(站点根目录)
  server.register(fastifyStatic, {
    root: path.join(process.cwd(), getConfig().staticPath),
    prefix: "/",
    index: false,
    wildcard: false,
    cacheControl: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
}
function sendNotFound(reply: any) {
  reply.status(404).send("404");
}
function registerRoutes(server: FastifyInstance) {
  /** 退出登录 */
  server.get("/logout", async (req, reply) => {
    if (!req.cookies.sessionId) return reply.redirect("/");
    reply.clearCookie("sessionId");
    await deleteSession(req.cookies.sessionId!);
    reply.redirect("/");
  });
  /** 文件下载 */
  server.get("/file/:id", async (req: FastifyRequest, reply) => {
    const fileIdText = (req.params as any).id;
    if (R.isEmpty(fileIdText)) return sendNotFound(reply);
    const fileId = decodeID(fileIdText);
    const file = await db.file.findUnique({ where: { id: fileId } });
    if (!file) return sendNotFound(reply);
    const filePath = file.content;
    const stream = await getFileStream(filePath);
    if (!stream) return sendNotFound(reply);
    reply.header("Content-Type", "application/octet-stream");
    reply.header(
      "Content-Disposition",
      `attachment; filename=${encodeURI(file.name)}`
    );
    return reply.send(stream);
  });
  /** 文件上传 */
  server.post("/file/upload/:key", async (req, reply) => {
    const key = (req.params as any).key;
    const data = await req.file();
    if (!data) return reply.status(400).send("no file");
    const { file } = data;
    const fileId = await saveLocalFileFormStream(file, key);
    return reply.send(ID(fileId));
  });
  function sendIndexFile(reply: FastifyReply) {
    reply.header("Content-Type", "text/html");
    const p = path.join(process.cwd(), getConfig().staticPath, "index.html");
    fs.createReadStream(p);
    reply.send(p);
  }
  server.get("*", async (req, reply) => {
    sendIndexFile(reply);
  });
}

export function createServer() {
  const server = fastify({
    logger: false,
  });
  registerMiddleware(server);
  registerRoutes(server);
  const stop = async () => {
    await server.close();
  };
  const start = async () => {
    try {
      await server.listen({ port: getConfig().port, host: getConfig().host });
      logger.info(`Server listening on port ${getConfig().port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}
