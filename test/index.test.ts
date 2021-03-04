import { markdownItImageSize } from "../src";
// eslint-disable-next-line
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

    expect(actual).toEqual(expected);
  });

  it("should render local images with attributes for width and height, and title", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} "title")`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}" title="title" /></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toEqual(expected);
  });
});
