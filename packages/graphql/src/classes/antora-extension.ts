import { AntoraPage } from '@antora/content-classifier';
import type * as SiteGenerator from '@antora/site-generator';
import { performance } from 'node:perf_hooks';
import { DEFAULT_CONFIG, EXTENSION_NPM } from '../constants';
import { TaskStatus } from '../enums';
import type { Config, MetaConfig, Task } from '../interfaces';
import { beforeProcess, contentClassified, navigationBuilt } from '../tasks';
import type { FailedTask, TaskConstructor } from '../types';
import { ObjectUtil } from '../utils';
import { ServiceContainer } from './service-container';

export class AntoraExtension {
  readonly tasks: Task[] = [];
  readonly start: number = performance.now();
  readonly services: ServiceContainer;
  readonly config: Config;

  constructor(
    context: SiteGenerator.GeneratorContext,
    variables: SiteGenerator.LifeCycleVariables<'register'>,
    metaConfig: MetaConfig = {},
  ) {
    this.config = ObjectUtil.deepMerge(DEFAULT_CONFIG, variables.config);
    this.services = new ServiceContainer(this.config, metaConfig);

    this
      // Hook all tasks to the corresponding events.
      .hook('beforeProcess', context, beforeProcess.map(this.createTask.bind(this)))
      .hook('contentClassified', context, contentClassified.map(this.createTask.bind(this)))
      .hook('navigationBuilt', context, navigationBuilt.map(this.createTask.bind(this)));

    // Shall not be triggered when a task fails, but will be manually called.
    context.once(
      'pagesComposed',
      this.logger.logResults.bind(
        this.logger,
        this.tasks,
        () => this.collectData()['content'] as AntoraPage[],
      ),
    );

    this.logger.trace('Registered %s for %s', EXTENSION_NPM, this.config.name);
  }

  private hook(
    event: SiteGenerator.EventName,
    context: SiteGenerator.GeneratorContext,
    tasks: Task[],
  ) {
    this.logger.trace(`Hook event ${event}`);
    this.tasks.push(...tasks);

    context.once(event, async (variables: SiteGenerator.ContextVariables) => {
      this.logger.trace(`Event ${event} triggered`);

      for (const task of tasks) await this.runTask(task, context, variables);
    });

    return this;
  }

  private createTask(taskConstructor: TaskConstructor) {
    return new taskConstructor(this.config, this.services);
  }

  private async runTask(
    task: Task,
    context: SiteGenerator.GeneratorContext,
    variables: SiteGenerator.LifeCycleVariables<SiteGenerator.EventName>,
  ) {
    this.logger.trace(`Running task ${task.name}`);

    await task
      .started()
      .handle(variables, this.collectData())
      .then((result) => task.success(result).done())
      .catch((e) => task.failed(e).done());

    if (task.hasStatus(TaskStatus.Failed)) {
      await this.handleError(task as FailedTask, context);
    }

    return task.hasStatus(TaskStatus.Success);
  }

  private async handleError(task: FailedTask, context: SiteGenerator.GeneratorContext) {
    // [1] Make sure to stop all tasks.
    context.removeAllListeners();

    // [2] Mark all IDLE tasks as SKIPPED.
    this.tasks
      .filter((task) => task.hasStatus(TaskStatus.Idle))
      .forEach((task) => task.update({ status: TaskStatus.Skipped }));

    // [3] Log error stack
    this.logger.error(`${task.name} failed.`);
    this.logger.error(task.state.error);

    // [4] Prematurely log results.
    this.logger.logResults(this.tasks, () => (this.collectData()['content'] as AntoraPage[]) ?? []);

    // [5] Fully stop Antora from handling the extension.
    context.stop();
  }

  private collectData<D extends Record<string, unknown>>(): D {
    return this.tasks.reduce((data, { state }) => ({ ...data, ...state.data }), {} as D);
  }

  private get logger() {
    return this.services.logger;
  }
}
