import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

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
      },
    ],
    plugins: [nodeResolve()],
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
        banner: "#!/usr/bin/env node",
      },
    ],

    plugins: [nodeResolve()],
    external,
  },
  // Bundle types into single index.d.ts
  {
    input: "types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
