import imageSize from "image-size";
import markdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("sync-fetch");

export function markdownItImageSize(md: markdownIt): void {
  md.renderer.rules.image = (tokens, index) => {
    const token = tokens[index];
    const srcIndex = token.attrIndex("src");
    const imageUrl = token.attrs[srcIndex][1];
    const caption = md.utils.escapeHtml(token.content);

    const otherAttributes = generateAttributes(md, token);

    const isExternalImage =
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    const isLocalAbsoluteUrl = imageUrl.startsWith("/");

    const { width, height } = isExternalImage
      ? getImageDimensionsFromExternalImage(imageUrl)
      : getImageDimensions(`${isLocalAbsoluteUrl ? "." : ""}${imageUrl}`);
    const dimensionsAttributes =
      width && height ? ` width="${width}" height="${height}"` : "";

    return `<img src="${imageUrl}" alt="${caption}"${dimensionsAttributes} ${otherAttributes}>`;
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

function getImageDimensions(imageUrl: string): {
  width: number;
  height: number;
} {
  try {
    const { width, height } = imageSize(imageUrl);

    return { width, height };
  } catch (error) {
    console.error(
      `markdown-it-image-size: Could not get dimensions of image with url ${imageUrl}`,
      error,
    );

    return { width: undefined, height: undefined };
  }
}

function getImageDimensionsFromExternalImage(imageUrl: string): {
  width: number;
  height: number;
} {
  const response = fetch(imageUrl);
  const buffer = response.buffer();
  const { width, height } = imageSize(buffer);

  return { width, height };
}
