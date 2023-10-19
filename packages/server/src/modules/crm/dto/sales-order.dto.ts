import { IdOnly, PageableQueryInput } from "@/common/dto";
import { CustomerVO } from "@/modules/crm/dto/customer.dto";
import { OrderStatusEnum } from "@/modules/wms/constant/order-status.enum";
import { SimpleUserVO } from "@/modules/system/auth/dto/user.dto";
import { ProductVO } from "@/modules/wms/dto/product.dto";

export interface SaleOrderItem {
  id: string;
  product: ProductVO;
  quantity: string;
  price: string;
  amount: string;
}

export interface CreateSalesOrderInput {
  customer: IdOnly;
  salesperson: IdOnly;
  remarks: string;
  details: (Omit<SaleOrderItem, "id" | "product"> & {
    product: { id: string };
  })[];
}

export interface UpdateSalesOrderInput extends Partial<CreateSalesOrderInput> {
  id: string;
}

export interface QuerySalesOrderInput extends PageableQueryInput {}

export interface SalesOrderVO {
  id: string;
  customer: Omit<CustomerVO, "contacts" | "personInChargeUser">;
  status: OrderStatusEnum;
  salesperson: SimpleUserVO;
  remarks: string;
  amount: string;
}

export interface SalesOrderDetailVO extends SalesOrderVO {
  details: (SaleOrderItem & { id: string })[];
}
