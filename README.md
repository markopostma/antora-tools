# Antora tools

This is a monorepo containing multiple Antora extensions and tools.

## Packages

### `@antora-tools/graphql`

![](https://github.com/markopostma/antora-tools/actions/workflows/graphql-test.yml/badge.svg?branch=main) ![](https://github.com/markopostma/antora-tools/actions/workflows/graphql-e2e.yml/badge.svg?branch=main)

The Antora GraphQL Extension transforms your GraphQL schema or introspection query into clear, navigable, and beautifully integrated API docs—right inside your Antora site.

[Go to README](https://github.com/markopostma/antora-tools/tree/main/packages/graphql)

### `@antora-tools/typedoc`

![@antora-tools/typedoc TEST](https://github.com/markopostma/antora-tools/actions/workflows/typedoc-test.yml/badge.svg?branch=main)

This package has not been released yet, but will be in the near future.

[Go to README](https://github.com/markopostma/antora-tools/tree/main/packages/typedoc)

## Development

This project uses `esbuild` to transpile TypeScript code into JavaScript to make it suitable for an Antora environment. All packages in `packages/*` that need to be published to NPM and consumed as JavaScript are built this way.

### Install

```bash
npm ci
```

### Scripts

The root `package.json` defines some common scripts:

```json
{
  "build": "npm run build -ws --if-present",
  "clean": "npm run clean -ws --if-present",
  "test": "npm test -ws --if-present"
}
```

The `-ws` and `--if-present` flags tell npm to execute the command from the working directory of each package, only if the script is present.

#### `build`

Build all workspaces:

```bash
npm run build
```

Build for a single workspace:

```bash
npm run build -w @antora-tools/graphql
```

Or watch for changes:

```bash
npm run build -w @antora-tools/graphql -- --watch
```

#### `clean`

Clean all workspaces:

```bash
npm run clean
```

#### `test`

Test all workspaces with `jest`:

```bash
npm run test
```
