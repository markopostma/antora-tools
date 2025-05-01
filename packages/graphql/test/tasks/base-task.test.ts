import { BaseTask } from '../../src/bases/base-task';
import { ServiceContainer } from '../../src/classes/service-container';
import { TaskStatus } from '../../src/enums';

describe('BaseTask', () => {
  const services = new ServiceContainer({} as any);
  class TestTask extends BaseTask {
    async handle() {
      return;
    }
  }
  let task: TestTask;

  beforeEach(() => {
    task = new TestTask(services);
  });

  it('creates', () => {
    expect(task).toBeInstanceOf(TestTask);
    expect(task).toBeInstanceOf(BaseTask);
  });

  it('name', () => {
    expect(task.name).toEqual('TestTask');
  });

  describe('state', () => {
    it('is an object', () => {
      expect(Object.keys(task.state)).toEqual(['status']);
    });

    it('status', () => {
      expect(task.state.status).toEqual(TaskStatus.Idle);
    });
  });
});
