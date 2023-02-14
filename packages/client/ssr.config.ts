import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: path.resolve(__dirname, 'ssr.tsx'),
      name: 'client-bundle',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        dir: 'dist-ssr',
      },
    },
  },
  ssr: {
    format: 'cjs',
  },
  define: {
    __API_HOST__: `'${process.env.API_HOST}'` || '',
    __SLACK_FEEDBACK_WEBHOOK_URL__: `'${process.env.SLACK_FEEDBACK_WEBHOOK_URL}'` || '',
  },
  plugins: [react()],
});
