import { BaseTask } from '../../src/bases/base-task';
import { ServiceContainer } from '../../src/classes/service-container';
import { LogLevel } from '../../src/enums';
import { Config } from '../../src/interfaces';
import { ValidateTask } from '../../src/tasks/before-process/validate.task';

describe('ValidateTask', () => {
  let services = new ServiceContainer({});

  it('creates', () => {
    const task = new ValidateTask(services);

    expect(task).toBeInstanceOf(BaseTask);
    expect(task).toBeInstanceOf(ValidateTask);
  });

  describe('assertEnum', () => {
    it('valid', () => {
      services = new ServiceContainer({ logLevel: LogLevel.Debug });
      const task = new ValidateTask(services);
      const { valid } = task['assertEnum']('logLevel', task.config.logLevel, LogLevel);

      expect(valid).toBeTruthy();
    });

    it('invalid value', () => {
      services = new ServiceContainer({ logLevel: 'FAIL' as any });
      const task = new ValidateTask(services);
      const { valid } = task['assertEnum']('logLevel', task.config.logLevel, LogLevel);

      expect(valid).toBeFalsy();
    });
  });

  describe('assertString', () => {
    it('valid', () => {
      services = new ServiceContainer({ name: 'some-name' });
      const task = new ValidateTask(services);
      const valid = task['assertString']('name', task.config.name).every(({ valid }) => valid);

      expect(valid).toBeTruthy();
    });

    it('invalid length', () => {
      services = new ServiceContainer({ name: '' });
      const task = new ValidateTask(services);
      const [typeAssertion, lengthAssertion] = task['assertString']('name', task.config.name, 4);

      expect(typeAssertion.valid).toBeTruthy();
      expect(lengthAssertion.valid).toBeFalsy();
    });

    it('invalid type', () => {
      services = new ServiceContainer({ name: 5 as any });
      const task = new ValidateTask(services);
      const [typeAssertion] = task['assertString']('name', task.config.name, 4);

      expect(typeAssertion.valid).toBeFalsy();
    });
  });

  describe('assertArray', () => {
    it('valid', () => {
      const task = new ValidateTask(services);
      const valid = task['assertArray']('name', task.config.ignore);

      expect(valid).toBeTruthy();
    });

    it('invalid length', () => {
      services = new ServiceContainer({ ignore: [] as any[] });
      const task = new ValidateTask(services);
      const [typeAssertion, lengthAssertion] = task['assertArray']('ignore', task.config.ignore, 2);

      expect(typeAssertion.valid).toBeTruthy();
      expect(lengthAssertion.valid).toBeFalsy();
    });

    it('invalid type', () => {
      services = new ServiceContainer({ ignore: '' as unknown as any[] } as Config);
      const task = new ValidateTask(services);
      const [typeAssertion] = task['assertArray']('ignore', task.config.ignore);

      expect(typeAssertion.valid).toBeFalsy();
    });
  });
});
