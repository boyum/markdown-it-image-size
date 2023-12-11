import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "markdown-it-image-size",
      fileName: format => `markdown-it-image-size.${format}.js`,
    },
  },
});
