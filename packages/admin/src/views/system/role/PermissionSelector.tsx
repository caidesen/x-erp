import { Transfer } from "antd";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import _ from "lodash";
interface PermissionSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}
export function PermissionSelector(props: PermissionSelectorProps) {
  const { data } = useQuery({
    queryKey: ["allPermissions"],
    queryFn: () =>
      api.system.auth.role
        .getPermissions()
        .then((res) => _.entries(res).map(([code, name]) => ({ code, name }))),
  });

  return (
    <Transfer
      className="w-full"
      dataSource={data ?? []}
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
