import MarkdownIt from "markdown-it";
import { describe, it, expect, beforeEach } from "vitest";
import { markdownItImageSize } from "../src";
import { clearCache } from "./test-utils";

const cacheFile = "vitepress-test.json";

describe("VitePress", () => {
  let markdownRenderer: MarkdownIt;

  beforeEach(() => {
    clearCache(cacheFile);

    markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      _cacheFile: cacheFile,
    });
  });

  it("should use 11ty inputPath to resolve relative paths if available", () => {
    const inputPath = "./test/test-assets/posts/1/1.md";

    const imageUrl = "./post-image.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown, {
      page: {
        inputPath,
      },
    });

    expect(actual).toBe(expected);
  });
});
