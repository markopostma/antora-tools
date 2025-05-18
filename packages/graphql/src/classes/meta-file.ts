import { readFileSync } from 'node:fs';
import type { Config, MetaConfig } from '../interfaces';
import type { LoggerService } from '../services/logger-service';

export class MetaFile {
  constructor(
    readonly config: Config,
    private readonly logger: LoggerService,
  ) {
    this.#metaFile = this.loadLocalSync();
  }

  readonly name = 'MetaService' as const;
  readonly #metaFile: MetaConfig | undefined;

  getMetaFile() {
    return this.#metaFile;
  }

  get<K extends keyof MetaConfig>(kind: K, name?: string) {
    if (!this.#metaFile || !this.#metaFile[kind]) return;

    if (kind === 'LOCALE') {
      return this.#metaFile.LOCALE;
    } else if (typeof name === 'string') {
      return this.#metaFile[kind][name];
    }
  }

  private loadLocalSync<M extends MetaConfig>() {
    try {
      if (typeof this.config.metaFile === 'string') {
        const contents = readFileSync(this.config.metaFile, {
          encoding: 'utf-8',
        });

        return JSON.parse(contents) as M;
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
