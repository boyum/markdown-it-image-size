# markdown-it-image-size

![npm version](https://img.shields.io/npm/v/markdown-it-image-size/latest) [![codecov](https://codecov.io/gh/boyum/markdown-it-image-size/branch/main/graph/badge.svg?token=1WRZO1Y43U)](https://codecov.io/gh/boyum/markdown-it-image-size)

Automatically adds `width` and `height` attributes to `img` tags rendered by [markdown-it](https://github.com/markdown-it/markdown-it/).
Supports both local and remote images.

If you'd rather set image sizes manually, check out [@mdit/plugin-img-size](https://mdit-plugins.github.io/img-size.html).

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

The `publicDir` option lets you specify a base URL for local images.
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

The `cache` option lets you disable caching of image dimensions.
The cache is located in `node_modules/markdown-it-image-size/.cache`.
Remove this directory to clear the cache.

```js
const MarkdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");

const mdRenderer = MarkdownIt();
mdRenderer.use(markdownItImageSize, {
  cache: false,
});
```

### Option: `overwriteAttrs`

Type: `boolean`
Default: `false`

The `overwriteAttrs` option lets you overwrite existing `width` and `height` attributes on `img` tags.
This is useful when using another plugin which sets the attributes, such as [@mdit/plugin-img-size](https://mdit-plugins.github.io/img-size.html).

```js
const MarkdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");
const { imgSize } = require("@mdit/plugin-img-size");

const mdRenderer = MarkdownIt();
mdRenderer.use(imgSize).use(markdownItImageSize, {
  overwriteAttrs: true,
});

const html = mdRenderer.render(`![alt text](/path/to/image.jpg =100x200)`);
console.log(html);

// The attributes are overwritten with the correct dimensions (350x700).
// <p><img src="/path/to/image.jpg" alt="alt text" width="350" height="700"></p>
```

## Examples

See the [demo](./demo) directory for usage with Eleventy and Vitepress.

## Development

This project uses tsup for bundling and Vitest for testing.
It currently supports Node.js 20 and up.
To get started, fork the repository and run the following commands:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint and format
npm run lint:fix
```

> [!NOTE]
> The unit tests run on the build output, so make sure to run `npm run build` before running the tests if you have made changes to the source code.
