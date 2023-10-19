import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { api } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import { Card, Table } from "antd";
import { OrderStatusName } from "@/shared/constant/order-status";
import { useMemo } from "react";
import { toBig } from "@/shared";

export function Component() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = api.crm.salesOrder.detail.useQuery(
    { id: id! },
    {
      enabled: !_.isNil(id),
    }
  );
  const extra = useMemo(() => {
    if (!data) return "";
  }, [data]);
  const navigate = useNavigate();
  return (
    <PageContainer onBack={() => navigate(-1)}>
      <Card>
        <ProDescriptions
          loading={isLoading}
          dataSource={data}
          column={3}
          extra={extra}
          columns={[
            { dataIndex: "id", title: "编号" },
            { dataIndex: "status", title: "状态", valueEnum: OrderStatusName },
            { dataIndex: ["customer", "shortName"], title: "客户" },
            { dataIndex: ["salesperson", "nickname"], title: "业务员" },
            { dataIndex: "amount", title: "金额", valueType: "money" },
            { dataIndex: "remarks", title: "备注", span: 3 },
          ]}
        ></ProDescriptions>
        <ProTable
          toolBarRender={false}
          search={false}
          dataSource={data?.details}
          bordered
          pagination={false}
          summary={() => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={1}>
                  合计
                </Table.Summary.Cell>
                <Table.Summary.Cell index={0} colSpan={4} />
                <Table.Summary.Cell index={1} colSpan={1}>
                  ¥{toBig(data?.amount, "0").toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
          columns={[
            { title: "序号", dataIndex: "index", valueType: "index" },
            { dataIndex: ["product", "name"], title: "商品名称" },
            { dataIndex: ["product", "baseUnit", "name"], title: "商品名称" },
            {
              dataIndex: "quantity",
              title: "数量",
            },
            {
              dataIndex: "price",
              title: "单价",
              valueType: "money",
            },
            {
              dataIndex: "amount",
              title: "金额",
              valueType: "money",
            },
          ]}
        ></ProTable>
      </Card>
    </PageContainer>
  );
}
