import fs from "node:fs";
import { join } from "node:path";
import imageSize from "image-size";
import type { Token } from "markdown-it";
import type markdownIt from "markdown-it";
import packageJson from "../package.json";
import type { Dimensions } from "./types";

const fetch = require("sync-fetch");

type Params = {
  /**
   * @default "."
   *
   * Where to look for local images.
   */
  publicDir?: string;

  /**
   * @default true
   *
   * Whether to cache the image dimensions.
   * Will only cache if the image dimensions are found.
   */
  cache?: boolean;
};

const getNodeModulesPath = () => {
  return join(process.cwd(), "node_modules");
};

const getInstalledPath = () => {
  return join(getNodeModulesPath(), packageJson.name);
};

const getCachePath = () => {
  return join(getInstalledPath(), "cache.json");
};

const writeCacheToFile = (cache: Map<string, Dimensions>) => {
  const cachePath = getCachePath();
  const cacheExists = fs.existsSync(cachePath);

  if (!cacheExists) {
    fs.mkdirSync(getInstalledPath());
  }

  const cacheJson = JSON.stringify(Array.from(cache.entries()));

  fs.writeFileSync(cachePath, cacheJson);
};

const getCacheFromFile = () => {
  const cachePath = getCachePath();

  try {
    const cacheExists = fs.existsSync(cachePath);
    if (!cacheExists) {
      return new Map();
    }

    const cacheJson = fs.readFileSync(cachePath, "utf-8");
    const cacheEntries = JSON.parse(cacheJson);

    return new Map(cacheEntries);
  } catch (error) {
    console.error(
      `markdown-it-image-size: Could not read cache file at ${cachePath}.\n\n`,
      error,
    );

    return new Map();
  }
};

export function markdownItImageSize(md: markdownIt, params?: Params): void {
  const useCache = params?.cache ?? true;

  const cache: Map<string, Dimensions> = useCache
    ? getCacheFromFile()
    : new Map();

  md.renderer.rules.image = (tokens, index, _options, env) => {
    // biome-ignore lint/style/noNonNullAssertion: There shouldn't be a case where the token is undefined
    const token = tokens[index]!;

    const srcIndex = token.attrIndex("src");
    const imageUrl = token.attrs?.[srcIndex]?.[1] ?? "";
    const caption = md.utils.escapeHtml(token.content);

    const otherAttributes = generateAttributes(md, token);

    const isExternalImage =
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("//");

    let width: number | undefined = undefined;
    let height: number | undefined = undefined;

    const isCached = cache.has(imageUrl);
    if (isCached) {
      const cacheRecord = cache.get(imageUrl);
      // @ts-expect-error We checked if the cache has the key
      width = cacheRecord.width;
      // @ts-expect-error We checked if the cache has the key
      height = cacheRecord.height;
    }

    if (width == null || height == null) {
      let dimensions: Dimensions;

      if (isExternalImage) {
        dimensions = getImageDimensionsFromExternalImage(imageUrl);
      } else {
        const publicDir =
          params?.publicDir ??
          customPluginDefaults.getAbsPathFromEnv(env) ??
          ".";

        dimensions = getImageDimensions(join(publicDir, imageUrl));
      }

      width = dimensions.width;
      height = dimensions.height;

      cache.set(imageUrl, dimensions);
      writeCacheToFile(cache);
    }

    const dimensionsAttributes =
      width && height ? ` width="${width}" height="${height}"` : "";

    return `<img src="${imageUrl}" alt="${caption}"${dimensionsAttributes}${
      otherAttributes ? ` ${otherAttributes}` : ""
    }>`;
  };
}

/**
 * Generate attributes for the image tag.
 * This will exclude the `src` and `alt` attributes and only include `title`, if available.
 * The attribute values will be escaped.
 *
 * @returns An empty string if no `title` is available, or `title="..."` if available.
 */
function generateAttributes(
  md: markdownIt,
  token: Token,
): "" | `title=${string}` {
  const ignore = ["src", "alt"];

  return token.attrs
    ?.filter(([key]) => !ignore.includes(key))
    .map(([key, value]) => {
      // Escape title attributes
      const escapedValue = md.utils.escapeHtml(value);

      return `${key}="${escapedValue}"`;
    })
    .join(" ") as "" | `title=${string}`;
}

const customPluginDefaults = {
  // biome-ignore lint/suspicious/noExplicitAny: Env is unknown and based on the environment
  getAbsPathFromEnv: (env: any): string | undefined => {
    const markdownPath: string = env?.page?.inputPath; // 11ty

    if (markdownPath) {
      return markdownPath
        .substring(0, markdownPath.lastIndexOf("/"))
        .replace(/\/\.\//g, "/");
    }

    return undefined;
  },
};

function getImageDimensions(imageUrl: string): Dimensions {
  try {
    const { width, height } = imageSize(imageUrl);

    return { width, height };
  } catch (error) {
    console.error(
      `markdown-it-image-size: Could not get dimensions of image with url ${imageUrl}.\n\n`,
      error,
    );

    return { width: undefined, height: undefined };
  }
}

function getImageDimensionsFromExternalImage(imageUrl: string): Dimensions {
  const isMissingProtocol = imageUrl.startsWith("//");

  const response = fetch(isMissingProtocol ? `https:${imageUrl}` : imageUrl);
  const buffer = response.buffer();
  const { width, height } = imageSize(buffer);

  return { width, height };
}
