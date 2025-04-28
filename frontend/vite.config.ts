import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/": "https://typescript-ecomm-1.onrender.com",
      "/uploads": "https://typescript-ecomm-1.onrender.com",
    },
  },
});
