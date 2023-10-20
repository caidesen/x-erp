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
  details: {
    product: IdOnly;
    quantity: string;
    price: string;
  }[];
}

export interface UpdateSalesOrderInput extends CreateSalesOrderInput {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesOrderDetailVO extends SalesOrderVO {
  details: (SaleOrderItem & { id: string })[];
}
