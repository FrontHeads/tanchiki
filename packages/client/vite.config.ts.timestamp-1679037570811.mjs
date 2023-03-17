// ../client/vite.config.ts
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";
dotenv.config();
var vite_config_default = defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3e3
  },
  preview: {
    port: Number(process.env.CLIENT_PORT) || 3e3
  },
  define: {
    __API_HOST__: `'${process.env.API_HOST}'` || "",
    __SLACK_FEEDBACK_WEBHOOK_URL__: `'${process.env.SLACK_FEEDBACK_WEBHOOK_URL}'` || ""
  },
  css: {
    devSourcemap: true
  },
  plugins: [
    react(),
    copy({
      targets: [{ src: "./dist/index.html", dest: "./dist/", rename: "404.html" }],
      hook: "writeBundle",
      verbose: true
    })
  ],
  build: {
    rollupOptions: {
      input: {
        app: "./index.html",
        serviceWorker: "./src/serviceWorker.ts"
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === "serviceWorker" ? "[name].js" : "assets/js/[name]-[hash].js";
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY2xpZW50L3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RpbWEvRG9jdW1lbnRzL1ZTQ29kZS90YW5jaGlraS9wYWNrYWdlcy9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kaW1hL0RvY3VtZW50cy9WU0NvZGUvdGFuY2hpa2kvcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kaW1hL0RvY3VtZW50cy9WU0NvZGUvdGFuY2hpa2kvcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGNvcHkgZnJvbSAncm9sbHVwLXBsdWdpbi1jb3B5JztcblxuZG90ZW52LmNvbmZpZygpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogTnVtYmVyKHByb2Nlc3MuZW52LkNMSUVOVF9QT1JUKSB8fCAzMDAwLFxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogTnVtYmVyKHByb2Nlc3MuZW52LkNMSUVOVF9QT1JUKSB8fCAzMDAwLFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBfX0FQSV9IT1NUX186IGAnJHtwcm9jZXNzLmVudi5BUElfSE9TVH0nYCB8fCAnJyxcbiAgICBfX1NMQUNLX0ZFRURCQUNLX1dFQkhPT0tfVVJMX186IGAnJHtwcm9jZXNzLmVudi5TTEFDS19GRUVEQkFDS19XRUJIT09LX1VSTH0nYCB8fCAnJyxcbiAgfSxcbiAgY3NzOiB7XG4gICAgZGV2U291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICAvLyBcdTA0MjFcdTA0M0VcdTA0MzdcdTA0MzRcdTA0MzBcdTA0NTFcdTA0NDIgXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCIDQwNC5odG1sLCBcdTA0MzhcdTA0MzRcdTA0MzVcdTA0M0RcdTA0NDJcdTA0MzhcdTA0NDdcdTA0M0RcdTA0NEJcdTA0MzkgaW5kZXguaHRtbCwgXHUwNDQ3XHUwNDQyXHUwNDNFXHUwNDMxXHUwNDRCIFx1MDQzRFx1MDQzMCBHaXRodWIgUGFnZXMgXHUwNDNGXHUwNDQwXHUwNDM4XHUwNDNCXHUwNDNFXHUwNDM2XHUwNDM1XHUwNDNEXHUwNDM4XHUwNDM1IFx1MDQzMVx1MDQ0Qlx1MDQzQlx1MDQzRSBcdTA0MzRcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NDNcdTA0M0ZcdTA0M0RcdTA0M0UgXHUwNDQxIFx1MDQzQlx1MDQ0RVx1MDQzMVx1MDQ0Qlx1MDQ0NSBcdTA0M0ZcdTA0NDNcdTA0NDJcdTA0MzVcdTA0MzlcbiAgICBjb3B5KHtcbiAgICAgIHRhcmdldHM6IFt7IHNyYzogJy4vZGlzdC9pbmRleC5odG1sJywgZGVzdDogJy4vZGlzdC8nLCByZW5hbWU6ICc0MDQuaHRtbCcgfV0sXG4gICAgICBob29rOiAnd3JpdGVCdW5kbGUnLCAvLyBcdTA0MzdcdTA0MzBcdTA0M0ZcdTA0NDNcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzVcdTA0NDJcdTA0NDFcdTA0NEYgXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDNCXHUwNDM1IFx1MDQzN1x1MDQzMFx1MDQzRlx1MDQzOFx1MDQ0MVx1MDQzOCBcdTA0MzFcdTA0MzBcdTA0M0RcdTA0MzRcdTA0M0JcdTA0MzAgXHUwNDNEXHUwNDMwIFx1MDQzNFx1MDQzOFx1MDQ0MVx1MDQzQVxuICAgICAgdmVyYm9zZTogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBhcHA6ICcuL2luZGV4Lmh0bWwnLFxuICAgICAgICBzZXJ2aWNlV29ya2VyOiAnLi9zcmMvc2VydmljZVdvcmtlci50cycsXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBhc3NldEluZm8gPT4ge1xuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSA9PT0gJ3NlcnZpY2VXb3JrZXInXG4gICAgICAgICAgICA/ICdbbmFtZV0uanMnIC8vIHB1dCBzZXJ2aWNlIHdvcmtlciBpbiByb290XG4gICAgICAgICAgICA6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcyc7IC8vIG90aGVycyBpbiBgYXNzZXRzL2pzL2BcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixPQUFPLFdBQVc7QUFDblcsT0FBTyxZQUFZO0FBQ25CLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sVUFBVTtBQUVqQixPQUFPLE9BQU87QUFHZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNLE9BQU8sUUFBUSxJQUFJLFdBQVcsS0FBSztBQUFBLEVBQzNDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNLE9BQU8sUUFBUSxJQUFJLFdBQVcsS0FBSztBQUFBLEVBQzNDO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixjQUFjLElBQUksUUFBUSxJQUFJLGVBQWU7QUFBQSxJQUM3QyxnQ0FBZ0MsSUFBSSxRQUFRLElBQUksaUNBQWlDO0FBQUEsRUFDbkY7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBRU4sS0FBSztBQUFBLE1BQ0gsU0FBUyxDQUFDLEVBQUUsS0FBSyxxQkFBcUIsTUFBTSxXQUFXLFFBQVEsV0FBVyxDQUFDO0FBQUEsTUFDM0UsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLGVBQWU7QUFBQSxNQUNqQjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCLGVBQWE7QUFDM0IsaUJBQU8sVUFBVSxTQUFTLGtCQUN0QixjQUNBO0FBQUEsUUFDTjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
