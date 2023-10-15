import type { RefSelectProps } from "antd";
import { Form, Select } from "antd";
import React, { useState } from "react";
import { ModalForm, ProTable } from "@ant-design/pro-components";
import { api, API } from "@/api";

type ProductValue = Pick<API.ProductVO, "id" | "name" | "baseUnit">;

export interface ProductSelectorProps {
  className?: string;
  value?: ProductValue;
  onChange?: (val: ProductValue) => void;
  disableIds?: string | string[];
  onSelect?: (val: ProductValue) => void;
  disabled?: boolean;
}

interface UnitTableProps {
  value?: ProductValue;
  onChange?: (val: ProductValue) => void;
  disableIds?: string | string[];
}

export function UnitTable(props: UnitTableProps) {
  return (
    <ProTable<API.ProductVO>
      rowKey="id"
      request={async (data) => {
        const { list, total } = await api.wms.product.list(data);
        return {
          success: true,
          total,
          data: list,
        };
      }}
      rowSelection={{
        type: "radio",
        selectedRowKeys: props.value ? [props.value.id] : [],
        onChange: (val, selectedRows) => {
          props.onChange?.(selectedRows[0]);
        },
      }}
      pagination={false}
      size="small"
      columns={[
        {
          title: "商品名称",
          dataIndex: "name",
        },
        {
          title: "备注",
          dataIndex: "remarks",
          search: false,
        },
      ]}
    ></ProTable>
  );
}

export function ProductSelector(props: ProductSelectorProps) {
  const className = props.className ?? "";
  const [visible, setVisible] = useState(false);
  const selectRef = React.useRef<RefSelectProps>(null);
  return (
    <>
      <Select
        ref={selectRef}
        value={props.value?.id}
        className={`${className}`}
        popupClassName="hidden"
        disabled={props.disabled}
        options={[{ value: props.value?.id, label: props.value?.name }]}
        onFocus={() => {
          setVisible(true);
          selectRef.current?.blur();
        }}
      />
      <ModalForm<{ val: ProductValue }>
        open={visible}
        title="选择商品"
        onOpenChange={setVisible}
        width={600}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          unitId: props.value,
        }}
        onFinish={async (values) => {
          props.onChange?.(values.val);
          props.onSelect?.(values.val);
          setVisible(false);
        }}
      >
        <Form.Item name="val" noStyle>
          <UnitTable />
        </Form.Item>
      </ModalForm>
    </>
  );
}
