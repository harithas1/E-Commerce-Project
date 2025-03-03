import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // Keep it as "/" if your app is at the root of your website
  build: {
    sourcemap: false, // Disable source maps in production
  },
});
