import { PageContainer, ProDescriptions } from "@ant-design/pro-components";
import { api } from "@/api";

export function Component() {
  api.crm.salesOrder.create;
  return (
    <PageContainer>
      <ProDescriptions></ProDescriptions>
    </PageContainer>
  );
}
