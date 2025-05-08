import type { RequestOptions } from 'node:http';
import type { Locale, LogLevel, Strategy } from '../enums';

export interface Config {
  strategy: Strategy;
  location: string;
  name: string;
  title: string;
  intro: string;
  metaFile: string;
  version: string;
  displayVersion: string;
  headers: { name: string | keyof RequestOptions['headers']; value: string }[];
  locale: Locale;
  logLevel: LogLevel;
  ignore: Array<string | RegExp>;
}
