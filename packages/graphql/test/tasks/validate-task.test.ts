import { BaseTask } from '../../src/bases/base-task';
import { ServiceContainer } from '../../src/classes/service-container';
import { ValidateTask } from '../../src/tasks/before-process/validate.task';

describe('ValidateTask', () => {
  let services: ServiceContainer;
  let task: ValidateTask;

  beforeEach(() => {
    services = new ServiceContainer({});
    task = new ValidateTask(services);
  });

  it('creates', () => {
    expect(task).toBeInstanceOf(BaseTask);
    expect(task).toBeInstanceOf(ValidateTask);
  });
});
