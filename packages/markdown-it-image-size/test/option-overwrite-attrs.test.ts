import { imgSize as mditPluginImgSize } from "@mdit/plugin-img-size";
import MarkdownIt from "markdown-it";
import { beforeEach, describe, expect, it } from "vitest";
import { markdownItImageSize } from "../src";
import { clearCache } from "./test-utils";

const cacheFile = "cache-4.json";

describe("option overwriteAttrs", () => {
  beforeEach(() => {
    clearCache(cacheFile);
  });

  it("should overwrite width and height attributes if they are already present", () => {
    const markdownRenderer = new MarkdownIt()
      .use(mditPluginImgSize) // Use @mdit/plugin-img-size first to add width and height attributes
      .use(markdownItImageSize, {
        overwriteAttrs: true,
        _cacheFile: cacheFile,
      });

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} =100x200)`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should not overwrite width and height attributes if they are already present", () => {
    const markdownRenderer = new MarkdownIt()
      .use(mditPluginImgSize) // Use @mdit/plugin-img-size first to add width and height attributes
      .use(markdownItImageSize, {
        _cacheFile: cacheFile,
      });

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} =100x200)`;

    const expected = `<p><img src="${imageUrl}" alt="" width="100" height="200"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });
});
