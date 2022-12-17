import { nodeResolve } from "@rollup/plugin-node-resolve";
// import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      // {
      //   dir: "lib/es",
      //   format: "esm",
      //   preserveModules: true,
      //   entryFileNames: "[name].mjs",
      // },
      {
        dir: "dist/cjs",
        format: "cjs",
        entryFileNames: "[name].js",
        // preserveModules: true,
      },
    ],
    plugins: [
      typescript(),
      nodeResolve(),
      // terser({ module: true })
    ],
  },
  // ESM + generate types
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/es",
        format: "esm",
        preserveModules: true,
        entryFileNames: "[name].mjs",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: "dist/es",
        exclude: ["**/__tests__", "**/*.test.ts"],
      }),
      nodeResolve(),
      // terser({ module: true })
    ],
  },
  // Bundle types into single index.d.ts
  {
    input: "dist/es/index.d.ts",
    output: [{ file: "dist/types/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
]);
