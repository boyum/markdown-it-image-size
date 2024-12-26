import MarkdownIt from "markdown-it";

const { markdownItImageSize } = require("markdown-it-image-size");

export function render() {
  const md = MarkdownIt().use(markdownItImageSize);

  const html = md.render(
    `# Hello World ✨
  
  ![image](https://images.unsplash.com/photo-1577811037855-935237616bac?auto=format&fit=crop&w=2167&q=80 "title")`,
    {},
  );

  return html;
}
