import MarkdownIt from "markdown-it";

const { markdownItImageSize } = require("markdown-it-image-size");
const hljs = require("highlight.js");
const taskLists = require("markdown-it-task-lists");
const anchor = require("markdown-it-anchor");
const tocDoneRight = require("markdown-it-toc-done-right");
const sub = require("markdown-it-sub");
const sup = require("markdown-it-sup");
const footnote = require("markdown-it-footnote");
const emoji = require("markdown-it-emoji").full;
const deflist = require("markdown-it-deflist");
const ins = require("markdown-it-ins");
const mark = require("markdown-it-mark");
const math = require("markdown-it-math");
const plantuml = require("markdown-it-plantuml");
const abbr = require("markdown-it-abbr");

export function render() {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return "";
    },
  })
    .use(taskLists)
    .use(anchor, {
      permalink: anchor.permalink.linkInsideHeader({
        symbol: "#",
        placement: "before",
      }),
    })
    .use(tocDoneRight, { listType: "ul" })
    .use(sub)
    .use(sup)
    .use(footnote)
    .use(emoji)
    .use(deflist)
    .use(ins)
    .use(mark)
    .use(math)
    .use(plantuml)
    .use(abbr)
    .use(markdownItImageSize);

  const html = md.render(`# Markdown-it Plugins Test

## Table of Contents

[[toc]]

## 1. Image with Size

!Sample Image

## 2. Syntax Highlighting

\`\`\`javascript
const greet = () => {
  console.log("Hello, world!");
};
\`\`\`

## 3. Task Lists

- [ ] Task 1
- [x] Task 2

## 4. Anchors

### Section with Anchor

## 5. Subscript and Superscript

H~2~O is water.  
E = mc^2^

## 6. Footnotes

Here is a footnote reference.
: This is the footnote.

## 7. Emojis

I :heart: Markdown! :smile:

## 8. Definition Lists

Term 1
: Definition 1
Term 2
: Definition 2

## 9. Inserted and Marked Text

++Inserted text++  
==Marked text==

## 10. Math

Inline math: $$E = mc^2$$  
Block math:

$$
\int_0^\infty e^{-x} \, dx = 1
$$

## 11. PlantUML Diagrams

\`\`\`plantuml
@startuml
Alice -> Bob: Hello
@enduml
\`\`\`

## 12. Abbreviations

Markdown is a lightweight markup language (HTML). \*[HTML]: HyperText Markup Language`);

  return html;
}
