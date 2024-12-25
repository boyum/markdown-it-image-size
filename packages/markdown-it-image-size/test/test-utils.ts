import * as fs from "node:fs";
import * as path from "node:path";
import { CACHE_DIR } from "../src";

export const clearCache = (cacheFile: string) => {
  // Clear cache
  const cachePath = path.join(CACHE_DIR, cacheFile);
  if (fs.existsSync(cachePath)) {
    fs.rmSync(cachePath, { force: true });
  }
};
