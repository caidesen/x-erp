import { PageableQueryInput } from "@/common/dto";
import { ProductVO } from "@/modules/wms/dto/product.dto";
import { SimpleUserVO } from "@/modules/system/auth/dto/user.dto";

export interface CreateBeginningStockInput {
  product: {
    id: string;
  };
  warehouse: {
    id: string;
  };
  quantity: string;
}

export interface UpdateBeginningStockInput {
  id: string;
  quantity: string;
}

export interface QueryBeginningStockInput extends PageableQueryInput {
  product?: {
    name: string;
  };
  warehouse?: {
    name: string;
  };
}

export interface BeginningStockVO {
  id: string;
  product: ProductVO;
  warehouse: {
    id: string;
    name: string;
  };
  quantity: string;
  creator: SimpleUserVO;
  updater: SimpleUserVO;
  updatedAt: Date;
  createdAt: Date;
}
