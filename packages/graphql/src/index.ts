import type { GeneratorContext, Playbook } from '@antora/site-generator';
import { AntoraExtension } from './classes/antora-extension';
import type { MultiConfig } from './types';

export function register(
  context: GeneratorContext,
  variables: { config: MultiConfig; playbook: Playbook },
) {
  if ('components' in variables.config && Array.isArray(variables.config.components)) {
    for (const config of variables.config.components) {
      new AntoraExtension(context, { ...variables, config });
    }
  } else {
    new AntoraExtension(context, { ...variables, config: variables.config });
  }
}
