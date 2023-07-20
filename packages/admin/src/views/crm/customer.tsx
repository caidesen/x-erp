import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { trpc } from "@/shared";
import { Button, Dropdown, message, Space } from "antd";
import { RpcInput, RpcOutput } from "@trpc-admin/server";
import React, { useState } from "react";
import * as _ from "lodash";
import { CustomerImportModal } from "./components/CustomerImportModal";
import { ProFormUserSelector, useUserOptions } from "@/shared/components/UserSelector";

const rules = {
  fullName: [
    { required: true, message: "请输入客户全称" },
    { max: 20, message: "客户全称最大长度为20" },
  ],
  shortName: [{ max: 20, message: "客户简称最大长度为20" }],
  property: [{ max: 20, message: "客户属性最大长度为20" }],
  region: [{ max: 20, message: "所属区域最大长度为20" }],
  address: [{ max: 200, message: "地址最大长度为200" }],
  contactInfo: [{ max: 20, message: "联系方式最大长度为20" }],
  contactName: [{ max: 20, message: "联系人最大长度为20" }],
  remark: [{ max: 200, message: "备注最大长度为200" }],
};
function FormItems() {
  return (
    <>
      <ProFormGroup>
        <ProFormText
          width="md"
          name="fullName"
          label="客户全称"
          placeholder="请输入客户全称"
          rules={rules.fullName}
        />
        <ProFormText
          width="md"
          name="shortName"
          label="客户简称"
          placeholder="请输入客户简称"
          rules={rules.shortName}
        />
      </ProFormGroup>
      <ProFormUserSelector
        width="md"
        name="personInChargeUserId"
        label="客户负责人"
        placeholder="请选择客户负责人"
      />
      <ProFormText
        width="md"
        name="property"
        label="客户属性"
        placeholder="请输入客户属性"
        rules={rules.shortName}
      />
      <ProFormText
        width="md"
        name="region"
        label="所属区域"
        placeholder="请输入所属区域"
        rules={rules.region}
      />
      <ProFormGroup>
        <ProFormText
          width="md"
          name="contactName"
          label="联系人"
          placeholder="请输入联系人"
          rules={rules.contactName}
        />
        <ProFormText
          width="md"
          name="contactInfo"
          label="联系方式"
          placeholder="请输入联系方式"
          rules={rules.contactInfo}
        />
      </ProFormGroup>
      <ProFormText
        width="md"
        name="address"
        label="地址"
        placeholder="请输入地址"
        rules={rules.address}
      />
      <ProFormTextArea
        width="lg"
        name="remarks"
        label="备注"
        placeholder="请输入备注"
        rules={rules.remark}
      />
    </>
  );
}

export function Component() {
  const utils = trpc.useContext().client;
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const actionRef = React.useRef<ActionType>();
  const userOptions = useUserOptions();
  return (
    <PageContainer>
      <ProTable<RpcOutput["crm"]["customer"]["list"]["data"][0]>
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1000 }}
        columns={[
          {
            dataIndex: "shortName",
            title: "客户简称",
            width: 200,
            fixed: "left",
          },
          {
            dataIndex: "fullName",
            title: "客户全称",
            width: 200,
          },
          {
            dataIndex: ["personInChargeUser","nickname"],
            title: "客户负责人",
            width: 200,
          },
          {
            dataIndex: "property",
            title: "客户属性",
            width: 200,
          },
          {
            dataIndex: "region",
            title: "所属区域",
            width: 200,
          },
          {
            dataIndex: "contactName",
            title: "联系人",
            width: 200,
          },
          {
            dataIndex: "contactInfo",
            title: "联系方式",
            width: 200,
          },
          {
            dataIndex: "address",
            title: "地址",
            width: 200,
          },
          {
            dataIndex: "remarks",
            title: "备注",
            width: 200,
          },
          {
            dataIndex: "blocked",
            title: "状态",
            hideInTable: true,
            valueType: "select",
            initialValue: false,
            search: false,
            valueEnum: {
              true: { text: "禁用", status: "Error" },
              false: { text: "正常", status: "Success" },
            },
          },
          {
            dataIndex: "createdAt",
            title: "创建时间",
            valueType: "dateTime",
            width: 180,
            editable: false,
            search: false,
          },
          {
            title: "操作",
            valueType: "option",
            width: 140,
            fixed: "right",
            render: (_, record, index, action) => [
              <ModalForm<RpcInput["crm"]["customer"]["create"]>
                key="update"
                trigger={<a>编辑</a>}
                title="编辑客户"
                autoFocusFirstInput
                initialValues={{
                  ...record,
                }}
                modalProps={{ destroyOnClose: true }}
                onFinish={async (values) => {
                  await utils.crm.customer.update.mutate({
                    ...values,
                    id: record.id,
                  });
                  message.success("更新成功");
                  actionRef.current?.reload();
                  return true;
                }}
              >
                <FormItems />
              </ModalForm>,
            ],
          },
        ]}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => {
            setSelectedKeys(keys as number[]);
          },
        }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space>
              <Dropdown
                menu={{
                  items: [
                    { key: "delete", label: "删除", onClick: () => {} },
                    { key: "setRole", label: "授权", onClick: () => {} },
                    {
                      key: "block",
                      label: "禁用",
                      onClick: () => {},
                    },
                  ],
                }}
              >
                <a>批量操作</a>
              </Dropdown>
              <a onClick={onCleanSelected}>取消选择</a>
            </Space>
          );
        }}
        toolBarRender={() => [
          <CustomerImportModal
            key="import"
            onImportSuccess={() => actionRef.current?.reload()}
          />,
          <Button
            key="export"
            onClick={() =>
              utils.crm.customer.exportExcel.mutate({}).then((url) => {
                const a = document.createElement("a");
                a.href = url;
                a.download = "客户信息.xlsx";
                a.click();
              })
            }
          >
            导出
          </Button>,
          <ModalForm<RpcInput["crm"]["customer"]["create"]>
            key="create"
            trigger={<Button type="primary">新建</Button>}
            title="新建客户"
            autoFocusFirstInput
            initialValues={{
              fullName: "",
              shortName: "",
              property: "",
              region: "",
              contactInfo: "",
              contactName: "",
              personInChargeUserId: "",
              address: "",
              remarks: "",
            }}
            modalProps={{ destroyOnClose: true }}
            onFinish={async (values) => {
              await utils.crm.customer.create.mutate(values);
              message.success("创建成功");
              actionRef.current?.reload(true);
              return true;
            }}
          >
            <FormItems />
          </ModalForm>,
        ]}
        request={async (params) => {
          const { data, total } = await utils.crm.customer.list.query(params);
          return {
            data,
            total,
            success: true,
          };
        }}
      ></ProTable>
    </PageContainer>
  );
}
