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

1. Use **`FILE`** when a GraphQL schema is accessible locally. Expects a _relative_ path to one or more schema files. Example: `./relative-path-to/schema.graphql` or `./relative-path-to/*.graphql`.
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

## Configuration keys

| Key                 |    Type    | Description                                                                     |
| :------------------ | :--------: | :------------------------------------------------------------------------------ |
| **strategy**\*      |  `string`  | Allowed values: `FILE`, `URL` or `INTROSPECTION`.                               |
| **location**\*      |  `string`  | Location for provided strategy. [More info](#location)                          |
| **name**            |  `string`  | Name for the component in lowercasing. **Default**: `'graphql'`.                |
| **title**           |  `string`  | Title for the component. **Default**: `'GraphQL Api Docs'`.                     |
| **intro**           |  `string`  | Text to display on the index page. Supports asciidoc.                           |
| **meta_file**       |  `string`  | Local path to a file containing extra meta data. [More info](#meta_file)        |
| **version**         |  `string`  | Version of the component.                                                       |
| **display_version** |  `string`  | Version to display.                                                             |
| **headers**         |  `object`  | Name-value `object` to define headers for remote introspections.                |
| **include_styles**  | `boolean`  | Include custom inline `css` at the bottom of each page.                         |
| **ignore**          | `string[]` | Ignore all types that match one of the given expressions.                       |
| **locale**          |  `string`  | Allowed values: `de`, `en`, `es`, or `nl`. **Default**: `en`.                   |
| **log_level**       |  `string`  | Allowed values: `all`, `debug`, `info`, `warn` or `error`. **Default**: `info`. |

_Fields marked with `*` are non-nullable._

### `location`

When using `FILE` strategy it is recommended to use **relative paths** to the current working directory. Glob patterns are supported. Some examples:

- **Single file**
  - `./dir/file.graphql`
  - `dir/file.graphql`
- **Glob pattern**
  - `./dir/*.graphql`
  - `dir/*.graphql`
  - `dir/**/*.graphql`

### `meta_file`

A meta file can be used to customize some aspects of the generated output. For example the output of the introspection query, shown descriptions or template literals.

#### `LOCALE`

If your preferred locale is not supported; Most text in templates can be customized to your liking:

```json
{
  "LOCALE": {
    "[key]": "[value]"
  }
}
```

##### Keys/Values

```json
{
  "arguments": "Arguments",
  "definition": "Definition",
  "downloads": "Downloads",
  "enumValues": "Enum values",
  "example": "Example",
  "fields": "Fields",
  "implementations": "Implementations",
  "implementedBy": "Implemented by",
  "inputFields": "Input fields",
  "locations": "Locations",
  "possibleTypes": "Possible types",
  "repeatable": "Repeatable",
  "request": "Request",
  "returnType": "Return type"
}
```

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
