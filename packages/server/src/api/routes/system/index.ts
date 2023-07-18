import { router } from "../../../trpc";
import { userApi } from "./user";
import { permissionApi } from "./permission";
import { roleApi } from "./role";

export const systemApi = router({
  permission: permissionApi,
  role: roleApi,
  user: userApi,
});
