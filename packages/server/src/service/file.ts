import { fetch } from "../shared/fetch";
import { db } from "../shared/db";
import { decodeID, ID } from "../shared/hashids";
import fs from "fs-extra";
import { getConfig } from "src/config";
import { randomUUID } from "crypto";
import { redis } from "src/shared/redis";

/**
 * 将文件标记为占用状态
 */
export function occupyFile(id: number, remark?: string) {
	return db.file.update({
		where: { id },
		data: {
			occupied: true,
			remark,
		},
	});
}

/**
 * 将文件标记为未占用状态
 */
export function unOccupyFile(id: number, remark?: string) {
	return db.file.update({
		where: { id },
		data: {
			occupied: false,
			remark,
		},
	});
}

export async function getFileStream(key: string) {
	const { fileLocalStorePath } = getConfig();
	const path = `${fileLocalStorePath}/${key}`;
	if (!fs.existsSync(path)) return null;
	return fs.createReadStream(path);
}

/**
 * 申请上传文件的
 * @param filename 文件名
 * @param remark 备注(上传文件的描述)
 * @returns 上传key
 */
export async function applyUploadKey(filename: string, remark: string) {
	const key = randomUUID();
	await redis.set(
		`upload:key:${key}`,
		JSON.stringify({ filename, remark }),
		"EX",
		60
	);
	return key;
}

export function getFullUploadUrl(key: string) {
	return `/file/upload/${key}`;
}

export function getFullDownloadUrl(id: number) {
	return `/file/${ID(id)}`;
}
/**
 *  申请上传文件的路径
 *  @param filename 文件名
 *  @param remark 备注(上传文件的描述)
 *  @returns 上传路径
 */
export async function applyUploadPath(filename: string, remark: string) {
	return getFullUploadUrl(await applyUploadKey(filename, remark));
}

export async function getUploadInfo(key: string) {
	return redis.get(`upload:key:${key}`).then((it) => JSON.parse(it ?? "null"));
}

let fileLocalStoreReady = false;

export async function saveLocalFileFormStream(
	stream: NodeJS.ReadableStream | fs.ReadStream,
	key: string
): Promise<number> {
	const { fileLocalStorePath } = getConfig();
	// 判断文件夹是否存在，不存在则创建
	if (!fileLocalStoreReady) {
		fs.ensureDirSync(fileLocalStorePath);
		fileLocalStoreReady = true;
	}
	const uploadInfo = await getUploadInfo(key);
	if (uploadInfo === null) throw new Error("无法上传, 请重新上传");
	const file = await db.file.create({
		data: {
			name: uploadInfo.filename,
			remark: uploadInfo.remark,
			content: key,
			occupied: false,
			from: "Local",
		},
	});
	const path = `${fileLocalStorePath}/${key}`;
	const writeStream = fs.createWriteStream(path);
	stream.pipe(writeStream);
	return new Promise((resolve, reject) => {
		writeStream.on("finish", async () => {
			redis.del(`upload:key:${key}`);
			resolve(file.id);
		});
		writeStream.on("error", (e) => reject(e));
	});
}
