import { copyFileSync, existsSync, rmSync } from "node:fs";

const dtsPath = new URL("../dist/index.d.ts", import.meta.url);
const dtsMtsPath = new URL("../dist/index.d.mts", import.meta.url);

if (!existsSync(dtsPath)) {
  throw new Error(`Expected declaration file not found: ${dtsPath.pathname}`);
}

copyFileSync(dtsPath, dtsMtsPath);

// Only the entry declaration files are published. Remove the per-module
// declarations that `tsc` emits for the internal source files, which are
// already bundled into index.d.ts.
for (const name of ["env.utils.d.ts", "image-dimensions.utils.d.ts"]) {
  rmSync(new URL(`../dist/${name}`, import.meta.url), { force: true });
}
