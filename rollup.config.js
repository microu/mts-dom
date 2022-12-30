import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";



export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
    },
    plugins: [
      del({ targets: ["dist/**/*"], runOnce: true }),
      typescript({ tsconfig: "tsconfig.json" }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [
      dts({ tsconfig: "tsconfig.json" }),
    ],
  },
]);
