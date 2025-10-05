import MarkdownIt from "markdown-it";
import { beforeEach, describe, expect, it } from "vitest";
import { markdownItImageSize } from "../src";
import { clearCache } from "./test-utils";

const cacheFile = "option-public-dir-test.json";

describe("option publicDir", () => {
  beforeEach(() => {
    clearCache(cacheFile);
  });

  it("should support a publicDir option", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      publicDir: "test",
      cacheFile,
    });

    const imageUrl = "/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });
});
