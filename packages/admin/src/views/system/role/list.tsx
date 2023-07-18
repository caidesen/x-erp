import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { trpc } from "@/shared";
import { RpcInput, RpcOutput } from "@trpc-admin/server";
import { Button, Form, message, Modal, Space } from "antd";
import React, { useState } from "react";
import { PermissionSelector } from "@/views/system/role/PermissionSelector";
import * as _ from "lodash";

type ListItem = RpcOutput["system"]["role"]["list"][0];
type CreateItem = RpcInput["system"]["role"]["createRole"];

const roleNameRules = [
  { required: true, message: "请输入角色名称" },
  {
    max: 20,
    message: "角色名称最长20个字符",
  },
];

function RoleFormItems() {
  return (
    <>
      <ProFormText
        width="md"
        name="name"
        label="角色名称"
        placeholder="请输入角色名称"
        rules={roleNameRules}
      />
      <ProFormText
        width="md"
        name="remark"
        label="角色备注"
        placeholder="请输入角色备注"
      />
      <Form.Item label="授权" name="permissions">
        <PermissionSelector />
      </Form.Item>
    </>
  );
}
export function Component() {
  const rpcClient = trpc.useContext().client;
  const actionRef = React.useRef<ActionType>();
  const { mutateAsync: createRole } = trpc.system.role.createRole.useMutation({
    onSuccess: () => {
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: updateRole } = trpc.system.role.updateRole.useMutation({
    onSuccess() {
      message.success("修改成功");
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: deleteRoles } = trpc.system.role.deleteRoles.useMutation(
    {
      onSuccess() {
        message.success("删除成功");
        actionRef.current?.reload(true);
      },
    }
  );
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  return (
    <PageContainer>
      <ProTable<ListItem>
        actionRef={actionRef}
        editable={{
          type: "multiple",
          onSave: async (rowKey, data, row) => {
            await updateRole(_.pick(data, ["id", "name", "remark"]));
          },
          onDelete: async (rowKey, data) => {
            await deleteRoles([data.id]);
          },
        }}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => {
            setSelectedKeys(keys as number[]);
          },
        }}
        columns={[
          {
            title: "名称",
            dataIndex: "name",
            width: 200,
            formItemProps: {
              rules: roleNameRules,
            },
          },
          { title: "备注", dataIndex: "remark", width: 200, search: false },
          {
            title: "操作",
            valueType: "option",
            width: 100,
            render: (_, record, index, action) => [
              <a
                key="editable"
                onClick={() => action?.startEditable?.(record.id)}
              >
                编辑
              </a>,
              <ModalForm
                key="setPermission"
                initialValues={{
                  permissions: record.permissions,
                }}
                trigger={<a>授权</a>}
                onFinish={async (data) => {
                  await updateRole({
                    id: record.id,
                    permissions: data.permissions,
                  });
                  return true;
                }}
              >
                <Form.Item label="授权" name="permissions">
                  <PermissionSelector />
                </Form.Item>
              </ModalForm>,
            ],
          },
        ]}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space>
            <a
              onClick={() => {
                Modal.confirm({
                  title: `确认删除选中的角色？`,
                  content: "删除后不可恢复",
                  onOk: async () => {
                    await deleteRoles(selectedKeys as [number]);
                    onCleanSelected();
                  },
                });
              }}
            >
              批量删除
            </a>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        toolBarRender={() => [
          <ModalForm<CreateItem>
            trigger={<Button type="primary">新建</Button>}
            title="创建角色"
            key="create"
            width="600px"
            initialValues={{
              name: "",
              permissions: [],
            }}
            onFinish={async (values) => {
              await createRole(values);
              return true;
            }}
          >
            <RoleFormItems />
          </ModalForm>,
        ]}
        request={async (data) => {
          const list = await rpcClient.system.role.list.query({
            name: data.name,
          });
          return {
            data: list,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
}
