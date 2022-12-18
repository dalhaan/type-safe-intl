# Rollup Node Starter

A starter boilerplate project for building an NPM package with Rollup.

This boilerplate supports building a package that can be imported as an ES or CJS module, and also be used as a CLI.

## Import as ES module

To import this package as an ES module, all you need to do is add `"type": "module"` to your package.json.

When package managers see this they will read the package's "module" field in its package.json and import that file.

## Import as CJS module

To import this package as an ES module, all you need to do is omit the "type" field or add `"type": "commonjs"` to your package.json.

When package managers see this they will read the package's "main" field in its package.json and import that file.

## Using as a CLI

To use this package as a CLI, use the package's name (the "name" field in the package.json) as the command in either your "scripts" field in your package.json or by running:

```bash
npx <package name>
```

The package manager will read the "bin" field in the package's package.json and execute that. The top of the file indicates what kind of runtime it requires to run. In our case: `#!/usr/bin/env node`.

## Getting started

### Setting up

Set Node to correct version (check .nvmrc for Node version to use if you don't have `nvm`):

```bash
nvm use # uses Node version defined in `.nvmrc`
```

Install dependencies:

```bash
yarn
```

This boilerplate is set up for building a Node CLI tool by default. To remove CLI functionality remove the "bin" field from package.json and the "banner" field from the ESM build config in rollup.config.js

### Running

Run locally:

```bash
yarn start
```

## Building

```bash
yarn build
```

Builds to "dist".
