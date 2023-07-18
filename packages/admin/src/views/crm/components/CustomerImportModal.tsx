import { trpc } from "@/shared";
import { ModalForm, ProFormUploadDragger } from "@ant-design/pro-components";
import { Button, message } from "antd";
import React from "react";
interface CustomerImportModalProps {
	onImportSuccess: () => void;
}
export const CustomerImportModal: React.FC<CustomerImportModalProps> = (props) => {
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
				await utils.crm.customer.import.mutate(fileId);
				message.success("导入成功");
				props.onImportSuccess();
				return true;
			}}
		>
			<ProFormUploadDragger
				name="file"
				accept=".xlsx"
				max={1}
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
