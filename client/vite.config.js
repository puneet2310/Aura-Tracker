import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": process.env.VITE_API_BASE_URL || "http://localhost:3008/api/v1",  // Fallback to localhost in development
    },
  },
  plugins: [react()],
});
