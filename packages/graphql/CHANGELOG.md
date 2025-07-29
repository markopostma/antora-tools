# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2025-07-29

### Changed

- Support for configuration on playbook level has been dropped in favor of configuration on content-source level.

## [0.9.0] - 2025-04-22

### Added

- Support for "multi-config" to register multiple components simultaneously.

### Removed

- Removed redundant `config.api_endpoint`. Use `config.intro` if you want to add asciidoc text to the index page.

## [0.8.0] - 2025-04-14

From now on installing this package is as simple as `npm i @antora-tools/graphql`.

### Changed

- Moved `fields` and `input-fields` partials up in type templates.
- Deprecated fields are now included in code examples.

### Fixed

- Output return type for types with nested non nullables, for example `[Model!]!` and `[Model!]`, are now printed correctly.

### Removed

- Removed dependencies:
  - `@graphql-tools/load`
  - `@graphql-tools/graphql-file-loader`
  - `@graphql-tools/url-loader`

## [0.7.0] - 2025-04-07

### Added

- Support for `locale` configuration.
- Support for template localization using `LOCALE` in the metafile.
- Support for `en` locale.
- Support for `nl` locale.
- Support for `de` locale.
- Support for `es` locale.

## [0.6.0] - 2025-03-17

### Added

- Support for `meta_file` configuration.

## [0.5.0] - 2025-03-02

### Added

- Code examples in `json` format inside type templates.
- Code examples in `graphql` format inside query, mutation and subscription templates.

## [0.4.0] - 2025-02-02

### Added

- Support for `directives`.
