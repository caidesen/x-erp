import { SetMetadata } from "@nestjs/common";

export const AuthIgnoreKey = "AUTH_IGNORE_KEY";
export const AuthIgnore = () => {
  return SetMetadata(AuthIgnoreKey, true);
};
