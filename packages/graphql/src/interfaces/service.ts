import type { Config } from './config';

export interface Service {
  readonly config: Config;
  readonly name: string;
}

export type ServiceConstructor = { new (...args: any[]): Service };
