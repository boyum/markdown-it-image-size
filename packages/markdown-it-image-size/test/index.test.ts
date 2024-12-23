import fs from "node:fs";
import MarkdownIt from "markdown-it";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_CACHE_DIR, markdownItImageSize } from "../src";

describe(markdownItImageSize.name, () => {
  beforeEach(() => {
    // Clear cache
    const cachePath = DEFAULT_CACHE_DIR;
    if (fs.existsSync(cachePath)) {
      fs.rmdirSync(DEFAULT_CACHE_DIR, { recursive: true });
    }
  });

  it("should render local images with attributes for width and height", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should render local images with attributes for width and height, and title", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} "title")`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}" title="title"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should use 11ty inputPath to resolve relative paths if available", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

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

  it("should render external images with attributes for width and height", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl =
      "https://images.unsplash.com/photo-1577811037855-935237616bac?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 2167;
    const imageHeight = 1625;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should render external images with no explicit protocol with attributes for width and height", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl =
      "//images.unsplash.com/photo-1577811037855-935237616bac?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 2167;
    const imageHeight = 1625;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should return undefined for width and height if image can't be found", () => {
    const consoleError = console.error;
    console.error = () => {};

    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "unknown.jpg";
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

    const imageUrl = "unknown.jpg";
    const markdown = `![](${imageUrl})`;

    markdownRenderer.render(markdown);

    expect(console.error).toHaveBeenCalled();

    console.error = consoleError;
  });

  it("should escape title attributes", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl} "<title>")`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}" title="&lt;title&gt;"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should work with cache", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl}) ![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"> <img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should work without cache", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      cache: false,
    });

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl}) ![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"> <img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should support a publicDir option", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      publicDir: "test",
    });

    const imageUrl = "/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should support using file system caching", () => {
    const markdownRenderer = new MarkdownIt().use(markdownItImageSize);

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const fresh = markdownRenderer.render(markdown);

    const markdownRenderer2 = new MarkdownIt().use(markdownItImageSize);
    const cached = markdownRenderer2.render(markdown);

    expect(cached).toEqual(expected);
    expect(cached).toEqual(fresh);
  });
});
