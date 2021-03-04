import http from "http";
import imageSize from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import markdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

export function markdownItImageSize(md: markdownIt) {
  md.renderer.rules.image = async (tokens, index, options, env, self) => {
    const token = tokens[index];
    const srcIndex = token.attrIndex("src");
    const imageUrl = token.attrs[srcIndex][1];
    const caption = md.utils.escapeHtml(token.content);

    const otherAttributes = generateAttributes(md, token);

    const isExternalImage =
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    const isLocalAbsoluteUrl = imageUrl.startsWith("/");

    const { width, height } = isExternalImage
      ? await getImageDimensionsFromExternalImage(imageUrl)
      : getImageDimensions(`${isLocalAbsoluteUrl ? "." : ""}${imageUrl}`);
    const dimensionsAttributes =
      width && height ? ` width="${width}" height="${height}"` : "";

    return `<img src="${imageUrl}" alt="${caption}"${dimensionsAttributes} ${
      otherAttributes ? otherAttributes + " " : ""
    }/>`;
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

async function getImageDimensionsFromExternalImage(
  imageUrl: string,
): Promise<{ width: number; height: number }> {
  const options = new URL(imageUrl);

  const { width, height } = await new Promise<ISizeCalculationResult>(
    (resolve, reject) =>
      http.get(options, function (response) {
        const chunks = [];
        response
          .on("data", function (chunk) {
            chunks.push(chunk);
          })
          .on("end", function () {
            const buffer = Buffer.concat(chunks);
            resolve(imageSize(buffer));
          });
      }),
  );

  return { width, height };
}
