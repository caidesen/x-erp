import { createAuthMeta } from "../../../shared/permissions";
import { privateProcedure, router } from "../../../trpc";
import { queryPageable } from "../../../shared/zod-schame";
import { z } from "zod";
import { db } from "../../../shared/db";
import ExcelJS from "exceljs";
import { Readable, Writable } from "stream";
import {
	applyUploadKey,
	getFileStream,
	getFullDownloadUrl,
	saveLocalFileFormStream,
} from "../../../service/file";
import { logger } from "../../../shared/logger";
import { zodHashId } from "../../../shared/hashids";
// @ts-ignore
// import pinyin from "pinyinlite";
// function getPinYin(str: string): string {
// 	return pinyin(str, {
// 		style: pinyin.STYLE_NORMAL,
// 	})
// 		.map((item: string) => item[0])
// 		.join("");
// }

const queryCustomerInput = z.object({
	fullName: z.string().optional(),
	shortName: z.string().optional(),
	property: z.string().optional(),
	region: z.string().optional(),
	contactInfo: z.string().optional(),
	contactName: z.string().optional(),
	personInChargeUser: z.object({ nickname: z.string() }).optional(),
	address: z.string().optional(),
});
function queryInputToWhere(input: z.infer<typeof queryCustomerInput>) {
	return {
		fullName: input.fullName ? { contains: input.fullName } : undefined,
		shortName: input.shortName ? { contains: input.shortName } : undefined,
		property: input.property,
		region: input.region,
		contactInfo: input.contactInfo
			? { contains: input.contactInfo }
			: undefined,
		contactName: input.contactName
			? { contains: input.contactName }
			: undefined,
		address: input.address ? { contains: input.address } : undefined,
		personInChargeUser: input.personInChargeUser
			? {
				nickname: {
					contains: input.personInChargeUser?.nickname,
				},
			}
			: undefined,
	};
}
const createCustomerInput = z.object({
	fullName: z.string(),
	shortName: z.string(),
	property: z.string(),
	region: z.string(),
	contactInfo: z.string(),
	contactName: z.string(),
	personInChargeUserId: z.number().optional(),
	address: z.string(),
	remarks: z.string(),
});

const updateCustomerInput = createCustomerInput.partial().extend({
	id: z.number(),
});

