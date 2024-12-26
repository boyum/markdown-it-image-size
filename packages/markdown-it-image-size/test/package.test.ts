import MarkdownIt from "markdown-it";
import { beforeEach, describe, expect, it } from "vitest";
import { markdownItImageSize } from "..";

describe(markdownItImageSize.name, () => {
  let markdownRenderer: MarkdownIt;

  beforeEach(() => {
    markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      cache: false,
    });
  });

  it("should render local images with attributes for width and height", () => {
    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should render local images with attributes for width and height, and title", () => {
    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} "title")`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" title="title" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should render external images with attributes for width and height", () => {
    const imageUrl =
      "https://images.unsplash.com/photo-1577811037855-935237616bac?auto=format&fit=crop&w=2167&q=80";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 2167;
    const imageHeight = 1625;

    const expected = `<p><img src="${imageUrl.replace(/&/g, "&amp;")}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });
});
