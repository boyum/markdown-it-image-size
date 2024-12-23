import * as fs from "node:fs";
import * as path from "node:path";
import { DEFAULT_CACHE_DIR } from "../src";

export const clearCache = (cacheFile: string, cacheDir = DEFAULT_CACHE_DIR) => {
  const cachePath = path.join(cacheDir, cacheFile);

  if (fs.existsSync(cachePath)) {
    fs.rmSync(cachePath, { force: true });
  }
};
