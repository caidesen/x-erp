import type { RefSelectProps } from "antd";
import { Form, Select } from "antd";
import React, { useState } from "react";
import { ModalForm, ProTable } from "@ant-design/pro-components";
import { api, API } from "@/api";

type CustomerValue = Pick<API.CustomerVO, "id" | "shortName">;

export interface CustomerSelectorProps {
  className?: string;
  value?: CustomerValue;
  onChange?: (val: CustomerValue) => void;
  disableIds?: string | string[];
  onSelect?: (val: CustomerValue) => void;
  disabled?: boolean;
}

interface TableProps {
  value?: CustomerValue;
  onChange?: (val: CustomerValue) => void;
  disableIds?: string | string[];
}

function Table(props: TableProps) {
  return (
    <ProTable<API.CustomerVO>
      rowKey="id"
      request={async (data) => {
        const { list, total } = await api.crm.customer.list(data);
        return {
          success: true,
          total,
          data: list,
        };
      }}
      scroll={{ y: "calc(100vh - 600px)" }}
      rowSelection={{
        type: "radio",
        selectedRowKeys: props.value ? [props.value.id] : [],
        onChange: (val, selectedRows) => {
          props.onChange?.(selectedRows[0]);
        },
      }}
      size="small"
      columns={[
        {
          title: "简称",
          dataIndex: "shortName",
        },
        {
          title: "客户名称",
          dataIndex: "fullName",
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

export function CustomerSelector(props: CustomerSelectorProps) {
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
        options={[{ value: props.value?.id, label: props.value?.shortName }]}
        onFocus={() => {
          setVisible(true);
          selectRef.current?.blur();
        }}
      />
      <ModalForm<{ val: CustomerValue }>
        open={visible}
        title="选择客户"
        onOpenChange={setVisible}
        width={800}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          val: props.value,
        }}
        layout={"horizontal"}
        onFinish={async (values) => {
          props.onChange?.(values.val);
          props.onSelect?.(values.val);
          setVisible(false);
        }}
      >
        <Form.Item name="val" noStyle>
          <Table />
        </Form.Item>
      </ModalForm>
    </>
  );
}
