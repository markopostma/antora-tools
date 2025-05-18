import type { ComponentDescriptor, ContentCatalog } from '@antora/content-classifier';
import { BaseTask } from '../../bases/base-task';

export class CreateComponentTask extends BaseTask<
  'contentClassified',
  { component: ComponentDescriptor }
> {
  override async handle(variables: { contentCatalog: ContentCatalog }) {
    const { contentCatalog } = variables;
    let component: ComponentDescriptor = contentCatalog.getComponent(this.config.name);

    const _attachmentPath = 'attachment$antora-tools-graphql::metadata.json' as const;
    const attachment = contentCatalog
      .getFiles()
      .find((f) => f.src.family === 'attachment' && f.src.component === 'antora-tools-graphql');
    console.log(attachment?._contents.toString('utf-8'));

    // Check whether a component already exists with the given name, if so throw Error.
    if (component) {
      throw new Error(
        `Component '${this.config.name}' already defined, therefor using the existing component.`,
      );
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
