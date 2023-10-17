import { IdOnly, PageableQueryInput } from "@/common/dto";
import { CustomerVO } from "@/modules/crm/dto/customer.dto";
import { OrderStatusEnum } from "@/modules/wms/constant/order-status.enum";
import { SimpleUserVO } from "@/modules/system/auth/dto/user.dto";

export interface SaleOrderItem {
  id?: string;
  product: IdOnly;
  quantity: string;
  price: string;
}

export interface CreateSalesOrderInput {
  customer: IdOnly;
  salesperson: IdOnly;
  remarks: string;
  details: SaleOrderItem[];
}

export interface UpdateSalesOrderInput extends Partial<CreateSalesOrderInput> {
  id: string;
}

export interface QuerySalesOrderInput extends PageableQueryInput {}

export interface SalesOrderVO {
  customer: CustomerVO;
  status: OrderStatusEnum;
  salesperson: SimpleUserVO;
  remarks: string;
  amount: string;
  details: (SaleOrderItem & { id: string })[];
}
