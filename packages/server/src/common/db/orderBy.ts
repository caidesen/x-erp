import { QueryOrder } from "@mikro-orm/core";

export const defaultOrderBy = {
  createdAt: QueryOrder.DESC,
  id: QueryOrder.DESC,
};
