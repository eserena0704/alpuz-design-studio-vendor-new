import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      overlay: true,
    },
    // When VITE_API_ORIGIN is set (e.g. to production URL), proxy /api so "npm run dev" can load products without running vercel dev
    proxy: process.env.VITE_API_ORIGIN
      ? { "/api": { target: process.env.VITE_API_ORIGIN, changeOrigin: true } }
      : undefined,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
