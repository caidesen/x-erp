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
import { Card, Form, Input } from "antd";
import { CustomerSelector } from "@/views/crm/components/CustomerSelector";
import { ProFormUserSelector } from "@/shared/components/UserSelector";
import React, { useRef, useState } from "react";
import { ProductSelector } from "@/views/wms/components/ProductSelector";
import _ from "lodash";
import { toBig } from "@/shared/lib/math";

type TableRow = API.SaleOrderItem & {
  amount: string;
  product: Partial<API.ProductVO>;
};
type FormDataType = API.CreateSalesOrderInput;

export function Component() {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const editableFormRef = useRef<EditableFormInstance<TableRow>>();
  const genRowValue = (record: TableRow) => {
    if (!record.product.baseUnit) return;
    const values = [
      toBig(record.quantity)!,
      toBig(record.price)!,
      toBig(record.amount)!,
    ] as const;
    if (_.reject(values, _.isNil).length !== 2) return;
    let [quantity, price, amount] = values;
    quantity = quantity?.round(record.product.baseUnit.decimals);
    price = price?.round(2);
    amount = amount?.round(2);
    if (!amount) {
      amount = quantity.times(price).round(2);
    } else if (!price) {
      price = amount.div(quantity).round(2);
    } else {
      quantity = amount.div(price).round(2);
    }
    return {
      amount,
      price,
      quantity,
    };
  };
  return (
    <PageContainer>
      <Card>
        <ProForm<FormDataType>
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
              <EditableProTable<TableRow>
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
                    quantity: "",
                    amount: "",
                    price: "",
                  }),
                }}
                columns={[
                  {
                    dataIndex: "product",
                    title: "商品",
                    renderFormItem: (dom, { record }) => {
                      return <ProductSelector />;
                    },
                    renderText: (text) => text.name,
                  },
                  {
                    dataIndex: "quantity",
                    title: "数量",
                    renderFormItem: ({ fieldProps }, { record, recordKey }) => {
                      return (
                        <Input
                          {...fieldProps}
                          suffix={record?.product.baseUnit?.name}
                          allowClear
                          onBlur={(e) => {
                            if (!record || !editableFormRef.current) return;
                            if (!e.target.value) return;
                            const update = (val: Partial<TableRow>) =>
                              editableFormRef.current?.setRowData?.(
                                record.id!,
                                val
                              );
                            const quantity = toBig(e.target.value, "0").round(
                              record.product.baseUnit?.decimals ?? 0
                            );
                            update({ quantity: quantity.toString() });
                            if (record.price) {
                              const amount = quantity
                                .times(toBig(record.price, "0"))
                                .round(2)
                                .toFixed(2);
                              update({
                                amount,
                              });
                            } else if (record.amount) {
                              const price = toBig(record.amount, "0")
                                .div(quantity)
                                .round(2);
                              const amount = price
                                .times(quantity)
                                .round(2)
                                .toFixed(2);
                              update({ price: price.toString(), amount });
                            }
                          }}
                        />
                      );
                    },
                    render: (dom, record) =>
                      record.quantity + record.product.baseUnit?.name,
                  },
                  {
                    dataIndex: "price",
                    title: "单价",
                    renderFormItem: ({ fieldProps }, { record }) => {
                      const unit = record?.product.baseUnit;
                      const suffix = unit
                        ? `元/${record.product.baseUnit?.name}`
                        : "元";
                      return (
                        <Input
                          {...fieldProps}
                          suffix={suffix}
                          allowClear
                          onBlur={(e) => {
                            if (!record || !editableFormRef.current) return;
                            if (!e.target.value) return;
                            const update = (val: Partial<TableRow>) =>
                              editableFormRef.current?.setRowData?.(
                                record.id!,
                                val
                              );
                            const price = toBig(e.target.value, "0").round(2);
                            update({ price: price.toFixed(2) });
                            if (record.quantity) {
                              const amount = price
                                .times(toBig(record.quantity, "0"))
                                .round(2)
                                .toFixed(2);
                              update({ amount });
                            } else if (record.amount) {
                              const quantity = toBig(record.amount, "0")
                                .div(price)
                                .round(record.product.baseUnit?.decimals ?? 0);
                              const amount = quantity.times(price).toFixed(2);
                              update({
                                amount,
                                quantity: quantity.toString(),
                              });
                            }
                          }}
                        />
                      );
                    },
                    render: (dom, record) => {
                      if (record.product.baseUnit) {
                        return `${record.price}元/${record.product.baseUnit?.name}`;
                      }
                      return `${record.price}元`;
                    },
                  },
                  {
                    dataIndex: "amount",
                    title: "金额",
                    renderFormItem: ({ fieldProps, dataIndex }, { record }) => {
                      return (
                        <Input
                          {...fieldProps}
                          disabled={!!record?.price && !!record?.quantity}
                          allowClear
                          suffix="元"
                          onBlur={(e) => {
                            if (!record || !editableFormRef.current) return;
                            if (!e.target.value) return;
                            const update = (val: Partial<TableRow>) =>
                              editableFormRef.current?.setRowData?.(
                                record.id!,
                                val
                              );
                            const amount = toBig(e.target.value, "0").round(2);
                            if (record.quantity) {
                              const quantity = toBig(record.quantity, "0");
                              const price = amount.div(quantity).round(2);
                              update({
                                price: price.toFixed(2),
                                amount: price
                                  .times(quantity)
                                  .round(2)
                                  .toFixed(2),
                              });
                            } else if (record.price) {
                              const price = toBig(record.price, "0");
                              const quantity = amount
                                .div(price)
                                .round(record.product.baseUnit?.decimals ?? 0);
                              update({
                                quantity: quantity.toString(),
                                amount: quantity.times(price).toFixed(2),
                              });
                            }
                          }}
                        />
                      );
                    },
                    render: (dom, record) => record.amount + "元",
                  },
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
