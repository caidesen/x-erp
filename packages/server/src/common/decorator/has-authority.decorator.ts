import { SetMetadata } from "@nestjs/common";

export const AUTHORITY_KEY = "AUTHORITY_KEY";
export const HasAuthority = (...codes: string[]) => {
  return SetMetadata(AUTHORITY_KEY, codes);
};
