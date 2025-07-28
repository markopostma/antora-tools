import type { ComponentDescriptor, ContentCatalog } from '@antora/content-classifier';
import { BaseTask } from '../../bases/base-task';

export class CreateComponentTask extends BaseTask<
  'contentClassified',
  { component: ComponentDescriptor }
> {
  override async handle(variables: { contentCatalog: ContentCatalog }) {
    const { contentCatalog } = variables;
    let component: ComponentDescriptor = contentCatalog.getComponent(this.config.name);

    // Check whether a component already exists with the given name, if so throw Error.
    if (component) {
      throw new Error(`Component name '${this.config.name}' already in use.`);
    }

    // If the component does not exist register a new component with info provided in the config.
    // Return the new component.
    component = contentCatalog.registerComponentVersion(
      this.config.name,
      this.config.version,
      this.config,
    );

    return { component };
  }
}
