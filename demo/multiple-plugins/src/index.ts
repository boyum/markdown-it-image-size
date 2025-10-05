import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import abbr from "markdown-it-abbr";
import anchor from "markdown-it-anchor";
import deflist from "markdown-it-deflist";
import { full as emoji } from "markdown-it-emoji";
import footnote from "markdown-it-footnote";
import { markdownItImageSize } from "markdown-it-image-size";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import math from "markdown-it-math";
import plantuml from "markdown-it-plantuml";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import taskLists from "markdown-it-task-lists";
import tocDoneRight from "markdown-it-toc-done-right";

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
int_0^infty e^{-x} , dx = 1
$$

## 11. PlantUML Diagrams

\`\`\`plantuml
@startuml
Alice -> Bob: Hello
@enduml
\`\`\`

## 12. Abbreviations

Markdown is a lightweight markup language (HTML). *[HTML]: HyperText Markup Language`);

  return html;
}
