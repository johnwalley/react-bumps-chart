import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/components": resolve(__dirname, "./src/components"),
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  plugins: [react(), dts({ exclude: ["stories/**/*.stories.tsx"], insertTypesEntry: true })],
});
