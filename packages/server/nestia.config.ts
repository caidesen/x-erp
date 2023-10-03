import { INestiaConfig } from "@nestia/sdk";

const config: INestiaConfig = {
  // input: "src/**/*.controller.ts",
  input: ["src/modules/crm/customer.controller.ts"],
  output: "../api/api",
  distribute: "../api",
  clone: true,
};
export default config;
