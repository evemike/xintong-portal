import { defineConfig } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "vue-i18n":"vue-i18n/dist/vue-i18n.cjs.js",
      "@": path.resolve(__dirname, "src"),
      "@views": path.resolve(__dirname, "src/views"),
      "@api": path.resolve(__dirname, "src/api"),
      // "@utils": path.resolve(__dirname, "packages/common/utils"),
    },
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
      inject: "body-last",
      customDomId: "__svg__icons__dom__",
    }),
  ],
  server: {
    // 代理配置
    proxy:{

    }
  }
});
