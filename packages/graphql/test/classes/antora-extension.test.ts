import type { GeneratorContext, Playbook } from '@antora/site-generator';
import { AntoraExtension } from '../../src/classes/antora-extension';
import { DEFAULT_CONFIG } from '../../src/constants';
import { Strategy, TaskStatus } from '../../src/enums';
import { Config } from '../../src/interfaces';
import { GenerateMetaTask } from '../../src/tasks/before-process/generate-meta.task';
import { IntrospectionTask } from '../../src/tasks/before-process/introspection.task';
import { ValidateTask } from '../../src/tasks/before-process/validate.task';
import { AddAttachmentsTask } from '../../src/tasks/content-classified/add-attachments.task';
import { AddPagesTask } from '../../src/tasks/content-classified/add-pages.task';
import { CreateComponentTask } from '../../src/tasks/content-classified/create-component.task';
import { AttachResultsTask } from '../../src/tasks/navigation-built/attach-results.task';
import { NavigationTask } from '../../src/tasks/navigation-built/navigation.task';
import { TaskConstructor } from '../../src/types';
import { ObjectUtil } from '../../src/utils';
import { MockGeneratorContext } from '../test-util/mock-generator-context';

describe('class AntoraExtension', () => {
  let context: GeneratorContext;
  let extension: AntoraExtension;

  describe('by default when LOCAL', () => {
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
        tasks: [ValidateTask, IntrospectionTask, GenerateMetaTask],
      },
      {
        event: 'contentClassified',
        tasks: [CreateComponentTask, AddPagesTask, AddAttachmentsTask],
      },
      {
        event: 'navigationBuilt',
        tasks: [NavigationTask, AttachResultsTask],
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

            expect(spy).toHaveBeenCalledTimes(1);
            expect(task.state.status).toEqual(TaskStatus.Success);
          }
        });
      });
    });
  });

  function findTask<T extends TaskConstructor>(type: T) {
    return extension.tasks.find((task) => task.name === type.name)! as InstanceType<T>;
  }
});
