declare module '@antora/logger' {
  import { EventEmitter } from 'node:events';

  namespace logger {
    export class Logger extends EventEmitter {
      info(...args: any[]): void;
      warn(...args: any[]): void;
      error(...args: any[]): void;
      debug(...args: any[]): void;
      trace(...args: any[]): void;
      fatal(...args: any[]): void;
    }

    export function close(): void;
    export const closeLogger: typeof close;
    export function configure(
      options?: Partial<{
        name: string;
        level: string;
        levelFormat: any;
        failureLevel: any;
        format: string;
        destination: any;
      }>,
    ): void;
    export const configureLogger: typeof configure;
    export function finalize(): Promise<unknown>;
    export const finalizeLogger: typeof finalize;
    export function get(): typeof logger;
    export function getLogger(name?: string): Logger;
  }

  export = logger;
}
