import imageSize from "image-size";
import markdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("sync-fetch");

export function markdownItImageSize(md: markdownIt): void {
  md.renderer.rules.image = (tokens, index, options, env) => {
    const token = tokens[index];
    const srcIndex = token.attrIndex("src");
    const imageUrl = token.attrs[srcIndex][1];
    const caption = md.utils.escapeHtml(token.content);

    const otherAttributes = generateAttributes(md, token);

    const isExternalImage =
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("//");

    const isLocalAbsoluteUrl = imageUrl.startsWith("/");

    const { width, height } = isExternalImage
      ? getImageDimensionsFromExternalImage(imageUrl)
      : getImageDimensions(`${isLocalAbsoluteUrl ? "." : ""}${imageUrl}`, env);

    const dimensionsAttributes =
      width && height ? ` width="${width}" height="${height}"` : "";

    return `<img src="${imageUrl}" alt="${caption}"${dimensionsAttributes}${
      otherAttributes ? " " + otherAttributes : ""
    }>`;
  };
}

function generateAttributes(md: markdownIt, token: Token): string {
  const ignore = ["src", "alt"];
  const escape = ["title"];

  return token.attrs
    .filter(([key]) => !ignore.includes(key))
    .map(([key, value]) => {
      const escapeAttributeValue = escape.includes(key);
      const finalValue = escapeAttributeValue
        ? md.utils.escapeHtml(value)
        : value;

      return `${key}="${finalValue}"`;
    })
    .join(" ");
}

const customPluginDefaults = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function getImageDimensions(
  imageUrl: string,
  env?: unknown | undefined,
): {
  width: number;
  height: number;
} {
  try {
    const { width, height } = imageSize(imageUrl);

    return { width, height };
  } catch (error) {
    const isRelativePath = !imageUrl.startsWith("/");
    const inputPath = customPluginDefaults.getAbsPathFromEnv(env);

    if (isRelativePath && inputPath) {
      return getImageDimensions(`${inputPath}/${imageUrl}`);
    }

    console.error(
      `markdown-it-image-size: Could not get dimensions of image with url ${imageUrl}.\n\n`,
      error,
    );

    return { width: undefined, height: undefined };
  }
}

function getImageDimensionsFromExternalImage(imageUrl: string): {
  width: number;
  height: number;
} {
  const isMissingProtocol = imageUrl.startsWith("//");

  const response = fetch(isMissingProtocol ? `https:${imageUrl}` : imageUrl);
  const buffer = response.buffer();
  const { width, height } = imageSize(buffer);

  return { width, height };
}
