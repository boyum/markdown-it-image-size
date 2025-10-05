import { create } from "flat-cache";
import MarkdownIt from "markdown-it";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CACHE_DIR, markdownItImageSize } from "../src";
import * as getImageDimensionsModule from "../src/image-dimensions.utils";
import { clearCache } from "./test-utils";

const cacheFile = "option-cache-test.json";

describe("option cache", () => {
  let markdownRenderer: MarkdownIt;

  beforeEach(() => {
    clearCache(cacheFile);

    markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      cache: true,
      _cacheFile: cacheFile,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should work with cache", () => {
    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl}) ![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"> <img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
  });

  it("should support using file system caching", () => {
    const spy = vi.spyOn(
      getImageDimensionsModule,
      // biome-ignore lint/suspicious/noExplicitAny: The name of a function will always be the name of that function
      getImageDimensionsModule.getImageDimensionsFromLocalImage.name as any,
    );

    const cacheFile = "file-system-cache-test.json";
    clearCache(cacheFile);

    const markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      _cacheFile: cacheFile,
    });

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const fresh = markdownRenderer.render(markdown);

    const markdownRenderer2 = new MarkdownIt().use(markdownItImageSize, {
      _cacheFile: cacheFile,
    });
    const cached = markdownRenderer2.render(markdown);

    expect(cached).toEqual(expected);
    expect(cached).toEqual(fresh);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should support disabling caching", () => {
    const spy = vi.spyOn(
      getImageDimensionsModule,
      // biome-ignore lint/suspicious/noExplicitAny: The name of a function will always be the name of that function
      getImageDimensionsModule.getImageDimensionsFromLocalImage.name as any,
    );

    const markdownRenderer = new MarkdownIt().use(markdownItImageSize, {
      cache: false,
    });

    const imageUrl = "/test/test-assets/image1.jpg";
    const markdown = `![](${imageUrl})`;

    const imageWidth = 4032;
    const imageHeight = 3024;

    const expected = `<p><img src="${imageUrl}" alt="" width="${imageWidth}" height="${imageHeight}"></p>\n`;
    const actual = markdownRenderer.render(markdown);
    markdownRenderer.render(markdown);

    expect(actual).toBe(expected);
    expect(spy).toHaveBeenCalledTimes(2);
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

  it("should store multiple image dimensions in the cache", () => {
    const imageUrl1 = "/test/test-assets/image1.jpg";
    const imageUrl2 = "/test/test-assets/image2.jpg";

    const markdown = `![](${imageUrl1}) ![](${imageUrl2})`;

    markdownRenderer.render(markdown);

    const cache = create({
      cacheDir: CACHE_DIR,
      cacheId: cacheFile,
      ttl: 60 * 60 * 24 * 7, // 1 week
      lruSize: 10_000, // 10.000 items
    });

    const actualDimensions1 = { width: 4032, height: 3024 };
    const actualDimensions2 = { width: 2571, height: 3840 };

    const cachedDimensions1 = cache.getKey(imageUrl1);
    const cachedDimensions2 = cache.getKey(imageUrl2);

    const expected = [actualDimensions1, actualDimensions2];
    const actual = [cachedDimensions1, cachedDimensions2];

    expect(actual).toStrictEqual(expected);
  });
});
