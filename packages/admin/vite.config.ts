import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// define: { process: {
	// 		env: {},
	// 	},
	// },
	server: {
		proxy: {
			"/file": {
				target: "http://localhost:3000",
			},
			"/rpc": {
				target: "http://localhost:3000",
			},
		},
	},
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
