import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import filesize from "rollup-plugin-filesize";

import pkg from "./package.json" assert { type: "json" };

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig([
  // CJS
  {
    input: "lib/index.js",
    output: [
      {
        entryFileNames: "[name].js",
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [nodeResolve(), filesize()],
    external,
  },
  // UMD
  {
    input: "lib/index.js",
    output: [
      {
        file: "dist/umd/type-safe-intl.js",
        name: "TypeSafeIntl",
        format: "umd",
        exports: "named",
        globals: {
          // TODO: Add remaining globals for dependencies
          react: "React",
        },
      },
    ],
    plugins: [
      esbuild({
        target: "es6",
        minify: true,
      }),
      filesize(),
    ],
    // TODO: Bundle dependencies
    external,
  },
  // ES
  {
    input: "lib/index.js",
    output: [
      {
        entryFileNames: "[name].mjs",
        dir: "dist/es",
        format: "esm",
        exports: "named",
        preserveModules: true,
        sourcemap: true,
      },
    ],
    plugins: [nodeResolve(), filesize()],
    external,
  },
  // Bundle types into single index.d.ts
  {
    input: "types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
