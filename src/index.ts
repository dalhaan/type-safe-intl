import fs, { promises as fsPromises } from "fs";
import path from "path";
import chalk from "chalk";
import { spawn } from "child_process";

const MODEL_FOLDER = "src/assets/models";
const COMPONENT_FOLDER = "src/gltfjsx";
const GLTF_FILE_EXTENSIONS = [".gltf", ".glb"];

const modelFilenames = [];

// Get GLTF models
for (const filename of fs.readdirSync(MODEL_FOLDER)) {
  const extension = path.extname(filename).toLowerCase();
  const isFileGltf = GLTF_FILE_EXTENSIONS.includes(extension);

  if (isFileGltf) {
    modelFilenames.push(filename);
  }
}

// Validate GLTF models exist
if (modelFilenames.length === 0) {
  console.log(
    chalk.red.bold(
      `No GLTF files found in "${MODEL_FOLDER}". GLTF files have the following extensions: ${GLTF_FILE_EXTENSIONS.map(
        (str) => `"${str}"`
      ).join(", ")}.`
    )
  );

  process.exit(1);
}

console.log(
  chalk.bgGreen(" Found: ") +
    " " +
    modelFilenames.map((str) => `"${str}"`).join(",  ")
);

// Run `gltfjsx` cli tool on parallel processes to convert each model
for (const filename of modelFilenames) {
  const originalModel = path.parse(filename);
  const newModelFilename = `${originalModel.name}-transformed${originalModel.ext}`;
  const componentFilename = `${originalModel.name}.tsx`;

  const originalComponentPathRelative = `${MODEL_FOLDER}/${componentFilename}`;
  const originalComponentPath = path.resolve(originalComponentPathRelative);
  const newComponentPath = path.resolve(
    `${COMPONENT_FOLDER}/${componentFilename}`
  );
  const originalModelPath = path.resolve(`${MODEL_FOLDER}/${newModelFilename}`);
  const newModelPath = path.resolve(`public/${newModelFilename}`);

  // Skip converting model if component already exists
  if (fs.existsSync(newComponentPath)) {
    console.log(
      chalk.bgBlue(" Skipping: ") + " " + filename + " (already exists)"
    );
    continue;
  }

  // Create subprocess
  const subprocess = spawn(
    "npx",
    ["gltfjsx", filename, "--types", "--transform", ...process.argv.slice(2)],
    {
      cwd: path.resolve(MODEL_FOLDER),
      // Print any errors from `npx gltjsx` (pipe child processes stderr to stderr)
      stdio: ["pipe", "pipe", process.stderr],
    }
  );

  subprocess.on("close", async (code) => {
    // Success
    if (code === 0) {
      // Fix component file
      try {
        console.log(chalk.bgGreen(` Fixing: `) + componentFilename);

        const data = await fsPromises.readFile(originalComponentPath, "utf8");

        // Add `forwardRef` to react imports, and three type imports
        const fixed = data
          .replace(
            /import React, { useRef } from 'react'/g,
            "import { forwardRef } from 'react'\nimport { Group } from 'three'\nimport { GroupProps } from '@react-three/fiber'"
          )

          // Rename component and use `forwardRef
          .replace(
            /export function Model\(props: JSX.IntrinsicElements\['group'\]\) {/g,
            `export const ${originalModel.name} = forwardRef<Group, GroupProps>((props, ref) => {`
          )

          // Fix useGLTF cast type
          .replace(
            /(const { nodes, materials } = useGLTF\(.+\) as) (GLTFResult)/g,
            "$1 unknown as $2"
          )

          // Add `ref` prop to top-level `group`
          .replace(/<group {...props}/g, "<group ref={ref} {...props}")

          // Close forwardRef function
          .replace(/(\s+<\/group>\n\s+\)\n})/g, "$1);");

        await fsPromises.writeFile(originalComponentPath, fixed, "utf8");
      } catch (error) {
        console.log(
          chalk.bgRed(` Failed to fix ${componentFilename}: `) + error
        );
      }

      // Create folder for generates JSX components  if it doesn't exist
      if (!fs.existsSync(path.resolve(COMPONENT_FOLDER))) {
        await fsPromises.mkdir(path.resolve(COMPONENT_FOLDER), {
          recursive: true,
        });
      }

      // Move generates files
      try {
        await Promise.allSettled([
          fsPromises.rename(originalComponentPath, newComponentPath),
          fsPromises.rename(originalModelPath, newModelPath),
        ]);

        console.log(
          chalk.bgGreen(" Done: ") + " " + chalk.green.bold(`"${filename}"`)
        );
      } catch (error) {
        console.log(
          chalk.bgRed.bold(
            ` Failed to move "${componentFilename}" and/or "${newModelFilename}": `
          ) + error
        );
      }
    }
    // Error
    else {
      console.log(
        chalk.red.bold(`Failed to convert "${filename}" (exit code ${code}).`)
      );
    }
  });
}
