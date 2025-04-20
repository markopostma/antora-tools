import type { AntoraPage } from '@antora/content-classifier';
import { configureLogger, getLogger, Logger } from '@antora/logger';
import * as util from 'node:util';
import { BaseService } from '../bases/base-service';
import { LogLevel, TaskStatus } from '../enums';
import type { Config, Task } from '../interfaces';
import { ArrayUtil } from '../utils';

export class LoggerService extends BaseService {
  constructor(config: Config) {
    super(config);
    configureLogger({
      level: config.logLevel,
      name: config.name,
      format: 'pretty',
    });
    this.#logger = getLogger(config.name);
  }

  readonly name = 'LoggerService' as const;
  readonly #logger: Logger;

  info(format: any, ...args: any[]): void {
    return this.log(LogLevel.Info, format, ...args);
  }

  warn(format: any, ...args: any[]): void {
    return this.log(LogLevel.Warn, format, ...args);
  }

  error(format: any | Error, ...args: any[]): void {
    return this.log(LogLevel.Error, format, ...args);
  }

  debug(format: any, ...args: any[]): void {
    return this.log(LogLevel.Debug, format, ...args);
  }

  trace(format: any, ...args: any[]): void {
    return this.log(LogLevel.Trace, format, ...args);
  }

  fatal(format: any, ...args: any[]): void {
    return this.log(LogLevel.Fatal, format, ...args);
  }

  async logResults(tasks: Task[], content: () => AntoraPage[]) {
    const execTime = Math.round(tasks.reduce((sum, t) => sum + (t.state.end ?? 0), 0));
    const execText = execTime > 1000 ? `${execTime / 1000}s` : `${execTime}ms`;
    const pages = typeof content === 'function' ? (content() ?? []) : [];
    const { format } = await import('node:util');
    const { FAILED, SKIPPED, IDLE } = new ArrayUtil(tasks).groupBy(({ state }) => state.status);
    const render = (a: Task[] | undefined, s: TaskStatus) =>
      a?.length ? format('%d %s %s', a.length, s.toLowerCase(), 'task(s)') : null;
    const lines = [
      format('Generated %d pages in %s', pages.length, execText),
      render(FAILED, TaskStatus.Failed)!,
      render(SKIPPED, TaskStatus.Skipped)!,
      render(IDLE, TaskStatus.Idle)!,
    ].filter(Boolean);

    return this.info(lines.join(' - '));
  }

  private log(level: LogLevel, message: any, ...args: any[]) {
    const fn = this.#logger[level].bind(this.#logger);

    if (typeof fn === 'function') {
      if (message instanceof Error) return fn(message);
      if (args.length && typeof message === 'string') return fn(util.format(message, ...args));

      return fn(message, ...args);
    }
  }
}
