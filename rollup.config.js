import { nodeResolve } from "@rollup/plugin-node-resolve";
// import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";

export default defineConfig([
  // CJS
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        entryFileNames: "[name].js",
      },
    ],
    plugins: [
      typescript(),
      nodeResolve(),
      // terser({ module: true })
    ],
  },
  // ES + generate types
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
        declaration: true, // Generate type declarations for the last step which bundles them into one
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
    plugins: [
      dts(),
      // Clean up type declarations generated by previous step
      del({
        targets: "dist/es/**/*.d.ts",
        onlyFiles: true,
        hook: "buildEnd", // Delete old type declarations after dts()
      }),
    ],
  },
]);
