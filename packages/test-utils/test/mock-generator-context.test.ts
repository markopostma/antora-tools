import EventEmitter from 'node:events';
import { MockGeneratorContext, MockLogger } from '../src';

describe('MockGeneratorContext', () => {
  let context: MockGeneratorContext;
  const config: Record<any, any> = { test: 'test' };

  beforeEach(() => {
    context = new MockGeneratorContext(config);
  });

  it('creates and assigns config', () => {
    expect(context).toBeInstanceOf(MockGeneratorContext);
    expect(context.config).toEqual(config);
  });

  it('extends EventEmitter', () => {
    expect(context).toBeInstanceOf(EventEmitter);
  });

  it('getLogger() returns MockLogger', () => {
    expect(context.getLogger()).toBeInstanceOf(MockLogger);
  });
});
