import { markdownItImageSize } from "../src";
const MarkdownIt = require("markdown-it");

describe(markdownItImageSize.name, () => {
  it("should render local images with attributes for width and height", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}" /></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should render local images with attributes for width and height, and title",  () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} "title")`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}" title="title" /></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should render external images with attributes for width and height", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl =
      "https://images.unsplash.com/photo-1577811037855-935237616bac?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}" /></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });
});
