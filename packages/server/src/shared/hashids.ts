import Hashids from "hashids";
import { z } from "zod";
import { getConfig } from "../config";

const hashids = new Hashids(getConfig().hashIdSalt, 8);

export function ID(id: number) {
  return hashids.encode(id);
}

export function decodeID(hash: string) {
  const decode = hashids.decode(hash);
  if (decode.length !== 1) {
    throw new Error("invalid id");
  }
  return decode[0] as number;
}

/**
 * @description zod 中将 hashid 转换为 id
 */
export const zodHashId = z.string().transform(decodeID);
