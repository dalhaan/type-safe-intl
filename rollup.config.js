import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
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
      },
    ],
    plugins: [nodeResolve()],
    external,
  },
  // CLI
  {
    input: "lib/cli.js",
    output: [
      {
        file: "dist/cli/index.js",
        format: "esm",
        exports: "named",
        banner: "#!/usr/bin/env node",
      },
    ],
    plugins: [
      nodeResolve(),
      replace({
        preventAssignment: true,
        values: {
          "process.env.ROLLUP_PKG_NAME": JSON.stringify(pkg.name),
          "process.env.ROLLUP_PKG_DESC": JSON.stringify(pkg.description),
        },
      }),
    ],
    external,
  },
  // Bundle types into single index.d.ts
  {
    input: "types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
