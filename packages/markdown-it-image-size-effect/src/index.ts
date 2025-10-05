import { Effect, pipe } from 'effect';
import { getImageDimensionsFromLocalImage, getImageDimensionsFromExternalImage } from './image/dimensions';
import { Dimensions } from './types';

export const markdownItImageSizeEffect = (imageUrl: string): Effect<unknown, Error, Dimensions> => {
  return pipe(
    Effect.try(() => {
      const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('//');
      return isExternalImage
        ? getImageDimensionsFromExternalImage(imageUrl)
        : getImageDimensionsFromLocalImage(imageUrl);
    }),
    Effect.mapError((error) => new Error(`Failed to get dimensions for image: ${imageUrl}. Error: ${error.message}`))
  );
};