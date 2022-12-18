# Rollup Node Starter

A starter boilerplate project for building a Node tool with Rollup.

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
