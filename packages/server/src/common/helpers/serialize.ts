import { serialize, SerializeOptions } from "@mikro-orm/core";
import { PaginationResult } from "@/common/dto";

export function Serializer<T extends object, P extends string>(
  entity: T | T[],
  options?: SerializeOptions<T, P>
) {
  function toVO<VO>() {
    return serialize(entity as T, options) as unknown as VO;
  }

  function toPaginationResult<VO>(total: number): PaginationResult<VO> {
    return {
      list: serialize(entity as T[], options) as unknown as VO[],
      total,
    };
  }

  return {
    toVO,
    toPaginationResult,
  };
}
