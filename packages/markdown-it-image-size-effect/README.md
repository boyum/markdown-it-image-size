# markdown-it-image-size-effect

## Overview

`markdown-it-image-size-effect` is a plugin for the Markdown-it library that integrates with Effect.js to provide enhanced image dimension retrieval capabilities. This package allows users to automatically fetch and set the dimensions of images in their Markdown files, ensuring that images are displayed correctly and efficiently.

## Features

- Automatically retrieves image dimensions from both local and external images.
- Integrates seamlessly with Markdown-it for easy usage in Markdown rendering.
- Utilizes Effect.js for handling asynchronous operations, making it efficient and responsive.

## Installation

To install the package, run the following command:

```
npm install markdown-it-image-size-effect
```

## Usage

Here is a basic example of how to use `markdown-it-image-size-effect` in your project:

```typescript
import MarkdownIt from 'markdown-it';
import { markdownItImageSizeEffect } from 'markdown-it-image-size-effect';

const md = MarkdownIt().use(markdownItImageSizeEffect);

const result = md.render('![alt text](image.jpg)');
console.log(result);
```

## Configuration

You can customize the behavior of the plugin by passing options:

```typescript
const md = MarkdownIt().use(markdownItImageSizeEffect, {
  publicDir: './images',
  cache: true,
  overwriteAttrs: true,
});
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.