import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/components": resolve(__dirname, "./src/components"),
      "@/utils": resolve(__dirname, "./src/utils"),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        pdf: resolve(__dirname, "src/pdf.ts"),
      },
      formats: ["es"],
      // Keep the stylesheet at dist/index.css, where consumers import it from
      cssFileName: "index",
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@react-pdf/renderer",
      ],
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  plugins: [react(), dts({ exclude: ["stories/**/*.stories.tsx", "test/**"], insertTypesEntry: true })],
});
