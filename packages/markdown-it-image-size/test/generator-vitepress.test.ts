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
      _cacheFile: cacheFile,
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
});
