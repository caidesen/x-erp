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
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
