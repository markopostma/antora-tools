import type { ContextVariables, GeneratorContext } from '@antora/site-generator';
import { EventEmitter } from 'node:events';
import { MockLogger } from './mock-logger';

export class MockGeneratorContext extends EventEmitter implements GeneratorContext {
  static with(config: Record<any, any> = {}) {
    return new this(config);
  }

  constructor(readonly config: Record<any, any>) {
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
