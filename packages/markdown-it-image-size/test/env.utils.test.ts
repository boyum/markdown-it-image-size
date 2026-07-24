import { describe, expect, it } from "vitest";
import { getAbsPathFromGeneratorEnv } from "../src/env.utils";

describe(getAbsPathFromGeneratorEnv.name, () => {
  it.each([
    {
      name: "POSIX VitePress path",
      env: { path: "/workspace/docs/blog/post.md" },
      expected: "/workspace/docs/blog",
    },
    {
      name: "Windows VitePress path",
      env: { path: String.raw`D:\workspace\docs\blog\post.md` },
      expected: "D:/workspace/docs/blog",
    },
    {
      name: "POSIX Eleventy path",
      env: { page: { inputPath: "/workspace/posts/post.md" } },
      expected: "/workspace/posts",
    },
    {
      name: "Windows Eleventy path",
      env: {
        page: {
          inputPath: String.raw`D:\workspace\posts\post.md`,
        },
      },
      expected: "D:/workspace/posts",
    },
  ])("resolves $name", ({ env, expected }) => {
    expect(getAbsPathFromGeneratorEnv(env)).toBe(expected);
  });

  it("returns undefined when generator context is unavailable", () => {
    expect(getAbsPathFromGeneratorEnv(undefined)).toBeUndefined();
  });
});