const excelColumns: Partial<ExcelJS.Column>[] = [
	{ header: "客户全称", key: "fullName", width: 20 },
	{ header: "客户简称", key: "shortName", width: 20 },
	{ header: "客户性质", key: "property", width: 20 },
	{ header: "所属区域", key: "region", width: 20 },
	{ header: "联系方式", key: "contactInfo", width: 20 },
	{ header: "联系人", key: "contactName", width: 20 },
	{ header: "负责人", key: "personInChargeUserName", width: 20 },
	{ header: "地址", key: "address", width: 20 },
	{ header: "备注", key: "remarks", width: 20 },
];
export const customerApi = router({
	list: privateProcedure
		.meta(createAuthMeta("customer:query"))
		.input(queryCustomerInput.merge(queryPageable))
		.query(async ({ input }) => {
			const { pageSize, current } = input;
			const where = queryInputToWhere(input);
			const [total, data] = await Promise.all([
				db.customer.count({ where }),
				db.customer.findMany({
					where,
					include: { personInChargeUser: true },
					skip: pageSize * (current - 1),
					take: pageSize,
				}),
			]);
			return { total, data };
		}),
	create: privateProcedure
		.meta(createAuthMeta("customer:create"))
		.input(createCustomerInput)
		.mutation(async ({ input }) => {
			await db.customer.create({ data: input });
		}),
	update: privateProcedure
		.meta(createAuthMeta("customer:update"))
		.input(updateCustomerInput)
		.mutation(async ({ input }) => {
			await db.customer.update({
				where: { id: input.id },
				data: input,
			});
		}),
	delete: privateProcedure
		.meta(createAuthMeta("customer:delete"))
		.input(z.number())
		.mutation(async ({ input }) => {
			await db.customer.delete({ where: { id: input } });
		}),
	exportExcel: privateProcedure
		.meta(createAuthMeta("customer:query"))
		.input(queryCustomerInput)
		.mutation(async ({ input }) => {
			const where = queryInputToWhere(input);
			const data = await db.customer.findMany({
				where,
				include: { personInChargeUser: true },
			});
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("客户信息");
			worksheet.columns = excelColumns;
			worksheet.addRows(
				data.map((item) => ({
					fullName: item.fullName,
					shortName: item.shortName,
					property: item.property,
					region: item.region,
					contactInfo: item.contactInfo,
					contactName: item.contactName,
					personInChargeUserName: item.personInChargeUser?.nickname,
					address: item.address,
					remarks: item.remarks,
				}))
			);
			try {
				const r = new Readable({
					read(size) {
						return;
					},
				});
				const w = new Writable({
					write(chunk, encoding, callback) {
						r.push(chunk);
						callback();
					},
				});
				workbook.xlsx.write(w).then(() => {
					r.push(null);
					r.emit("end");
				});
				const key = await applyUploadKey("客户信息.xlsx", "导出的客户信息");
				const fileId = await saveLocalFileFormStream(r, key);
				return getFullDownloadUrl(fileId);
			} catch (error) {
				logger.error(error);
				throw error;
			}
		}),
	import: privateProcedure
		.meta(createAuthMeta("customer:create"))
		.input(
			z.object({
				fileId: zodHashId,
				personInChargeUserId: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const file = await db.file.findUnique({ where: { id: input.fileId } });
			if (!file) {
				throw new Error("文件不存在");
			}
			const readStream = await getFileStream(file.content);
			if (!readStream) {
				throw new Error("文件不存在");
			}
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.read(readStream);
			const worksheet = workbook.getWorksheet(1);
			worksheet.columns = excelColumns;
			const dataTotal = worksheet.rowCount;
			const rows = worksheet.getRows(2, dataTotal - 1);
			if (!rows) {
				throw new Error("文件格式错误");
			}
			const getString = (row: (typeof rows)[0], key: string) =>
				row.getCell(key).value?.toString().trim() ?? "";
			await db.customer.createMany({
				data: rows.map((row) => ({
					personInChargeUserId: input.personInChargeUserId,
					fullName: getString(row, "fullName"),
					shortName: getString(row, "shortName"),
					property: getString(row, "property"),
					region: getString(row, "region"),
					contactInfo: getString(row, "contactInfo"),
					contactName: getString(row, "contactName"),
					address: getString(row, "address"),
					remarks: getString(row, "remarks"),
				})),
			});
			// await db.$transaction(async (prisma) => {
			//   const personInChargeUserMap = new Map<string, User | null>();
			//   for (const row of rows) {
			//     const getString = (key: string) =>
			//       row.getCell(key).value?.toString().trim() ?? "";
			//     const customer = {
			//       fullName: getString("fullName"),
			//       shortName: getString("shortName"),
			//       property: getString("property"),
			//       region: getString("region"),
			//       contactInfo: getString("contactInfo"),
			//       contactName: getString("contactName"),
			//       address: getString("address"),
			//       remarks: getString("remarks"),
			//     };
			//     const personInChargeUserName = getString("personInChargeUserName");
			//     let personInChargeUser: User | null | undefined;
			//     if (personInChargeUserName) {
			//       personInChargeUser = personInChargeUserMap.get(
			//         personInChargeUserName
			//       );
			//       // 如果缓存里没有，就去数据库里找
			//       if (!personInChargeUser)
			//         personInChargeUser = await prisma.user.findUnique({
			//           where: { nickname: personInChargeUserName },
			//         });
			//       // 如果数据库里也没有，就创建一个, 创建失败就算了
			//       if (!personInChargeUser)
			//         try {
			//           personInChargeUser = await db.user.create({
			//             data: {
			//               nickname: personInChargeUserName,
			//               account: {
			//                 create: {
			//                   username: getPinYin(personInChargeUserName),
			//                   password: await hashPassword("123456"),
			//                 },
			//               },
			//             },
			//           });
			//         } catch (error) {}
			//       personInChargeUserMap.set(
			//         personInChargeUserName,
			//         personInChargeUser
			//       );
			//     }
			//     await db.customer.create({
			//       data: {
			//         ...customer,
			//         personInChargeUser: personInChargeUser
			//           ? {
			//               connect: {
			//                 id: personInChargeUser.id,
			//               },
			//             }
			//           : undefined,
			//       },
			//     });
			//   }
			// });
		}),
});
