import { api, API } from "@/api";
import {
  EditableFormInstance,
  EditableProTable,
  FooterToolbar,
  PageContainer,
  ProForm,
  ProFormGroup,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Card, Form } from "antd";
import { CustomerSelector } from "@/views/crm/components/CustomerSelector";
import { ProFormUserSelector } from "@/shared/components/UserSelector";
import React, { useRef, useState } from "react";
import { ProductSelector } from "@/views/wms/components/ProductSelector";
import _ from "lodash";

export function Component() {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const editableFormRef = useRef<EditableFormInstance<API.SaleOrderItem>>();
  return (
    <PageContainer>
      <Card>
        <ProForm<API.CreateSalesOrderInput>
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          }}
          onFinish={async (values) => {
            await api.crm.salesOrder.create(values);
          }}
        >
          <ProFormGroup title="基础信息">
            <Form.Item name="customer" label="关联客户">
              <CustomerSelector className="pro-field-md" />
            </Form.Item>
            <ProFormUserSelector
              name={["salesperson", "id"]}
              label="业务员"
              width="md"
            />
            <ProFormTextArea width="md" name="remarks" label="备注" />
          </ProFormGroup>
          <ProFormGroup title="详单">
            <Form.Item name="details">
              <EditableProTable<API.SaleOrderItem>
                rowKey="id"
                editable={{
                  editableKeys,
                  onChange: setEditableRowKeys,
                }}
                editableFormRef={editableFormRef}
                controlled
                cardProps={{ bodyStyle: { padding: 0 } }}
                recordCreatorProps={{
                  record: () => ({
                    id: _.uniqueId("new_"),
                    product: {
                      id: "",
                    },
                    quantity: "0",
                    amount: "0",
                    price: "0",
                  }),
                }}
                columns={[
                  {
                    dataIndex: "product",
                    title: "商品",
                    renderFormItem: (dom, { record }) => {
                      return <ProductSelector />;
                    },
                  },
                  {
                    dataIndex: "quantity",
                    title: "数量",
                    fieldProps: (x, { entity }) => {
                      return {
                        onChange: (value) => {
                          console.log(value);
                        },
                      };
                    },
                  },
                  { dataIndex: "price", title: "单价" },
                  { dataIndex: "amount", title: "金额" },
                  {
                    title: "操作",
                    valueType: "option",
                    width: 140,
                    render: (dom, record, index, action) => [
                      <a
                        key="editable"
                        onClick={() => {
                          action?.startEditable?.(record.id!);
                        }}
                      >
                        编辑
                      </a>,
                    ],
                  },
                ]}
              />
            </Form.Item>
          </ProFormGroup>
        </ProForm>
      </Card>
    </PageContainer>
  );
}
