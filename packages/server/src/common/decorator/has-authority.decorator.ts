import { SetMetadata } from "@nestjs/common";
import { permissionKeys } from "@/common/permissions";

export const AUTHORITY_KEY = "AUTHORITY_KEY";
export const HasAuthority = (...codes: permissionKeys[]) => {
  return SetMetadata(AUTHORITY_KEY, codes);
};
