import type { Config, MetaConfig } from '../interfaces';

export class MetaService {
  constructor(
    readonly config: Config,
    readonly metaConfig: MetaConfig,
  ) {}

  readonly name = 'MetaService' as const;

  get<K extends keyof MetaConfig>(kind: K, name?: string) {
    if (!this.metaConfig || !this.metaConfig[kind]) return;

    if (kind === 'LOCALE') {
      return this.metaConfig.LOCALE;
    } else if (typeof name === 'string') {
      return this.metaConfig[kind][name];
    }
  }
}
