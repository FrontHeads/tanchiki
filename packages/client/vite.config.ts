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
    __API_HOST__: `'${process.env.API_HOST}'` || '',
    __SLACK_FEEDBACK_WEBHOOK_URL__: `'${process.env.SLACK_FEEDBACK_WEBHOOK_URL}'` || '',
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
