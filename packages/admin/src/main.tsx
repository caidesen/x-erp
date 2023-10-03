import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
// import { TRPCProvider } from "@/shared";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/lib/request";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
