import MarkdownIt from "markdown-it";
import { beforeEach, describe, expect, it } from "vitest";
import { markdownItImageSize } from "../src";
import { clearCache } from "./test-utils";

const cacheFile = "11ty-test.json";

describe("11ty", () => {
  let markdownRenderer: MarkdownIt;

  beforeEach(() => {
    clearCache(cacheFile);

    markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      cacheFile,
    });
  });

  it("should use VitePress path to resolve relative paths if available", () => {
    const path = "./test/test-assets/posts/1/1.md";

    const imageUrl = "./post-image.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown, {
      path,
    });

    expect(actual).toBe(expected);
  });

  it("should work with both relative and absolute (publicDir) paths", () => {
    markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      publicDir: `${process.cwd()}/test/test-assets`,
    });

    const path = "./test/test-assets/posts/1/1.md";

    const relativeImageUrl = "./post-image.jpg";
    const relativeImageMarkdown = `![](${relativeImageUrl})`;

    const absoluteImageUrl = "/image1.jpg";
    const absoluteImageMarkdown = `![](${absoluteImageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const relativeExpected = `<p><img src="${relativeImageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const relativeActual = markdownRenderer.render(relativeImageMarkdown, {
      path,
    });

    const absoluteExpected = `<p><img src="${absoluteImageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const absoluteActual = markdownRenderer.render(absoluteImageMarkdown, {
      path,
    });

    expect(relativeActual).toBe(relativeExpected);
    expect(absoluteActual).toBe(absoluteExpected);
  });
});
