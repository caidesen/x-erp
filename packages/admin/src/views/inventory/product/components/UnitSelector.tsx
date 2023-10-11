import type { RefSelectProps } from "antd";
import { Form, Select, Table } from "antd";
import React, { useState } from "react";
import { ModalForm } from "@ant-design/pro-components";
import { api } from "@/api";

export interface UnitSelectorProps {
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
  disableIds?: string | string[];
  onSelect?: (val: string) => void;
}

interface UnitTableProps {
  value?: string;
  onChange?: (val: string) => void;
  disableIds?: string | string[];
}

export function UnitTable(props: UnitTableProps) {
  const { data, isFetching } =
    api.system.config.measure.getAllMeasurementUnit.useQuery();
  return (
    <Table
      dataSource={data}
      rowKey="id"
      loading={isFetching}
      rowSelection={{
        type: "radio",
        selectedRowKeys: props.value ? [props.value] : [],
        onChange: (val) => {
          props.onChange?.(val[0] as string);
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
          title: "缩写",
          dataIndex: "abbreviation",
        },
        {
          title: "精度",
          dataIndex: "decimals",
        },
      ]}
    ></Table>
  );
}

export function UnitSelector(props: UnitSelectorProps) {
  const className = props.className ?? "";
  const [visible, setVisible] = useState(false);
  const selectRef = React.useRef<RefSelectProps>(null);
  const { data, isLoading } =
    api.system.config.measure.getAllMeasurementUnit.useQuery();
  return (
    <>
      <Select
        ref={selectRef}
        value={props.value}
        className={`${className}`}
        popupClassName="hidden"
        loading={isLoading}
        options={data?.map((it) => ({
          value: it.id,
          label: it.name,
        }))}
        onFocus={() => {
          setVisible(true);
          selectRef.current?.blur();
        }}
      />
      <ModalForm<{ unitId: string }>
        open={visible}
        title="选择计量单位"
        onOpenChange={setVisible}
        width={400}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          unitId: props.value,
        }}
        onFinish={async (values) => {
          props.onChange?.(values.unitId);
          props.onSelect?.(values.unitId);
          setVisible(false);
        }}
      >
        <Form.Item name="unitId" noStyle>
          <UnitTable />
        </Form.Item>
      </ModalForm>
    </>
  );
}
