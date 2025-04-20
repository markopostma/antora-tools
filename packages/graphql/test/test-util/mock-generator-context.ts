import type { ContextVariables, CustomConfig, GeneratorContext } from '@antora/site-generator';
import { EventEmitter } from 'node:events';
import { DEFAULT_CONFIG } from '../../src/constants';
import type { Config } from '../../src/interfaces';
import { ObjectUtil } from '../../src/utils';
import { MockLogger } from './mock-logger';

export class MockGeneratorContext extends EventEmitter implements GeneratorContext {
  static with(config: Partial<Config> = {}) {
    return new this(ObjectUtil.deepMerge(DEFAULT_CONFIG, config));
  }

  constructor(readonly config: CustomConfig<Config>) {
    super();
  }

  getFunctions(): Readonly<Record<string, any>> {
    return {};
  }

  getLogger(_?: string) {
    return new MockLogger();
  }

  getVariables(): ContextVariables {
    return {} as any;
  }

  require(_: string) {}
  lockVariable(_: string | symbol) {}
  replaceFunctions(_: any): Readonly<Record<string, any>> {
    return {};
  }
  removeVariable(_: string) {}
  stop() {}
  updateVariables(_: any) {}
}
