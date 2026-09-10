import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router"],
          charts: ["recharts"],
          query: ["@tanstack/react-query"],
          clerk: ["@clerk/react"],
          ui: ["lucide-react", "sonner", "clsx", "tailwind-merge"],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
