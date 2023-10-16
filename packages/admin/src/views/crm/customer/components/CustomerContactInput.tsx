import { API } from "@/api";
import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import _ from "lodash";

export interface CustomerContactInputProps {
  value?: API.CustomerContactInfoVo[];

  onChange?(val: readonly API.CustomerContactInfoVo[]): void;
}

export function CustomerContactInput(props: CustomerContactInputProps) {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const columns = [
    {
      dataIndex: "name",
      title: "联系人姓名",
    },
    {
      dataIndex: "phone",
      title: "手机号",
    },
    {
      dataIndex: "address",
      title: "地址",
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
  ] as ProColumns<API.CustomerContactInfoVo>[];
  return (
    <EditableProTable<API.CustomerContactInfoVo>
      rowKey="id"
      cardProps={{ bodyStyle: { padding: 0 } }}
      maxLength={5}
      recordCreatorProps={{
        record: () => ({
          id: _.uniqueId("new_"),
          name: "",
          phone: "",
          address: "",
        }),
      }}
      editable={{
        editableKeys,
        onChange: setEditableRowKeys,
      }}
      controlled
      columns={columns}
      {...props}
    ></EditableProTable>
  );
}
