import { readFileSync } from 'node:fs';
import { BaseService } from '../bases/base-service';
import type { Config, MetaFile } from '../interfaces';
import type { LoggerService } from './logger-service';

export class MetaService extends BaseService {
  constructor(
    readonly config: Config,
    private readonly logger: LoggerService,
  ) {
    super(config);
    this.#metaFile = this.loadSync();
  }

  readonly name = 'MetaService' as const;
  readonly #metaFile: MetaFile | undefined;

  getMetaFile() {
    return this.#metaFile;
  }

  get<K extends keyof MetaFile>(kind: K, name?: string) {
    if (!this.#metaFile || !this.#metaFile[kind]) return;

    if (kind === 'LOCALE') {
      return this.#metaFile.LOCALE;
    } else if (typeof name === 'string') {
      return this.#metaFile[kind][name];
    }
  }

  private loadSync<M extends MetaFile>() {
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
