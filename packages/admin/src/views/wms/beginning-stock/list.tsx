import {
  ActionType,
  PageContainer,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import React from "react";
import { API, api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import EditOutlined from "@ant-design/icons/EditOutlined";
import _ from "lodash";
import { ProductSelector } from "@/views/wms/components/ProductSelector";
import { WarehouseSelector } from "@/views/wms/components/WarehouseSelector";

function FormItems() {
  return (
    <>
      <ProFormText
        width="md"
        name="name"
        label="仓库名称"
        placeholder="请输入仓库名称"
        rules={[
          { required: true, message: "请输入仓库名称" },
          { max: 4, message: "最多4个字符" },
        ]}
      />
      <ProFormText
        width="md"
        name="remarks"
        label="备注"
        placeholder="请输入备注"
      />
    </>
  );
}

export function Component() {
  const actionRef = React.useRef<ActionType>();
  const { mutateAsync: doCreate } = useMutation({
    mutationFn: api.wms.beginningStock.create,
    onSuccess: () => {
      actionRef.current?.reload(true);
    },
  });
  const { mutateAsync: doUpdate } = useMutation({
    mutationFn: api.wms.beginningStock.update,
    onSuccess() {
      message.success("修改成功");
      actionRef.current?.reload(true);
    },
  });
  const onCreateNewRow = () => {
    actionRef.current?.addEditRecord({
      mark: _.uniqueId("table_new_id_"),
      product: {
        id: null,
      },
      warehouse: {
        id: null,
      },
      quantity: "0",
    });
  };
  // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  return (
    <PageContainer>
      <ProTable<API.BeginningStockVO & { mark?: string }>
        actionRef={actionRef}
        rowKey={(record) => record.mark ?? record.id}
        editable={{
          type: "multiple",
          actionRender: (row, config, defaultDom) => [
            defaultDom.save,
            defaultDom.cancel,
          ],
          onSave: async (key, row, originRow) => {
            if (row.id) {
              if (row.quantity === originRow.quantity)
                return message.success("无修改");
              await doUpdate(row as unknown as API.UpdateBeginningStockInput);
            } else {
              await doCreate(row as unknown as API.CreateBeginningStockInput);
            }
            actionRef.current?.reload();
          },
        }}
        scroll={{ x: "100%" }}
        columns={[
          {
            title: "商品名称",
            dataIndex: ["product", "name"],
            hideInTable: true,
          },
          {
            title: "商品",
            dataIndex: ["product"],
            width: 200,
            fixed: "left",
            search: false,
            renderFormItem: (dom, { record }) => {
              if (!record?.mark) return record?.product.name;
              return <ProductSelector />;
            },
            render(_, record, index, action) {
              return record.product.name;
            },
          },
          {
            title: "仓库名称",
            dataIndex: ["warehouse", "name"],
            hideInTable: true,
          },
          {
            title: "仓库",
            dataIndex: ["warehouse"],
            width: 200,
            fixed: "left",
            search: false,
            renderFormItem: (dom, { record, isEditable }) => {
              if (!record?.mark) return record?.warehouse.name;
              return <WarehouseSelector />;
            },
            render(_, record, index, action) {
              return record.warehouse.name;
            },
          },
          {
            title: "期初库存",
            dataIndex: "quantity",
            width: 100,
            fixed: "left",
            search: false,
          },
          {
            title: "创建人",
            dataIndex: ["creator", "nickname"],
            width: 200,
            editable: false,
            search: false,
          },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            valueType: "dateTime",
            width: 200,
            editable: false,
            search: false,
          },
          {
            title: "更新人",
            dataIndex: ["updater", "nickname"],
            width: 200,
            editable: false,
            search: false,
          },
          {
            title: "更新时间",
            dataIndex: "updatedAt",
            valueType: "dateTime",
            width: 200,
            editable: false,
            search: false,
          },
          {
            title: "操作",
            valueType: "option",
            width: 100,
            fixed: "right",
            render: (_, record, index, action) => [
              <a key="edit" onClick={() => action?.startEditable(record.id)}>
                <EditOutlined />
              </a>,
            ],
          },
        ]}
        // tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
        //   <Space>
        //     <a
        //       onClick={() => {
        //         Modal.confirm({
        //           title: `确认删除选中的仓库？`,
        //           content: "删除后不可恢复",
        //           onOk: async () => {
        //             await doRemove({ ids: selectedKeys });
        //             onCleanSelected();
        //           },
        //         });
        //       }}
        //     >
        //       批量删除
        //     </a>
        //     <a onClick={onCleanSelected}>取消选择</a>
        //   </Space>
        // )}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={onCreateNewRow}>
            新建
          </Button>,
          // <ModalForm<API.CreateWarehouseInput>
          //   trigger={<Button type="primary">新建</Button>}
          //   title="创建仓库"
          //   key="create"
          //   width="600px"
          //   initialValues={{
          //     name: "",
          //     decimals: 0,
          //     abbreviation: "",
          //   }}
          //   onFinish={async (values) => {
          //     await doCreate(values);
          //     return true;
          //   }}
          // >
          //   <FormItems />
          // </ModalForm>,
        ]}
        request={async (data) => {
          const { list, total } = await api.wms.beginningStock.list({
            ...data,
          });
          return {
            data: list,
            total,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
}
