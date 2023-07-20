import { trpc } from "@/shared";
import { ProFormUserSelector } from "@/shared/components/UserSelector";
import { ModalForm, ProFormUploadDragger } from "@ant-design/pro-components";
import { Button, message } from "antd";
import React from "react";
interface CustomerImportModalProps {
  onImportSuccess: () => void;
}
export const CustomerImportModal: React.FC<CustomerImportModalProps> = (
  props
) => {
  const utils = trpc.useContext().client;
  return (
    <ModalForm
      title="导入客户"
      trigger={<Button>导入</Button>}
      modalProps={{
        okText: "导入",
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const fileId = values.file[0].response;
        await utils.crm.customer.import.mutate({
          fileId,
          personInChargeUserId: values.personInChargeUserId,
        });
        message.success("导入成功");
        props.onImportSuccess();
        return true;
      }}
    >
      <ProFormUserSelector
        width="md"
        name="personInChargeUserId"
        label="客户负责人"
				tooltip="导入的客户将会自动分配给该负责人, 表格内的负责人设置无效"
        placeholder="请选择客户负责人"
				rules={[{ required: true, message: "请选择客户负责人" }]}
      />
      <ProFormUploadDragger
        name="file"
        accept=".xlsx"
        max={1}
				rules={[{ required: true, message: "请上传文件" }]}
        action={(file) =>
          utils.file.getUploadUrl.query({
            filename: file.name,
            remark: "导入客户使用的excel文件",
          })
        }
      ></ProFormUploadDragger>
    </ModalForm>
  );
};
