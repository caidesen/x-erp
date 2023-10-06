import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Dropdown, message, Space } from "antd";
import React, { useState } from "react";
import _ from "lodash";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API, api } from "@/api";

const rules = {
  nickname: [
    { required: true, message: "请输入账号昵称" },
    { max: 20, message: "账号昵称最长20个字符" },
  ],
  username: [
    { required: true, message: "请输入登陆账号名" },
    { max: 20, message: "登陆账号名最长20个字符" },
  ],
};

function FormItems() {
  return (
    <>
      <ProFormText
        width="md"
        name="nickname"
        label="账号昵称"
        placeholder="请输入账号昵称"
        rules={rules.nickname}
      />
      <ProFormText
        width="md"
        name="username"
        label="登陆账号名"
        placeholder="请输入登陆账号名"
        rules={rules.username}
      />
    </>
  );
}

export function Component() {
  const { mutateAsync: createUser } = useMutation({
    mutationFn: api.system.auth.user.create,
    onSuccess: () => {
      return actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: updateUser } = useMutation({
    mutationFn: api.system.auth.user.update,
    onSuccess() {
      message.success("修改成功");
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: deleteUsers } = useMutation({
    mutationFn: api.system.auth.user.batchRemove,
    onSuccess() {
      message.success("删除成功");
      actionRef.current?.reload(true);
    },
  });
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const actionRef = React.useRef<ActionType>();
  const { data: roleList } = useQuery({
    queryKey: [api.system.auth.role.all.cacheKey],
    queryFn: () => api.system.auth.role.all(),
  });
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1000 }}
        editable={{
          type: "multiple",
          onSave: async (rowKey, data, row) => {
            const params = _.pick(data, ["id", "nickname", "roles"]);
            await updateUser(params);
          },
          onDelete: async (rowKey, data) => {
            await deleteUsers({ ids: [data.id] });
          },
        }}
        columns={[
          {
            dataIndex: "nickname",
            title: "昵称",
            width: 200,
            fixed: "left",
          },
          {
            dataIndex: ["account", "username"],
            title: "用户名",
            search: false,
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
            dataIndex: "roles",
            title: "角色",
            width: 200,
            valueType: "select",
            search: false,
            fieldProps: {
              mode: "multiple",
              options: roleList?.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            },
          },
          // {
          //   dataIndex: "createdAt",
          //   title: "创建时间",
          //   valueType: "dateTime",
          //   width: 180,
          //   editable: false,
          //   search: false,
          // },
          {
            title: "操作",
            valueType: "option",
            width: 140,
            fixed: "right",
            render: (_, record, index, action) => [
              <a
                key="editable"
                onClick={() => action?.startEditable?.(record.id)}
              >
                编辑
              </a>,
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
          <ModalForm<API.CreateUserInput>
            key="create"
            trigger={<Button type="primary">新建</Button>}
            title="新建账号"
            autoFocusFirstInput
            width="400px"
            modalProps={{ destroyOnClose: true }}
            initialValues={{}}
            onFinish={async (values) => {
              await createUser(values);
              return true;
            }}
          >
            <FormItems />
            <ProFormSelect
              width="md"
              name="roles"
              label="角色"
              mode="multiple"
              options={roleList?.map((it) => ({
                label: it.name,
                value: it.id,
              }))}
            />
          </ModalForm>,
        ]}
        request={async () => {
          const data = await api.system.auth.user.all();
          return {
            data: data.map((it) => ({
              ...it,
              roles: it.roles.map((it) => it.id),
            })),
            total: data.length,
            success: true,
          };
        }}
      ></ProTable>
    </PageContainer>
  );
}
