import { MockGeneratorContext } from '@antora-tools/test-utils';
import type { GeneratorContext, Playbook } from '@antora/site-generator';
import { AntoraExtension } from '../../src/classes/antora-extension';
import { DEFAULT_CONFIG } from '../../src/constants';
import { Strategy, TaskStatus } from '../../src/enums';
import { Config } from '../../src/interfaces';
import * as Tasks from '../../src/tasks';
import { TaskConstructor } from '../../src/types';
import { ObjectUtil } from '../../src/utils';

describe('class AntoraExtension', () => {
  let context: GeneratorContext;
  let extension: AntoraExtension;

  describe('FILE', () => {
    const config = ObjectUtil.deepMerge<Config>(DEFAULT_CONFIG, {
      strategy: Strategy.File,
      location: '',
      headers: [],
    } satisfies Partial<Config>);
    const playbook = {} as Playbook;

    beforeEach(() => {
      context = MockGeneratorContext.with(config);
      extension = new AntoraExtension(context, { config, playbook });
    });

    it('creates', () => {
      expect(extension).toBeInstanceOf(AntoraExtension);
    });

    describe('registers tasks and adds event listeners', () => {
      it('has registered a number of tasks', () => {
        expect(extension.tasks.length).toEqual(8);
      });

      it('has assigned the extension config to every task', () => {
        for (const task of extension.tasks) {
          expect(task.config).toBeDefined();
        }
      });
      ['beforeProcess', 'contentClassified', 'navigationBuilt'].forEach((event) => {
        it(`listening on ${event}`, () => {
          expect(context.listenerCount(event)).toEqual(1);
        });
      });
    });

    describe.each([
      {
        event: 'beforeProcess',
        tasks: Tasks.beforeProcess,
      },
      {
        event: 'contentClassified',
        tasks: Tasks.contentClassified,
      },
      {
        event: 'navigationBuilt',
        tasks: Tasks.navigationBuilt,
      },
    ] as const)('event emits', ({ event, tasks }) => {
      describe(event, () => {
        it('runs all tasks successfully', async () => {
          const instances = tasks.map(findTask);
          const spies = instances.map((i) =>
            jest.spyOn(i, 'handle').mockImplementation(async () => {}),
          );

          context.emit(event);

          await new Promise((resolve) => setTimeout(resolve, 100));

          for (const spy of spies) {
            const task = instances[spies.indexOf(spy)];

            expect(task.state.status).toEqual(TaskStatus.Success);
            expect(spy).toHaveBeenCalledTimes(1);
          }
        });
      });
    });
  });

  function findTask<T extends TaskConstructor>(type: T) {
    return extension.tasks.find((task) => task.name === type.name)! as InstanceType<T>;
  }
});
