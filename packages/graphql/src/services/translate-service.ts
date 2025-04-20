import { BaseService } from '../bases/base-service';
import { DEFAULT_CONFIG } from '../constants';
import { Locale } from '../enums';
import type { Config, LocaleData, MetaFile } from '../interfaces';
import { ObjectUtil } from '../utils';
import * as locales from './locales';
import { LoggerService } from './logger-service';

export class TranslateService extends BaseService {
  accessor #data!: LocaleData;
  readonly name = 'TranslateService' as const;

  constructor(
    readonly config: Config,
    readonly logger: LoggerService,
    readonly metaFile?: MetaFile,
  ) {
    super(config);

    return this.loadData();
  }

  get(key: keyof LocaleData) {
    const value = this.#data[key];

    if (!value) {
      throw new Error(`MISSING TRANSLATION: ${key}`);
    }

    return value;
  }

  get data() {
    return this.#data;
  }

  private loadData() {
    let locale: Locale = this.config.locale;

    if (!Object.values(Locale).includes(locale)) {
      this.logger.warn(`Locale ${locale} is not supported.`);
      locale = DEFAULT_CONFIG.locale;
    }
    this.#data = ObjectUtil.deepMerge(locales[locale], this.metaFile?.LOCALE ?? {});

    return this;
  }
}
