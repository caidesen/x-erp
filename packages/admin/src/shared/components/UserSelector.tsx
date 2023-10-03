import { Select } from "antd";
import { ProFormSelect, ProFormSelectProps } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

export function useUserOptions() {
  const { data } = useQuery({
    queryKey: [api.system.user.all.cacheKey],
    queryFn: () => api.system.user.all(),
  });
  return data?.map((item) => ({ label: item.nickname, value: item.id })) ?? [];
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
