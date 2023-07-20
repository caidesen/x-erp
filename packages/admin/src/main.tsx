import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import { TRPCProvider } from "@/shared";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<TRPCProvider>
			<App />
		</TRPCProvider>
	</React.StrictMode>
);
