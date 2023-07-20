import { Select } from "antd";
import { trpc } from "../lib/request";
import { ProFormSelect, ProFormSelectProps } from "@ant-design/pro-components";

export function useUserOptions() {
  const { data } = trpc.system.user.list.useQuery({
    pageSize: 99,
  });
  return (
    data?.data.map((item) => ({ label: item.nickname, value: item.id })) ?? []
  );
}
export function UserSelector() {
  const options = useUserOptions();
  return (
    <Select
      options={options}
      showSearch
      filterOption={(input, option) => !!option?.label.includes(input)}
    />
  );
}

export function ProFormUserSelector(props: ProFormSelectProps) {
  const options = useUserOptions();
  return <ProFormSelect options={options} showSearch {...props} />;
}
