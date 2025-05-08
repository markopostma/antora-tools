# @antora-tools/graphql

![](https://github.com/markopostma/antora-tools/actions/workflows/graphql-test.yml/badge.svg?branch=main) ![](https://github.com/markopostma/antora-tools/actions/workflows/graphql-e2e.yml/badge.svg?branch=main)

An extension for Antora to add pages extracted from a GraphQL schema.

- See a [full demo](https://markopostma.github.io/antora-docs/graphql-demo) in action hosted on `Github Pages`.
- [Read the documentation](https://markopostma.github.io/antora-docs/antora-tools-graphql) on how to get started.

---

## Development

### Installation for local development

To start local development, run:

```bash
npm install
```

### Serve and watch

To serve the Antora project in `/e2e/project` on `localhost:8080` and watch for file changes in the `src` directory, run:

```bash
npm run serve
```

### Unit-testing

Unit-testing with `jest`.

```bash
npm test
```

### e2e-testing

E2e-testing with `playwright`.

```bash
npm run test:e2e
```

Initially also run:

```bash
npx playwright install --with-deps chromium
```
