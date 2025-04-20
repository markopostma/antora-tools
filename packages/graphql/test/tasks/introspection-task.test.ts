import { IntrospectionType } from 'graphql';
import { BaseTask } from '../../src/bases/base-task';
import { ServiceContainer } from '../../src/classes/service-container';
import { Config } from '../../src/interfaces';
import { IntrospectionTask } from '../../src/tasks/before-process/introspection.task';

describe('IntrospectionTask', () => {
  const services = new ServiceContainer({} as any);

  it('it creates', () => {
    const task = new IntrospectionTask({} as Config, services);

    expect(task).toBeInstanceOf(BaseTask);
    expect(task).toBeInstanceOf(IntrospectionTask);
  });

  describe('applyMutations', () => {
    describe.each([
      { ignore: [''], expected: [] },
      { ignore: [], expected: ['epic', 'epic2'] },
      { ignore: ['^epic'], expected: [] },
      { ignore: ['^epic$'], expected: ['epic2'] },
    ])('ignore', ({ ignore, expected }) => {
      const task = new IntrospectionTask({ ignore } as Config, services);

      it(`with [${ignore.join(', ')}]`, () => {
        const types = [{ name: 'epic' }, { name: 'epic2' }] as IntrospectionType[];
        const mutated = task['applyMutations'](types);

        expect(mutated.map((m) => m.name)).toEqual(expected);
      });
    });
  });
});
