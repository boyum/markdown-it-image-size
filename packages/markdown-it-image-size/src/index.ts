import { join } from "node:path";
import flatCache from "flat-cache";
import imageSize from "image-size";
import type { PluginWithOptions } from "markdown-it";
import { getImageDimensions } from "./get-image-dimensions";
import type { Dimensions } from "./types";

const fetch = require("sync-fetch");

export const CACHE_DIR = "node_modules/markdown-it-image-size/.cache";

type Options = {
  /**
   * @description
   * Where to look for local images.
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
   * @description
   * Custom cache file name.
   *
   * **Note:** This is experimental and may not work as expected.
   *
   * @default "dimensions.json"
   */
  _cacheFile?: string;

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
  const _cacheFile = pluginOptions?._cacheFile ?? "dimensions.json";
  const overwriteAttrs = pluginOptions?.overwriteAttrs ?? false;

  let cache: flatCache;
  // Commented out code is for flat-cache@6
  // new FlatCache({
  //   cacheDir: CACHE_DIR,
  //   cacheId: "dimensions",
  //   ttl: 60 * 60 * 24 * 7, // 1 week
  //   lruSize: 10000, // 10,000 items
  // });

  if (useCache) {
    cache = flatCache.load(_cacheFile, CACHE_DIR);
    // cache.load();
  }

  const getFromCache = (key: string): Dimensions | undefined => {
    return cache.getKey(key);
  };

  const saveToCache = (key: string, value: Dimensions): void => {
    cache.setKey(key, value);
    cache.save();
  };

  // biome-ignore lint/style/noNonNullAssertion: The original renderer should always be defined
  const originalRenderer = md.renderer.rules.image!;

  md.renderer.rules.image = (tokens, index, options, env, self): string => {
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

    let width: number | undefined = undefined;
    let height: number | undefined = undefined;

    const cacheRecord = useCache ? getFromCache(imageUrl) : undefined;
    if (cacheRecord != null) {
      width = cacheRecord.width;
      height = cacheRecord.height;
    }

    if (width == null || height == null) {
      let dimensions: Dimensions;

      if (isExternalImage) {
        dimensions = getImageDimensionsFromExternalImage(imageUrl);
      } else {
        const publicDir =
          pluginOptions?.publicDir ??
          customPluginDefaults.getAbsPathFromEnv(env) ??
          ".";

        const imagePath = join(publicDir, imageUrl);
        dimensions = getImageDimensions(imagePath);
      }

      width = dimensions.width;
      height = dimensions.height;

      if (useCache) {
        saveToCache(imageUrl, dimensions);
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

const customPluginDefaults = {
  // biome-ignore lint/suspicious/noExplicitAny: Env is unknown and based on the environment
  getAbsPathFromEnv: (env: any): string | undefined => {
    const get11tyPath = (env: { page?: { inputPath?: string } | undefined }) =>
      env?.page?.inputPath;

    const getVitePressPath = (env: { path?: string } | undefined) => env?.path;

    const markdownPath = get11tyPath(env) ?? getVitePressPath(env);
    return markdownPath
      ?.substring(0, markdownPath.lastIndexOf("/"))
      .replace(/\/\.\//g, "/");
  },
};

function getImageDimensionsFromExternalImage(imageUrl: string): Dimensions {
  const isMissingProtocol = imageUrl.startsWith("//");

  const response = fetch(isMissingProtocol ? `https:${imageUrl}` : imageUrl);
  const buffer = response.buffer();
  const { width, height } = imageSize(buffer);

  return { width, height };
}
