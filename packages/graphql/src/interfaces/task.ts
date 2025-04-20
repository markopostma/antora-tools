import type { EventName, LifeCycleVariables } from '@antora/site-generator';
import type { ServiceContainer } from '../classes/service-container';
import type { TaskStatus } from '../enums';
import type { LoggerService } from '../services/logger-service';
import type { CollectedData } from '../types';
import type { Config } from './config';

export interface Task<E extends EventName = any, D extends Record<string, any> = any> {
  readonly name: string;
  readonly state: {
    status: TaskStatus;
    error?: Error;
    data?: D;
    start?: number;
    end?: number;
  };
  readonly config: Config;
  readonly logger: LoggerService;
  readonly services: ServiceContainer;

  done(): this;
  failed(error: Error): this;
  handle(variables: LifeCycleVariables<E>, data: CollectedData): Promise<D>;
  hasStatus(status: TaskStatus): boolean;
  started(): this;
  success(data?: D): this;
  update(params: Partial<this['state']>): this;
}
