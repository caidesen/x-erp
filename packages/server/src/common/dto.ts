import { tags } from "typia";

export interface PageableQueryInput {
  current?: number;
  pageSize?: number & tags.Maximum<50>;
}

export interface IdOnly {
  id: string;
}
export interface IdsOnly {
  ids: string[];
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
}
