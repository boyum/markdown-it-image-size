import { join } from "node:path";
import { create, type FlatCache } from "flat-cache";
import type { PluginWithOptions } from "markdown-it";
import { type GeneratorEnv, getAbsPathFromGeneratorEnv } from "./env.utils";
import {
  type Dimensions,
  getImageDimensionsFromExternalImage,
  getImageDimensionsFromLocalImage,
} from "./image-dimensions.utils";

export const DEFAULT_CACHE_DIR = "node_modules/markdown-it-image-size/.cache";

type Options = {
  /**
   * @description
   * Where to look for local images.
   * This is used to resolve relative paths.
   * Certain generators like Eleventy and VitePress provide the path to the Markdown file.
   *
   * @default "."
   */
  publicDir?: string;

  /**
   * @description
   * Whether to cache the image dimensions.
   * Will only cache if the image dimensions are found.
   *
   * @default true
   */
  cache?: boolean;

  /**
   * @deprecated Use `cacheFile` instead.
   * 
   * @description
   * Custom cache file name.
   *
   * @default "dimensions.json"
   */
  _cacheFile?: string;

  /**
   * @description
   * Custom cache file name.
   *
   * @default "dimensions.json"
   */
  cacheFile?: string;

  /**
   * Where to store the cache.
   * Only works if `cache` is true.
   * Can be used to specify a custom cache directory, in order to version control the cache.
   * 
   * @default "node_modules/markdown-it-image-size/.cache"
   */
  cacheDir?: string;

  /**
   * @description
   * If true, the width and height attributes will be overwritten if
   * they are already present. For instance, if the image is defined
   * with `![alt text](image.png =100x200)` and a plugin like
   * `@mdit/plugin-img-size` is used, the width and height attributes
   * will be overwritten with the actual dimensions of the image.
   *
   * @example
   * ```js
   *   const MarkdownIt = require("markdown-it");
   *   const { markdownItImageSize } = require("markdown-it-image-size");
   *   const { imgSize } = require("@mdit/plugin-img-size");
   *
   *   const mdRenderer = MarkdownIt();
   *   mdRenderer
   *     .use(imgSize)
   *     .use(markdownItImageSize, {
   *       overwriteAttrs: true,
   *     });
   *
   *   const html = mdRenderer.render(`![alt text](/path/to/image.jpg =100x200)`);
   *   console.log(html);
   *
   *   // The attributes are overwritten with the correct dimensions (350x700).
   *   // <p><img src="/path/to/image.jpg" alt="alt text" width="350" height="700"></p>
   * ```
   *
   * @default false
   */
  overwriteAttrs?: boolean;
};

export const markdownItImageSize: PluginWithOptions<Options> = (
  md,
  pluginOptions?,
) => {
  const useCache = pluginOptions?.cache ?? true;
  const cacheFile = pluginOptions?.cacheFile ?? pluginOptions?._cacheFile ?? "dimensions.json";
  const cacheDir = pluginOptions?.cacheDir ?? DEFAULT_CACHE_DIR;
  const overwriteAttrs = pluginOptions?.overwriteAttrs ?? false;

  let cache: FlatCache;

  if (useCache) {
    cache = create({
      cacheDir,
      cacheId: cacheFile,
      ttl: 60 * 60 * 24 * 7, // 1 week
      lruSize: 10_000, // 10,000 items
    });
  }

  const getFromCache = (key: string): Dimensions | undefined => {
    return cache.getKey(key);
  };

  const saveToCache = (key: string, value: Dimensions): void => {
    cache.setKey(key, value);
    cache.save(true);
  };

  // biome-ignore lint/style/noNonNullAssertion: The original renderer should always be defined
  const originalRenderer = md.renderer.rules.image!;

  md.renderer.rules.image = (
    tokens,
    index,
    options,
    env: GeneratorEnv | undefined,
    self,
  ): string => {
    // biome-ignore lint/style/noNonNullAssertion: There shouldn't be a case where the token is undefined
    const token = tokens[index]!;
    const srcIndex = token.attrIndex("src");

    const imageUrl = token.attrs?.[srcIndex]?.[1] ?? "";

    const hasWidth = token.attrIndex("width") !== -1;
    const hasHeight = token.attrIndex("height") !== -1;

    if (!overwriteAttrs && hasWidth && hasHeight) {
      return originalRenderer(tokens, index, options, env, self);
    }

    const isExternalImage =
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("//");

    const normalizedImageUrl = isExternalImage
      ? imageUrl
      : imageUrl.startsWith("/") || imageUrl.startsWith(".")
        ? imageUrl
        : `./${imageUrl}`;

    let width: number | undefined;
    let height: number | undefined;

    const cacheRecord = useCache ? getFromCache(normalizedImageUrl) : undefined;
    if (cacheRecord != null) {
      width = cacheRecord.width;
      height = cacheRecord.height;
    }

    if (width == null || height == null) {
      let dimensions: Dimensions;

      if (isExternalImage) {
        dimensions = getImageDimensionsFromExternalImage(normalizedImageUrl);
      } else {
        const isRelativeImage = normalizedImageUrl.startsWith(".");
        const resolvedDir = isRelativeImage
          ? getAbsPathFromGeneratorEnv(env)
          : pluginOptions?.publicDir;

        const imagePath = join(
          resolvedDir ?? ".",
          // markdown-it will URI encode any URLs, therefore we decode
          // the characters to get the original URL in order to find
          // the right image file.
          decodeURIComponent(normalizedImageUrl),
        );

        dimensions = getImageDimensionsFromLocalImage(imagePath);
      }

      width = dimensions.width;
      height = dimensions.height;

      if (useCache) {
        saveToCache(normalizedImageUrl, dimensions);
      }
    }

    if (width != null && height != null) {
      if (overwriteAttrs) {
        token.attrSet("width", width.toString());
        token.attrSet("height", height.toString());
      } else {
        token.attrJoin("width", width.toString());
        token.attrJoin("height", height.toString());
      }
    }

    return originalRenderer(tokens, index, options, env, self);
  };
};
