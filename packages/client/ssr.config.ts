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
  plugins: [react()],
});
