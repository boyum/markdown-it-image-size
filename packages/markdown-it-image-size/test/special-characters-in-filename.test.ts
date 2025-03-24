import { beforeEach, describe, expect, it } from "vitest";
import { markdownItImageSize } from "../src";
import MarkdownIt from "markdown-it";

describe(markdownItImageSize.name, () => {
  let markdownRenderer: MarkdownIt;

  beforeEach(() => {
    markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      cache: false,
    });
  });

  it("should support filenames with special characters", () => {
    const imageUrl = "/test/test-assets/special-characters🥳.jpg";

    /**
     * markdown-it will URI encode any urls, so we should expect the img src to be URI encoded.
     */
    const uriEncodedImageUrl = encodeURI(imageUrl);

    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${uriEncodedImageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });
});
