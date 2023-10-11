import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, message, Modal, Space } from "antd";
import React, { useState } from "react";
import { API, api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import EditOutlined from "@ant-design/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

const decimalsPreview = (num: number) => {
  if (num === 0) return 0;
  if (num > 8) return Number(0).toFixed(8);
  return Number(0).toFixed(num);
};

function FormItems() {
  return (
    <>
      <ProFormText
        width="md"
        name="name"
        label="单位名称"
        placeholder="请输入单位名称"
        rules={[
          { required: true, message: "请输入单位名称" },
          { max: 4, message: "最多4个字符" },
        ]}
      />
      <ProFormText
        width="md"
        name="abbreviation"
        label="单位缩写"
        placeholder="请输入单位缩写"
        rules={[{ max: 4, message: "最多4个字符" }]}
      />
      <ProFormGroup>
        <ProFormDependency name={["decimals"]}>
          {(x) => (
            <ProFormDigit
              width="lg"
              name="decimals"
              label="精度（最大小数位）"
              placeholder="请输入精度"
              rules={[{ type: "number", max: 8, message: "最大只支持8位小数" }]}
              fieldProps={{
                precision: 0,
                addonAfter: (
                  <div className="w-48">{`小数位预览: ${decimalsPreview(
                    x.decimals
                  )}`}</div>
                ),
              }}
            />
          )}
        </ProFormDependency>
      </ProFormGroup>
    </>
  );
}

export function Component() {
  const actionRef = React.useRef<ActionType>();
  const { mutateAsync: doCreate } = useMutation({
    mutationFn: api.system.config.measure.createMeasurementUnit,
    onSuccess: () => {
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: doUpdate } = useMutation({
    mutationFn: api.system.config.measure.updateMeasurementUnit,
    onSuccess() {
      message.success("修改成功");
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: doRemove } = useMutation({
    mutationFn: api.system.config.measure.batchRemoveMeasurementUnit,
    onSuccess() {
      message.success("删除成功");
      actionRef.current?.reload(true);
    },
  });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  return (
    <PageContainer>
      <ProTable<API.MeasurementUnitVO>
        search={false}
        actionRef={actionRef}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => {
            setSelectedKeys(keys as string[]);
          },
        }}
        columns={[
          {
            title: "名称",
            dataIndex: "name",
            width: 200,
          },
          {
            title: "缩写",
            dataIndex: "abbreviation",
            width: 200,
          },
          {
            title: "精度（最大小数位)",
            dataIndex: "decimals",
            width: 200,
          },
          {
            title: "操作",
            valueType: "option",
            width: 100,
            render: (_, record, index, action) => [
              <ModalForm
                key="edit"
                initialValues={{
                  ...record,
                }}
                trigger={
                  <a>
                    <EditOutlined />
                  </a>
                }
                title="编辑"
                onFinish={async (data) => {
                  await doUpdate({
                    id: record.id,
                    ...data,
                  });
                  return true;
                }}
              >
                {FormItems()}
              </ModalForm>,
              <a
                key="delete"
                onClick={() =>
                  Modal.confirm({
                    title: `确认删除选中的单位？`,
                    content: "删除后不可恢复",
                    onOk: async () => {
                      await doRemove({
                        ids: [record.id],
                      });
                      action?.reload();
                    },
                  })
                }
              >
                <DeleteOutlined />
              </a>,
            ],
          },
        ]}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space>
            <a
              onClick={() => {
                Modal.confirm({
                  title: `确认删除选中的单位？`,
                  content: "删除后不可恢复",
                  onOk: async () => {
                    await doRemove({ ids: selectedKeys });
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
          <ModalForm<API.CreateMeasurementUnitInput>
            trigger={<Button type="primary">新建</Button>}
            title="创建单位"
            key="create"
            width="600px"
            initialValues={{
              name: "",
              decimals: 0,
              abbreviation: "",
            }}
            onFinish={async (values) => {
              await doCreate(values);
              return true;
            }}
          >
            <FormItems />
          </ModalForm>,
        ]}
        request={async () => {
          const list = await api.system.config.measure.getAllMeasurementUnit();
          return {
            data: list,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
}
