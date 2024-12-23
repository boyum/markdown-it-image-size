import MarkdownIt from "markdown-it";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { markdownItImageSize } from "../src";

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

  it("should render external images with no explicit protocol with attributes for width and height", () => {
    const imageUrl =
      "//images.unsplash.com/photo-1577811037855-935237616bac?auto=format&fit=crop&w=2167&q=80";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 2167;
    const imageHeight = 1625;

    const expected = `<p><img src="${imageUrl.replace(/&/g, "&amp;")}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should return undefined for width and height if image can't be found", () => {
    const consoleError = console.error;
    console.error = () => {};

    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "./unknown.jpg";
    const markdown = `![](${imageUrl})`;

    const expected = `<p><img src="${imageUrl}" alt=""></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);

    console.error = consoleError;
  });

  it("should work with relative local uris not starting with `./`", () => {
    const consoleError = console.error;
    console.error = vi.fn();

    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "uri.jpg";
    const markdown = `![](${imageUrl})`;

    const expected = `<p><img src="${imageUrl}" alt=""></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);

    console.error = consoleError;
  });

  it("should log out an error if the image could not be found", () => {
    const consoleError = console.error;
    console.error = vi.fn();

    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "./unknown.jpg";
    const markdown = `![](${imageUrl})`;

    markdownRenderer.render(markdown);

    expect(console.error).toHaveBeenCalled();

    console.error = consoleError;
  });
});
