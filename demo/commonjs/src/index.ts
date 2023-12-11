import MarkdownIt from "markdown-it";

const markdownItImageSize = require("markdown-it-image-size");

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItImageSize);

md.parse(
  `# Hello World ✨

![image](https://images.unsplash.com/photo-1577811037855-935237616bac?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80 "title")`,
  {},
);
