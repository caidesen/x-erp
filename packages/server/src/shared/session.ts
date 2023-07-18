import { redis } from "./redis";
import { User } from "@prisma/client";

export interface SessionContent {
  userId: number;
}

async function makeSessionId(): Promise<string> {
  const id = Math.random().toString(36).slice(2);
  const res = await redis.exists("session:" + id);
  if (res === 1) {
    return makeSessionId();
  }
  return id;
}

export async function createSession(user: Partial<User>): Promise<string> {
  const id = await makeSessionId();
  await redis.set(
    "session:" + id,
    `{"userId":${user.id}}`,
    "EX",
    60 * 60 * 24 * 7
  );
  return id;
}

export async function getSession(id: string): Promise<SessionContent | null> {
  const res = await redis.get("session:" + id);
  if (!res) {
    return null;
  }
  return JSON.parse(res);
}

export async function resetSession(id: string): Promise<void> {
  await redis.expire("session:" + id, 60 * 60 * 24 * 7);
}

export async function deleteSession(id: string): Promise<void> {
  await redis.del("session:" + id);
}
