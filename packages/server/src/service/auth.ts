import bcrypt from "bcrypt";
import { db } from "../shared/db";
import _ from 'lodash'

export function hashPassword(password: string) {
  return bcrypt.hash(password, 4);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/**
 * 获取用户的权限
 */
export async function getUserPermissions(id: number) {
  const rows = await db.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      roles: {
        select: { permissions: true },
      },
    },
  });
	rows.roles.map(it => it.permissions)
	return _(rows.roles.map(it => it.permissions)).flatten().uniq().value()
}

/**
 * 权限
 */
export interface Permission {
  code: string;
  name: string;
  remark?: string;
}
export const permissionsDefine: Permission[] = [
	{
		code: '',
		name: '',
	}
];
