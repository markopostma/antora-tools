import { resolve } from 'node:path';
import { MIMEType } from 'node:util';
import { Locale, LogLevel } from './enums';
import type { Config } from './interfaces';

export const EXTENSION_NAME = '@antora-tools/graphql' as const;

export const DEFAULT_CONFIG = Object.freeze({
  name: 'graphql',
  title: 'GraphQL Api Docs',
  version: '',
  headers: [],
  locale: Locale.English,
  logLevel: LogLevel.Info,
  includeStyles: true,
  ignore: [/^_/],
} as const satisfies Omit<
  Config,
  'intro' | 'strategy' | 'displayVersion' | 'location' | 'metaFile'
>);
export const MIME_TYPES = {
  json: new MIMEType('application/json').toString(),
  text: new MIMEType('text/plain').toString(),
} as const;
export const TEMPLATES_PATH = resolve(__dirname, '../templates');
export const GRAPHQL_DESCRIPTIONS_REGEXP = /(\s+"""[\s\S]*?"""|"""[\s\S]*?""")/gs;
export const SORTING = [
  'queries',
  'mutations',
  'subscriptions',
  'types',
  'OBJECT',
  'INTERFACE',
  'INPUT_OBJECT',
  'ENUM',
  'UNION',
  'SCALAR',
  'directives',
] as const;
