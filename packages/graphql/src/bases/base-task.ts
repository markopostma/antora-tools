import type * as antora from '@antora/content-classifier';
import type { EventName, LifeCycleVariables } from '@antora/site-generator';
import { performance } from 'node:perf_hooks';
import type { ServiceContainer } from '../classes/service-container';
import { TaskStatus } from '../enums';
import type { Config, Task } from '../interfaces';
import type { AdocLiteral, CollectedData } from '../types';
import { NumberUtil } from '../utils';

export abstract class BaseTask<E extends EventName = any, D extends Record<string, any> = any>
  implements Task<E, D>
{
  readonly state: Task['state'] = {
    status: TaskStatus.Idle,
  };

  constructor(
    readonly config: Config,
    readonly services: ServiceContainer,
  ) {}

  abstract handle(variables: LifeCycleVariables<E>, data: CollectedData): Promise<D>;

  started() {
    return this.update({
      status: TaskStatus.Started,
      start: performance.now(),
    });
  }

  success(data?: D) {
    return this.update({ status: TaskStatus.Success, data });
  }

  failed(error: Error) {
    return this.update({ status: TaskStatus.Failed, error });
  }

  done() {
    if (this.state.start) {
      return this.update({
        end: Math.round(performance.now() - this.state.start),
      });
    }
    return this;
  }

  update(params: Partial<Task['state']>) {
    const keys = ['status', 'error', 'data', 'start', 'end'] as const satisfies Array<
      keyof Task['state']
    >;
    const paramKeys = (Object.keys(params) as typeof keys).filter((k) => keys.includes(k));

    for (const key of paramKeys) {
      Object.assign(this.state, { [key]: params[key] });
    }
    return this;
  }

  hasStatus(status: TaskStatus) {
    return this.state.status === status;
  }

  get name() {
    return this.constructor.name;
  }

  get logger() {
    return this.services.logger;
  }

  protected addPage(path: AdocLiteral, contents: Buffer, contentCatalog: antora.ContentCatalog) {
    return this.addFile<antora.AntoraPage>(
      {
        path,
        contents,
        src: {
          component: this.config.name,
          version: this.config.version,
          module: 'ROOT',
          family: 'page',
          relative: path,
        },
      },
      contentCatalog,
    );
  }

  protected addAttachment(
    relative: string,
    contents: Buffer,
    contentCatalog: antora.ContentCatalog,
  ) {
    return this.addFile(
      {
        path: relative,
        contents,
        src: {
          component: this.config.name,
          version: this.config.version,
          module: 'ROOT',
          family: 'attachment',
          relative,
        },
      },
      contentCatalog,
    );
  }

  private addFile<F extends antora.AntoraFile>(
    desc: antora.FileDescriptor,
    catalog: antora.ContentCatalog,
  ) {
    const file = catalog.addFile(desc, this.config.version);
    const size = new NumberUtil(file._contents.length).formatBytes();

    this.logger.trace('Added %s %s [%s]', desc.src.family.toUpperCase(), file.src.relative, size);

    return file as F;
  }
}
