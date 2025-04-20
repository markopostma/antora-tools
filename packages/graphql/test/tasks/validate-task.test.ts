import { BaseTask } from '../../src/bases/base-task';
import { ServiceContainer } from '../../src/classes/service-container';
import { DEFAULT_CONFIG } from '../../src/constants';
import { LogLevel } from '../../src/enums';
import { Config } from '../../src/interfaces';
import { ValidateTask } from '../../src/tasks/before-process/validate.task';

describe('ValidateTask', () => {
  const services = new ServiceContainer({ ...DEFAULT_CONFIG } as any as Config);

  it('creates', () => {
    const task = new ValidateTask({} as Config, services);

    expect(task).toBeInstanceOf(BaseTask);
    expect(task).toBeInstanceOf(ValidateTask);
  });

  describe('assertEnum', () => {
    it('valid', () => {
      const task = new ValidateTask({ logLevel: LogLevel.Debug } as Config, services);
      const { valid } = task['assertEnum']('logLevel', task.config.logLevel, LogLevel);

      expect(valid).toBeTruthy();
    });

    it('invalid value', () => {
      const task = new ValidateTask({ logLevel: 'FAIL' as any } as Config, services);
      const { valid } = task['assertEnum']('logLevel', task.config.logLevel, LogLevel);

      expect(valid).toBeFalsy();
    });
  });

  describe('assertBoolean', () => {
    it('valid', () => {
      const task = new ValidateTask({ includeStyles: true } as Config, services);
      const { valid } = task['assertBoolean']('includeStyles', task.config.includeStyles);

      expect(valid).toBeTruthy();
    });

    it('invalid type', () => {
      const task = new ValidateTask({ includeStyles: 'FAIL' as any } as Config, services);
      const { valid } = task['assertBoolean']('includeStyles', task.config.includeStyles);

      expect(valid).toBeFalsy();
    });
  });

  describe('assertString', () => {
    it('valid', () => {
      const task = new ValidateTask({ name: 'some-name' } as Config, services);
      const valid = task['assertString']('name', task.config.name).every(({ valid }) => valid);

      expect(valid).toBeTruthy();
    });

    it('invalid length', () => {
      const task = new ValidateTask({ name: '' } as Config, services);
      const [typeAssertion, lengthAssertion] = task['assertString']('name', task.config.name, 4);

      expect(typeAssertion.valid).toBeTruthy();
      expect(lengthAssertion.valid).toBeFalsy();
    });

    it('invalid type', () => {
      const task = new ValidateTask({ name: 5 as any } as Config, services);
      const [typeAssertion] = task['assertString']('name', task.config.name, 4);

      expect(typeAssertion.valid).toBeFalsy();
    });
  });

  describe('assertArray', () => {
    it('valid', () => {
      const task = new ValidateTask({ ignore: [] as any[] } as Config, services);
      const valid = task['assertArray']('name', task.config.ignore);

      expect(valid).toBeTruthy();
    });

    it('invalid length', () => {
      const task = new ValidateTask({ ignore: [] as any[] } as Config, services);
      const [typeAssertion, lengthAssertion] = task['assertArray']('ignore', task.config.ignore, 1);

      expect(typeAssertion.valid).toBeTruthy();
      expect(lengthAssertion.valid).toBeFalsy();
    });

    it('invalid type', () => {
      const task = new ValidateTask({ ignore: '' as unknown as any[] } as Config, services);
      const [typeAssertion] = task['assertArray']('ignore', task.config.ignore);

      expect(typeAssertion.valid).toBeFalsy();
    });
  });
});
