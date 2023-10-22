import {
  ActionType,
  PageContainer,
  ProTable,
} from "@ant-design/pro-components";
import { api, API } from "@/api";
import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { OrderStatusName } from "@/shared/constant/order-status";
import { SalesOrderActionMenu } from "@/views/crm/sales-order/helper";

export function Component() {
  const actionRef = React.useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<API.SalesOrderVO>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        request={async (data) => {
          const { list, total } = await api.crm.salesOrder.list(data);
          return { data: list, total, success: true };
        }}
        columns={[
          { dataIndex: ["customer", "shortName"], title: "客户" },
          { dataIndex: ["salesperson", "nickname"], title: "业务员" },
          { dataIndex: "amount", title: "金额", valueType: "money" },
          { dataIndex: "status", title: "状态", valueEnum: OrderStatusName },
          { dataIndex: "remarks", title: "备注", valueType: "textarea" },
          {
            title: "操作",
            valueType: "option",
            render: (dom, entity) => [
              <Link to={`/crm/sales-order/detail/${entity.id}`} key="detail">
                详单
              </Link>,
              <SalesOrderActionMenu
                key="menu"
                item={entity}
                reload={() => actionRef.current?.reload()}
              >
                <a>操作</a>
              </SalesOrderActionMenu>,
            ],
          },
        ]}
        toolBarRender={() => [
          <Link key="create" to="/crm/sales-order/create">
            <Button type="primary">新建</Button>
          </Link>,
        ]}
      ></ProTable>
    </PageContainer>
  );
}
