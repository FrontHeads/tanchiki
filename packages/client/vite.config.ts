import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

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
  plugins: [
    react(),
    // Создаёт файл 404.html, идентичный index.html, чтобы на Github Pages приложение было доступно с любых путей
    copy({
      targets: [
        { src: './dist/index.html', dest: './dist/', rename: '404.html' },
      ],
      hook: 'writeBundle', // запускается после записи бандла на диск
      verbose: true,
    }),
  ],
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
