import { effect, Effect } from 'effect';
import { readFile } from 'fs/promises';
import { imageSize } from 'image-size';
import { Dimensions } from '../types';

export const getImageDimensionsFromLocalImage = (imageUrl: string): Effect<Error, Dimensions> => {
  return effect(async () => {
    try {
      const buffer = await readFile(imageUrl);
      const { width, height } = imageSize(buffer);
      return { width, height };
    } catch (error) {
      console.error(`Could not get dimensions of image with url ${imageUrl}.`, error);
      throw new Error(`Failed to get dimensions: ${error.message}`);
    }
  });
};

export const getImageDimensionsFromExternalImage = (imageUrl: string): Effect<Error, Dimensions> => {
  const isMissingProtocol = imageUrl.startsWith("//");
  const url = isMissingProtocol ? `https:${imageUrl}` : imageUrl;

  return effect(async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${url}`);
    }
    const buffer = await response.arrayBuffer();
    const { width, height } = imageSize(Buffer.from(buffer));
    return { width, height };
  });
};