import aggregateContent from '@antora/content-aggregator';
import { AntoraFile } from '@antora/content-classifier';
import type { GeneratorContext, Playbook } from '@antora/site-generator';
import { AntoraExtension } from './classes/antora-extension';
import { EXTENSION_CAMELIZED } from './constants';
import type { Config, MetaConfig, MultiConfig } from './interfaces';

export function register(
  context: GeneratorContext,
  variables: { config: MultiConfig | Config; playbook: Playbook },
) {
  context.once('contextStarted', async () => forContent(context, variables));
}

async function forContent(
  context: GeneratorContext,
  variables: { config: MultiConfig | Config; playbook: Playbook },
) {
  const components = await aggregateContent(variables.playbook);

  components
    .filter(({ ext }) => !!ext && EXTENSION_CAMELIZED in ext)
    .map((content) => {
      console.log(content.files.map((file) => file.path));

      return loadMultiConfig(content.ext![EXTENSION_CAMELIZED]).map(
        (config) =>
          [
            config,
            config.metaFile ? parseMetaFile(content.files, config.metaFile) : undefined,
          ] as const,
      );
    })
    .flat()
    .forEach(([config, metaConfig]) => {
      new AntoraExtension(context, { ...variables, config }, metaConfig);
    });
}

function parseMetaFile(files: AntoraFile[], name: string) {
  return JSON.parse(
    files.find((f) => f.path === name)?._contents?.toString('utf-8') ?? '{}',
  ) as MetaConfig;
}

function loadMultiConfig(multi: Config | MultiConfig): Config[] {
  return 'components' in multi ? multi.components : [multi];
}
