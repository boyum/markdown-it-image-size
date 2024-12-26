import { markdownItImageSize } from "markdown-it-image-size";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress Demo",
  markdown: {
    config: (md) => {
      md.use(markdownItImageSize);
    },
  },
});
