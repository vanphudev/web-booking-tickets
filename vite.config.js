import path from "path";
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
   plugins: [
      react(),
      createSvgIconsPlugin({
         iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
         symbolId: "icon-[dir]-[name]",
      }),
   ],
   watch: {
      usePolling: true,
   },
   css: {
      preprocessorOptions: {
         scss: {
            api: "modern-compiler",
         },
      },
   },
   esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
   },
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "src"),
         "@components": path.resolve(__dirname, "src/components"),
         "@assets": path.resolve(__dirname, "src/assets"),
      },
   },
   server: {
      open: true,
      host: true,
      port: 8802,
      watch: {
         usePolling: true,
      },
   },
});
