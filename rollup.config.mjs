import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
    },
    plugins: [typescript(), nodeResolve({ preferBuiltins: true }), commonjs()],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/markdown-it-image-size.d.ts",
        format: "es",
      },
    ],
    plugins: [dts()],
  },
];
