# @antora-tools/graphql

![@antora-tools/graphql TEST](https://github.com/markopostma/antora-tools/actions/workflows/graphql-test.yml/badge.svg?branch=main)
![@antora-tools/graphql E2E](https://github.com/markopostma/antora-tools/actions/workflows/graphql-e2e.yml/badge.svg?branch=main)

An extension for Antora to add pages extracted from a GraphQL schema.

## Demo

Visit [this url](https://markopostma.github.io/antora-docs/graphql-demo) for a demo hosted on `Github Pages`.

## Installation

```bash
npm install @antora-tools/graphql
```

### Enable

```yml
antora:
  extensions:
    - require: '@antora-tools/graphql'
      strategy: <Strategy>
      location: <String>
```

Or you can supply multiple configurations, for example:

```yml
antora:
  extensions:
    - require: '@antora-tools/graphql'
      components:
        - strategy: FILE
          location: 'my-types.graphql'
        - strategy: INTROSPECTION
          location: 'https://host.com/graphql'
```

### Determine a strategy

Currently `FILE`, `URL` and `INTROSPECTION` are supported. To determine a strategy:

1. Use **`FILE`** when a GraphQL schema is accessible locally. Expects a _relative_ path to one or more schema files. For example: `./relative-path-to/schema.graphql` or `./relative-path-to/*.graphql`.
2. Use **`URL`** when a GraphQL schema is accessible remotely via **HTTP** by POST or GET. Expects an _URL_ to an endpoint that serves a `.graphql` file. For example: `https://somehost.com/schema.graphql` or `https://somehost.com/schema`.
3. Use **`INTROSPECTION`** when a GraphQL endpoint is accessible remotely via **HTTP** by POST or GET. Expects an _URL_ to a GraphQL endpoint. For example: `https://somehost.com/graphql`.

#### Configure for `FILE`

```yml
strategy: FILE
location: './files/*.graphql'
```

#### Configure for `URL`

```yml
strategy: URL
location: 'https://somehost.com/schema'
```

#### Configure for `INTROSPECTION`

```yml
strategy: INTROSPECTION
location: 'https://somehost.com/graphql'
```

Optionally set HTTP request headers

```yml
headers:
  - name: 'Authorization'
    value: 'bearer 123456'
```

## Configuration

### `strategy`

**REQUIRED** `<string>` - Allowed values: `FILE`, `URL` or `INTROSPECTION`.

### `location`

**REQUIRED** `<string>` - Location for the chosen strategy. When using `FILE` strategy it is recommended to use **relative paths** to the current working directory. Glob patterns are supported. Some examples:

- **Single file**
  - `./dir/file.graphql`
  - `dir/file.graphql`
- **Glob pattern**
  - `./dir/*.graphql`
  - `dir/*.graphql`
  - `dir/**/*.graphql`

### `name`

`<string>` - Name for the component in lowercasing. **Default**: `'graphql'`.

### `title`

`<string>` - Title for the component. **Default**: `'GraphQL Api Docs'`.

### `intro`

Text to display on the index page. Supports multiline `asciidoc` and `markdown`. Therefor a `|` is necessary on the starting line. For example:

```yml
intro: |
  TIP: Welcome to these pages.

  * This is an item
  ** This is a sub item
```

### `meta_file`

`<string>` - Local path to a file containing extra meta data. A meta file can be used to customize some aspects of the generated output. For example the output of the introspection query, shown descriptions or template literals.

#### `LOCALE`

If your preferred locale is not supported; Most text in templates can be customized to your liking:

```json
{
  "LOCALE": {
    "[key]": "[value]"
  }
}
```

The full `interface` and all available keys can be found [here](https://github.com/markopostma/antora-tools/blob/main/packages/graphql/src/interfaces/locale.ts).

### `version`

`<string>` - Version of the component.

### `display_version`

`<string>` - Text to display as version label.

### `headers`

`<{name: string, value: string}[]>` - Define headers for remote introspections.

### `ignore`

`<string[]>` - Ignore all types that match one of the given expressions by name.

### `locale`

`<string>` - Allowed values: `de`, `en`, `es`, or `nl`. **Default**: `en`.

### `log_level`

`<string>` - Allowed values: `all`, `debug`, `info`, `warn` or `error`. **Default**: `info`.

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

---

## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [0.9.0] - 2025-04-22

#### Added

- Support for "multi-config" to register multiple components simultaneously.

#### Removed

- Removed redundant `config.api_endpoint`. Use `config.intro` if you want to add asciidoc text to the index page.

### [0.8.0] - 2025-04-14

From now on installing this package is as simple as `npm i @antora-tools/graphql`.

#### Changed

- Moved `fields` and `input-fields` partials up in type templates.
- Deprecated fields are now included in code examples.

#### Fixed

- Output return type for types with nested non nullables, for example `[Model!]!` and `[Model!]`, are now printed correctly.

#### Removed

- Removed dependencies:
  - `@graphql-tools/load`
  - `@graphql-tools/graphql-file-loader`
  - `@graphql-tools/url-loader`

### [0.7.0] - 2025-04-07

#### Added

- Support for `locale` configuration.
- Support for template localization using `LOCALE` in the metafile.
- Support for `en` locale.
- Support for `nl` locale.
- Support for `de` locale.
- Support for `es` locale.

### [0.6.0] - 2025-03-17

#### Added

- Support for `meta_file` configuration.

### [0.5.0] - 2025-03-02

#### Added

- Code examples in `json` format inside type templates.
- Code examples in `graphql` format inside query, mutation and subscription templates.

### [0.4.0] - 2025-02-02

#### Added

- Support for `directives`.
