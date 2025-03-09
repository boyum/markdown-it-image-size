import { imageSize } from "image-size";
import { readFileSync } from "node:fs";

const syncFetch = require("sync-fetch");

export type Dimensions = {
  width?: number | undefined;
  height?: number | undefined;
};

export function getImageDimensionsFromLocalImage(imageUrl: string): Dimensions {
  try {
    const buffer = readFileSync(imageUrl);
    const { width, height } = imageSize(buffer);

    return { width, height };
  } catch (error) {
    console.error(
      `markdown-it-image-size: Could not get dimensions of image with url ${imageUrl}.\n\n`,
      error,
    );

    return { width: undefined, height: undefined };
  }
}

export function getImageDimensionsFromExternalImage(
  imageUrl: string,
): Dimensions {
  const isMissingProtocol = imageUrl.startsWith("//");

  const response = syncFetch(isMissingProtocol ? `https:${imageUrl}` : imageUrl);
  const buffer = response.buffer();
  const { width, height } = imageSize(buffer);

  return { width, height };
}
