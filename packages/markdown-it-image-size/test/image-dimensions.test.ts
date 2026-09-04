import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getImageDimensionsFromExternalImage,
  getImageDimensionsFromLocalImage,
} from "../src/image-dimensions.utils.js";

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  execFileSync: mocks.execFileSync,
}));

const imageBytes = readFileSync("./test/test-assets/image1.jpg");

beforeEach(() => {
  mocks.execFileSync.mockReset();
});

describe("getImageDimensionsFromLocalImage", () => {
  it("returns dimensions for a local image", () => {
    const dimensions = getImageDimensionsFromLocalImage(
      "./test/test-assets/image1.jpg",
    );

    expect(dimensions).toEqual({ width: 4032, height: 3024 });
  });

  it("returns undefined dimensions when the image cannot be read", () => {
    const consoleError = vi.fn();
    const originalConsoleError = console.error;
    console.error = consoleError;

    const dimensions = getImageDimensionsFromLocalImage("./unknown.jpg");

    expect(dimensions).toEqual({ width: undefined, height: undefined });
    expect(consoleError).toHaveBeenCalled();

    console.error = originalConsoleError;
  });
});

describe("getImageDimensionsFromExternalImage", () => {
  it("returns dimensions from the image bytes written by the child", () => {
    mocks.execFileSync.mockReturnValue(imageBytes);

    const dimensions = getImageDimensionsFromExternalImage(
      "https://example.com/image.jpg",
    );

    expect(mocks.execFileSync).toHaveBeenCalledWith(
      process.execPath,
      ["--eval", expect.any(String), "--", "https://example.com/image.jpg"],
      { maxBuffer: Number.POSITIVE_INFINITY, timeout: 30000 },
    );

    expect(dimensions).toEqual({ width: 4032, height: 3024 });
  });

  it("normalizes protocol-relative URLs to https", () => {
    mocks.execFileSync.mockReturnValue(imageBytes);

    getImageDimensionsFromExternalImage("//example.com/image.jpg");

    expect(mocks.execFileSync).toHaveBeenCalledWith(
      process.execPath,
      ["--eval", expect.any(String), "--", "https://example.com/image.jpg"],
      expect.any(Object),
    );
  });

  it("returns undefined dimensions when the child throws", () => {
    mocks.execFileSync.mockImplementation(() => {
      throw new Error("boom");
    });

    const consoleError = vi.fn();
    const originalConsoleError = console.error;
    console.error = consoleError;

    const dimensions = getImageDimensionsFromExternalImage(
      "https://example.com/image.jpg",
    );

    expect(dimensions).toEqual({ width: undefined, height: undefined });
    expect(consoleError).toHaveBeenCalled();

    console.error = originalConsoleError;
  });
});
