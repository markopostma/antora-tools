import { BaseService } from '../bases/base-service';
import { DEFAULT_CONFIG } from '../constants';
import { Config } from '../interfaces';
import { ObjectUtil } from '../utils';

export class ConfigService extends BaseService {
  readonly name = 'ConfigService' as const;

  constructor(config: Partial<Config>) {
    super(ObjectUtil.deepMerge(DEFAULT_CONFIG, config));
  }

  get<K extends keyof Config>(key: K) {
    return this.config[key];
  }
}
