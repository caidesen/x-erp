import { Transfer } from "antd";
import { trpc } from "@/shared";
import { useMemo } from "react";
interface PermissionSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}
export function PermissionSelector(props: PermissionSelectorProps) {
  const { data } = trpc.system.permission.list.useQuery({});
  return (
    <Transfer
      className="w-full"
      dataSource={data}
      showSearch
      titles={["未授权", "已授权"]}
      listStyle={{ flex: 1, height: 320 }}
      targetKeys={props.value}
      onChange={(keys) => props.onChange?.(keys)}
      rowKey={(it) => it.code}
      render={(it) => it.name}
    ></Transfer>
  );
}
