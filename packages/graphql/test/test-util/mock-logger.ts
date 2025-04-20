import type { Logger } from '@antora/logger';
import EventEmitter from 'node:events';

export class MockLogger extends EventEmitter implements Logger {
  constructor(readonly silent = true) {
    super();
  }

  trace(...args: any[]): void {
    if (!this.silent) {
      console.trace(...args);
    }
  }

  info(...args: any[]): void {
    if (!this.silent) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (!this.silent) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (!this.silent) {
      console.error(...args);
    }
  }

  debug(...args: any[]): void {
    if (!this.silent) {
      console.debug(...args);
    }
  }

  fatal(...args: any[]): void {
    if (!this.silent) {
      console.error(...args);
    }
  }
}
