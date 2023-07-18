import { router } from "../../../trpc";
import { customerApi } from "./customer";

export const crmApi = router({
	customer: customerApi,
})
