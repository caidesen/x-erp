import {
  ActionType,
  PageContainer,
  ProTable,
} from "@ant-design/pro-components";
import { api } from "@/api";
import React from "react";
import { Button, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { OrderStatusName } from "@/shared/constant/order-status";

export function Component() {
  const actionRef = React.useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable
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
            valueType: "",
            render: (dom, entity) => [
              <Link to={`/crm/sales-order/${entity.id}`} key="detail">
                详单
              </Link>,
              <Dropdown
                key="more"
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: "编辑",
                    },
                    {
                      key: "submit",
                      label: "提交",
                    },
                    {
                      key: "approve",
                      label: "审核",
                    },
                    {
                      key: "reject",
                      label: "驳回",
                    },
                    {
                      key: "cancel",
                      label: "取消",
                    },
                  ],
                }}
              >
                <a>操作</a>
              </Dropdown>,
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
