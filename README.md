# markdown-it-image-size

![](https://img.shields.io/npm/v/markdown-it-image-size/latest) ![](https://img.shields.io/github/workflow/status/boyum/markdown-it-image-size/Node.js%20CI)

Adds `width` and `height` attributes to `img` tags rendered by markdown-it.

## How to use

```js
const MarkdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");

const mdRenderer = MarkdownIt();
mdRenderer.use(markdownItImageSize);
```

## Why

Browsers use the `width` and `height` attributes to [determine aspect ratios of images](https://developer.mozilla.org/en-US/docs/Web/Media/images/aspect_ratio_mapping). If the attributes are set, the browser can reserve space for the image even though it's not finished loading yet, thus preventing [cumulative layout shifts](https://web.dev/cls/) after images load.
