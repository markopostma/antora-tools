import { configureLogger, getLogger } from '@antora/logger';
import { createServer } from 'http-server';
import { exec } from 'node:child_process';
import * as fs from 'node:fs/promises';
import type { Server } from 'node:http';
import { resolve } from 'node:path';
import { format, parseArgs } from 'node:util';

class Serve {
  static {
    configureLogger({ level: 'trace', format: 'pretty' });
  }

  static root(root: string) {
    return {
      watch: (...watchDirs: string[]) => ({
        ignore: (...ignore: RegExp[]) => new this(root, watchDirs, ignore),
        start: () => new this(root, watchDirs).start(),
      }),
    };
  }

  constructor(
    private readonly root: string,
    private readonly watchDirs: string[],
    private readonly ignore: RegExp[] = [],
  ) {}

  private readonly logger = getLogger('serve');
  accessor #busy = false;

  async start() {
    await this.clean();
    await this.build();

    const server = await this.startServer(this.getOptions().port);

    await this.watchChanges();

    server.close();
  }

  private async watchChanges() {
    for await (const _ of this.watchIterator(...this.watchDirs)) {
      await this.build();
    }
  }

  private async startServer(port: number | string) {
    const server = createServer({ root: this.root });

    return new Promise<Server>((resolve) => {
      server.listen(Number(port), () => {
        this.logger.info(format('Listening on http://localhost:%s', port));
        resolve(server);
      });
    });
  }

  private async build() {
    this.busy(true);

    for (const task of [
      this.runCommand('npm run build'),
      this.runCommand(`npm run build --prefix e2e/project -- ${this.getOptions().playbook}`),
    ]) {
      const messages = await task.then(({ stderr, stdout }) => [stderr, stdout].filter(Boolean));

      messages.forEach(this.logger.trace.bind(this.logger));
    }

    this.busy(false);
  }

  private async clean() {
    return await this.runCommand('npm run clean');
  }

  private async runCommand(command: string): Promise<{ stderr?: string; stdout?: string }> {
    return await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) reject(err);
        else resolve({ stdout, stderr });
      });
    });
  }

  private getOptions() {
    return parseArgs({
      options: {
        port: {
          type: 'string',
          short: 'p',
          default: '8080',
          multiple: false,
        },
        playbook: {
          type: 'string',
          default: 'playbook.file.yml',
          multiple: false,
        },
      },
    }).values;
  }

  private async *watchIterator(...dirs: string[]): AsyncIterable<string> {
    const watching = fs.watch('.', { recursive: true, persistent: true });
    const isIgnored = (loc: string) => this.ignore.some((r) => r.test(loc));
    const isIncluded = (loc: string) => dirs.some((d) => loc.startsWith(d));
    const shouldYield = (loc: string) => !this.busy() && isIncluded(loc) && !isIgnored(loc);

    for await (const { eventType, filename } of watching) {
      if (filename && shouldYield(filename)) {
        this.logger.trace(format('File %s (%s)', eventType, resolve(filename)));
        yield filename;
      }
    }
  }

  private busy(): boolean;
  private busy(value: boolean): void;
  private busy(value?: boolean) {
    if (typeof value === 'boolean') this.#busy = value;
    else return this.#busy;
  }
}

Serve.root('./e2e/project/build/site')
  .watch('src/', 'templates/', 'test/schemas/', '@types/', 'e2e/project/', 'docs/')
  .ignore(/^e2e\/project\/build\/site\//)
  .start();
