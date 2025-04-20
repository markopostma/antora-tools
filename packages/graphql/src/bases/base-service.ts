import type { Config } from '../interfaces';
import { Service } from '../interfaces/service';

export abstract class BaseService implements Service {
  constructor(
    readonly config: Config,
    ..._: any[]
  ) {}

  abstract name: string;
}
