import { API, api } from "@/api";
import { Link } from "react-router-dom";
import { Dropdown, message, Modal } from "antd";
import React from "react";

const orderActions = [
  {
    key: "submit",
    content:
      "确认提交选中的销售单？提交后将进入待审核状态，无法编辑，如需更改，请取消提交进行编辑操作",
    api: api.crm.salesOrder.submit,
    buttonText: "提交",
  },
  {
    key: "reverseSubmit",
    content: "确认取消提交选中的销售单？",
    api: api.crm.salesOrder.reverseSubmit,
    buttonText: "取消提交",
  },
  {
    key: "approve",
    content: "确认审核通过选中的销售单？",
    api: api.crm.salesOrder.approve,
    buttonText: "审核通过",
  },
  {
    key: "reverseApprove",
    content: "确认反审核通过选中的销售单？",
    api: api.crm.salesOrder.reverseApprove,
    buttonText: "反审核",
  },
  {
    key: "reject",
    content: "确认驳回选中的销售单？",
    api: api.crm.salesOrder.reject,
    buttonText: "驳回",
  },
  {
    key: "reverseReject",
    content: "确认反驳回选中的销售单？",
    api: api.crm.salesOrder.reverseReject,
    buttonText: "反驳回",
  },
  {
    key: "cancel",
    content: "确认取消选中的销售单？",
    api: api.crm.salesOrder.cancel,
    buttonText: "取消",
  },
];
interface SalesOrderActionMenuProps {
  item: API.SalesOrderVO;
  reload: () => void;
  children?: React.ReactNode;
}
export const SalesOrderActionMenu = (props: SalesOrderActionMenuProps) => {
  const currentKeys = new Set();
  if (props.item.status === "SAVED") {
    currentKeys.add("submit");
    currentKeys.add("cancel");
  } else if (props.item.status === "SUBMITTED") {
    currentKeys.add("reverseSubmit");
    currentKeys.add("approve");
  } else if (props.item.status === "APPROVED") {
    currentKeys.add("reverseApprove");
  } else if (props.item.status === "REJECTED") {
    currentKeys.add("reverseReject");
  } else if (props.item.status === "CANCELED") {
    //
  } else if (props.item.status === "COMPLETED") {
    //
  }
  const arr = [
    {
      key: "edit",
      label: <Link to={`/crm/sales-order/edit/${props.item.id}`}>编辑</Link>,
    },
    ...orderActions.map((it) => ({
      key: it.key,
      label: it.buttonText,
      onClick: () => {
        Modal.confirm({
          title: "提示",
          content: it.content,
          async onOk() {
            await it.api({
              id: props.item.id,
            });
            message.success("操作成功");
            props.reload();
          },
        });
      },
    })),
  ].filter((it) => currentKeys.has(it.key));
  return (
    <Dropdown disabled={arr.length === 0} menu={{ items: arr }}>
      {props.children}
    </Dropdown>
  );
};
