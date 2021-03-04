import markdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import imageSize from "image-size";

export function markdownItImageSize(md: markdownIt) {
  md.renderer.rules.image = function (tokens, index, options, env, self) {
    const token = tokens[index];
    const srcIndex = token.attrIndex("src");
    const imageUrl = token.attrs[srcIndex][1];
    const caption = md.utils.escapeHtml(token.content);

    const otherAttributes = generateAttributes(md, token);

    const isLocalAbsoluteUrl = imageUrl.startsWith("/");

    const { width, height } = getImageDimensions(
      `${isLocalAbsoluteUrl ? "." : ""}${imageUrl}`,
    );
    const dimensionsAttributes =
      width && height ? ` width="${width}" height="${height}"` : "";

    return `<img src="${imageUrl}" alt="${caption}"${dimensionsAttributes} ${otherAttributes} />`;
  };
}

function generateAttributes(md: markdownIt, token: Token) {
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

function getImageDimensions(
  imageUrl: string,
): { width: number; height: number } {
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
