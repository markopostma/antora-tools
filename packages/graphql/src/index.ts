import type { GeneratorContext, Playbook } from '@antora/site-generator';
import { AntoraExtension } from './classes/antora-extension';
import type { Config, MultiConfig } from './interfaces';

export function register(
  context: GeneratorContext,
  variables: { config: MultiConfig | Config; playbook: Playbook },
) {
  if ('components' in variables.config) {
    for (const config of variables.config.components) {
      new AntoraExtension(context, { ...variables, config });
    }
  } else {
    new AntoraExtension(context, { ...variables, config: variables.config });
  }
}
