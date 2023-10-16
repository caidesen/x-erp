import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormGroup,
  ProFormItem,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Dropdown, message, Modal, Popover, Space, Tag } from "antd";
import React, { useState } from "react";
import { ProFormUserSelector } from "@/shared/components/UserSelector";
import { api, API } from "@/api";
import { CustomerContactInput } from "@/views/crm/customer/components/CustomerContactInput";
import _ from "lodash";

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
        rules={rules.property}
      />
      <ProFormText
        width="md"
        name="region"
        label="所属区域"
        placeholder="请输入所属区域"
        rules={rules.region}
      />
      <ProFormItem name="contacts" label="联系人信息">
        <CustomerContactInput />
      </ProFormItem>
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
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const actionRef = React.useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<API.CustomerVO>
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
            dataIndex: ["personInChargeUser", "nickname"],
            title: "客户负责人",
            width: 200,
          },
          {
            title: "联系人",
            width: 200,
            render: (node, record) => (
              <div className="flex flex-wrap gap-1">
                {record.contacts?.map((it) => (
                  <Popover
                    content={
                      <div>
                        <div>联系人: {it.name}</div>
                        <div>联系方式: {it.phone}</div>
                        <div>地址: {it.address}</div>
                      </div>
                    }
                  >
                    <Tag className="cursor-pointer mr-0">{it.name}</Tag>
                  </Popover>
                ))}
              </div>
            ),
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
            dataIndex: "remarks",
            title: "备注",
            width: 200,
            search: false,
          },
          {
            title: "操作",
            valueType: "option",
            width: 140,
            fixed: "right",
            render: (node, record, index, action) => [
              <ModalForm<API.CreateCustomerInput>
                key="update"
                trigger={<a>编辑</a>}
                title="编辑客户"
                autoFocusFirstInput
                initialValues={{
                  ...record,
                  personInChargeUserId: record.personInChargeUser?.id,
                }}
                modalProps={{ destroyOnClose: true }}
                onFinish={async (values) => {
                  await api.crm.customer.update({
                    id: record.id,
                    ...values,
                    contacts: values.contacts.map((it) => {
                      if (it.id?.includes("new")) return _.omit(it, "id");
                      return it;
                    }),
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
            setSelectedKeys(keys as string[]);
          },
        }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "delete",
                      label: "删除",
                      onClick: () => {
                        Modal.confirm({
                          title: `确认删除选中的客户？`,
                          content: "删除后不可恢复",
                          async onOk() {
                            await api.crm.customer.batchRemove({
                              ids: selectedKeys,
                            });
                            message.success("删除成功");
                            actionRef.current?.reload();
                          },
                        });
                      },
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
          // <CustomerImportModal
          //   key="import"
          //   onImportSuccess={() => actionRef.current?.reload()}
          // />,
          // <Button
          //   key="export"
          // >
          //   导出
          // </Button>,
          <ModalForm<API.CreateCustomerInput>
            key="create"
            trigger={<Button type="primary">新建</Button>}
            title="新建客户"
            autoFocusFirstInput
            initialValues={{
              fullName: "",
              shortName: "",
              property: "",
              region: "",
              contacts: [],
              personInChargeUserId: "",
              remarks: "",
            }}
            modalProps={{ destroyOnClose: true }}
            onFinish={async (values) => {
              await api.crm.customer.create({
                ...values,
                contacts: values.contacts.map((it) => _.omit(it, "id")),
              });
              message.success("创建成功");
              actionRef.current?.reload(true);
              return true;
            }}
          >
            <FormItems />
          </ModalForm>,
        ]}
        request={async (params) => {
          const { list, total } = await api.crm.customer.list(params);
          // const { data, total } = await utils.crm.customer.list.query(params);
          return {
            data: list,
            total,
            success: true,
          };
        }}
      ></ProTable>
    </PageContainer>
  );
}
