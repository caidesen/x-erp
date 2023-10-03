import { PageableQueryInput } from "../dto";

export function getPageableParams(input: PageableQueryInput) {
  return {
    limit: input.pageSize,
    offset: ((input.current || 1) - 1) * (input.pageSize || 10),
  };
}
