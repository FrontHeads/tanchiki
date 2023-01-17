import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  preview: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: {
    __SERVER_PORT__: process.env.SERVER_PORT || 5000,
  },
  css: {
    devSourcemap: true,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: './index.html',
        serviceWorker: './src/serviceWorker.ts',
      },
      output: {
        entryFileNames: assetInfo => {
          return assetInfo.name === 'serviceWorker'
            ? '[name].js' // put service worker in root
            : 'assets/js/[name]-[hash].js'; // others in `assets/js/`
        },
      },
    },
  },
});
