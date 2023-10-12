import {
  ActionType,
  EditableFormInstance,
  EditableProTable,
  ModalForm,
  PageContainer,
  ProFormDependency,
  ProFormGroup,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Form, Input, message, Modal, Space } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { API, api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import EditOutlined from "@ant-design/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { UnitSelector } from "@/views/wms/product/components/UnitSelector";
import _ from "lodash";

function FormItems() {
  const [editableKeys, setEditableKeys] = useState<string[]>([]);
  const { data } = api.system.config.measure.getAllMeasurementUnit.useQuery();
  const unitMap = useMemo(() => _.keyBy(data, "id"), [data]);
  const getUnitName = (unitId: any) => unitMap[unitId!]?.name ?? "";
  return (
    <>
      <ProFormText
        width="md"
        name="name"
        label="商品名称"
        placeholder="请输入商品名称"
        rules={[
          { required: true, message: "请输入商品名称" },
          { max: 20, message: "不能超过20个字" },
        ]}
      />
      <ProFormGroup>
        <Form.Item
          name={["baseUnit", "id"]}
          label="基础计量单位"
          tooltip="使用此单位进行各种运算，设置后无法修改"
          wrapperCol={{
            className: "pro-field-md",
          }}
          rules={[{ required: true, message: "请选择基础计量单位" }]}
        >
          <UnitSelector />
        </Form.Item>
        <ProFormSwitch
          name="multiUnitEnabled"
          label="启用辅助单位"
          tooltip="是否支持通过其他单位计算, 只能支持4个辅助单位"
        />
      </ProFormGroup>
      <ProFormDependency name={[["baseUnit", "id"], "multiUnitEnabled"]}>
        {({ baseUnit, multiUnitEnabled }) => {
          if (!multiUnitEnabled) {
            return null;
          }
          return (
            <Form.Item name="units" label="复合计量单位" noStyle>
              <EditableProTable
                rowKey="id"
                cardProps={{ bodyStyle: { padding: 0 } }}
                maxLength={5}
                recordCreatorProps={{
                  record: () => ({
                    id: _.uniqueId("new_"),
                    unitId: null,
                    transformRatio: "1",
                  }),
                }}
                controlled
                editable={{
                  editableKeys,
                  onChange: (keys) => setEditableKeys(keys as string[]),
                }}
                columns={[
                  {
                    dataIndex: "unitId",
                    title: "辅助单位",
                    renderFormItem: () => <UnitSelector />,
                    render: (val) => getUnitName(val),
                    formItemProps: {
                      rules: [
                        {
                          required: true,
                          message: "请选择辅助单位",
                        },
                      ],
                    },
                  },
                  {
                    dataIndex: "transformRatio",
                    title: "换算",
                    render: (val, record) =>
                      `1${getUnitName(record.unitId)} = ${val}${getUnitName(
                        baseUnit.id
                      )}`,
                    formItemProps: {
                      rules: [
                        {
                          required: true,
                          message: "请输入换算比",
                        },
                        {
                          pattern: /^\d+(\.\d+)?$/,
                          message: "只能输入数字",
                        },
                      ],
                    },
                    renderFormItem: (text, { record, value }) => (
                      <Input
                        prefix={`1${getUnitName(record?.unitId)} = `}
                        suffix={`${getUnitName(baseUnit.id)}`}
                      />
                    ),
                  },
                  {
                    title: "操作",
                    dataIndex: "option",
                    valueType: "option",
                    width: 130,
                    render: (text, record, _, action) => (
                      <a
                        type="link"
                        onClick={() => {
                          action?.startEditable?.(record.id);
                        }}
                      >
                        编辑
                      </a>
                    ),
                  },
                ]}
              />
            </Form.Item>
          );
        }}
      </ProFormDependency>
      <ProFormTextArea
        width="md"
        name="remarks"
        label="备注"
        placeholder="请输入备注"
        rules={[
          { required: true, message: "请输入备注" },
          { max: 20, message: "不能超过20个字" },
        ]}
      />
    </>
  );
}

export function Component() {
  const actionRef = React.useRef<ActionType>();
  const { mutateAsync: doCreate } = useMutation({
    mutationFn: api.wms.product.create,
    onSuccess: () => {
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: doUpdate } = useMutation({
    mutationFn: api.wms.product.update,
    onSuccess() {
      message.success("修改成功");
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: doRemove } = useMutation({
    mutationFn: api.wms.product.batchRemove,
    onSuccess() {
      message.success("删除成功");
      actionRef.current?.reload(true);
    },
  });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  return (
    <PageContainer>
      <ProTable<API.ProductVO>
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
            title: "操作",
            valueType: "option",
            width: 100,
            render: (x, record, index, action) => [
              <ModalForm
                key="edit"
                request={async () => {
                  const res = await api.wms.product.detail({
                    id: record.id,
                  });
                  res.units.forEach((it: any) => (it.id = _.uniqueId()));
                  return res;
                }}
                trigger={
                  <a>
                    <EditOutlined />
                  </a>
                }
                modalProps={{
                  destroyOnClose: true,
                }}
                title="编辑"
                onFinish={async (data) => {
                  await doUpdate({
                    ...data,
                    id: record.id,
                  });
                  return true;
                }}
              >
                <FormItems />
              </ModalForm>,
              <a
                key="delete"
                onClick={() =>
                  Modal.confirm({
                    title: `确认删除选中的商品？`,
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
                  title: `确认删除选中的商品？`,
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
          <ModalForm<API.CreateProductInput>
            trigger={<Button type="primary">新建</Button>}
            title="创建商品"
            key="create"
            width="600px"
            initialValues={{
              name: "",
              remarks: "",
              baseUnit: {
                id: null,
              },
              multiUnitEnabled: false,
              units: [],
            }}
            modalProps={{
              destroyOnClose: true,
            }}
            onFinish={async (values) => {
              await doCreate(values);
              return true;
            }}
          >
            <FormItems />
          </ModalForm>,
        ]}
        request={async (data) => {
          const { list, total } = await api.wms.product.list({
            ...data,
          });
          return {
            total,
            data: list,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
}
