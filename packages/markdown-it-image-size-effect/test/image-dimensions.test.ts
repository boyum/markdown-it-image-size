import { getImageDimensionsFromLocalImage, getImageDimensionsFromExternalImage } from '../src/image/dimensions';

describe('Image Dimensions', () => {
  it('should retrieve dimensions from a local image', async () => {
    const dimensions = await getImageDimensionsFromLocalImage('path/to/local/image.jpg');
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
  });

  it('should retrieve dimensions from an external image', async () => {
    const dimensions = await getImageDimensionsFromExternalImage('https://example.com/image.jpg');
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
  });

  it('should handle errors for non-existent local images', async () => {
    const dimensions = await getImageDimensionsFromLocalImage('path/to/non-existent/image.jpg');
    expect(dimensions.width).toBeUndefined();
    expect(dimensions.height).toBeUndefined();
  });

  it('should handle errors for invalid external image URLs', async () => {
    const dimensions = await getImageDimensionsFromExternalImage('https://example.com/non-existent-image.jpg');
    expect(dimensions.width).toBeUndefined();
    expect(dimensions.height).toBeUndefined();
  });
});