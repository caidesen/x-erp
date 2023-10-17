import {
  ActionType,
  PageContainer,
  ProTable,
} from "@ant-design/pro-components";
import { api } from "@/api";
import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

export function Component() {
  const actionRef = React.useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        request={async (data) => {
          const { list, total } = await api.crm.salesOrder.list(data);
          return { data: list, total, success: true };
        }}
        toolBarRender={() => [
          <Link key="create" to="/crm/sales-order/create">
            <Button type="primary">新建</Button>
          </Link>,
        ]}
      ></ProTable>
    </PageContainer>
  );
}
