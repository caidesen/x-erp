import type { RefSelectProps } from "antd";
import { Form, Select } from "antd";
import React, { useState } from "react";
import { ModalForm, ProTable } from "@ant-design/pro-components";
import { api, API } from "@/api";

type WarehouseValue = Pick<API.WarehouseVO, "id" | "name">;

export interface WarehouseSelectorProps {
  className?: string;
  value?: WarehouseValue;
  onChange?: (val: WarehouseValue) => void;
  disableIds?: string | string[];
  onSelect?: (val: WarehouseValue) => void;
}

interface WarehouseTableProps {
  value?: WarehouseValue;
  onChange?: (val: WarehouseValue) => void;
  disableIds?: string | string[];
}

export function WarehouseTable(props: WarehouseTableProps) {
  return (
    <ProTable<API.WarehouseVO>
      rowKey="id"
      request={async () => {
        const list = await api.wms.warehouse.all();
        return {
          success: true,
          total: list.length,
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
          title: "名称",
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

export function WarehouseSelector(props: WarehouseSelectorProps) {
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
        options={[{ value: props.value?.id, label: props.value?.name }]}
        onFocus={() => {
          setVisible(true);
          selectRef.current?.blur();
        }}
      />
      <ModalForm<{ val: WarehouseValue }>
        open={visible}
        title="选择仓库"
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
          <WarehouseTable />
        </Form.Item>
      </ModalForm>
    </>
  );
}
