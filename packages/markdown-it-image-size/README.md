# markdown-it-image-size

![npm version](https://img.shields.io/npm/v/markdown-it-image-size/latest) [![codecov](https://codecov.io/gh/boyum/markdown-it-image-size/branch/main/graph/badge.svg?token=1WRZO1Y43U)](https://codecov.io/gh/boyum/markdown-it-image-size)

Automatically adds `width` and `height` attributes to `img` tags rendered by [markdown-it](https://github.com/markdown-it/markdown-it/).
Supports both local and remote images.

## Why

Browsers use the `width` and `height` attributes to [determine aspect ratios of images](https://developer.mozilla.org/en-US/docs/Web/Media/images/aspect_ratio_mapping). If the attributes are set, the browser can reserve space for the image even though it's not finished loading yet, thus preventing [cumulative layout shifts](https://web.dev/cls/) after images load.

## How to use

> [!IMPORTANT]  
> Using Vite? Import `markdown-it-image-size` with `require` and not with `import`.

### Basic usage

```js
const MarkdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");

const mdRenderer = MarkdownIt();
mdRenderer.use(markdownItImageSize);
```

### Option: `publicDir`

Type: `string`
Default: `.`

The `publicDir` option let's you specify a base URL for local images.
This is useful when you're using a static site generator like [Eleventy](https://www.11ty.dev/).

```js
const MarkdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");

const mdRenderer = MarkdownIt();
mdRenderer.use(markdownItImageSize, {
  publicDir: "/path/to/images",
});
```

### Option: `cache`

Type: `boolean`
Default: `true`

The `cache` option let's you disable caching of image dimensions.
The cache is located in `node_modules/markdown-it-image-size/cache.json`.
Remove this file to clear the cache.

```js
const MarkdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");

const mdRenderer = MarkdownIt();
mdRenderer.use(markdownItImageSize, {
  cache: false,
});
```
