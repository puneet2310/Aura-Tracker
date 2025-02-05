import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://aura-tracker.vercel.app/",  // Fallback to localhost in development
    },
  },
  plugins: [react()],
});
