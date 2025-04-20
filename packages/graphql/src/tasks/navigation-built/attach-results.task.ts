import type { AntoraPage, ContentCatalog } from '@antora/content-classifier';
import { BaseTask } from '../../bases/base-task';
import type { CollectedData } from '../../types';

export class AttachResultsTask extends BaseTask<'navigationBuilt', { attachments: any[] }> {
  override async handle(variables: { contentCatalog: ContentCatalog }, data: CollectedData) {
    const mapped = data.content.map((page: AntoraPage) => page.out) ?? [];

    return {
      attachments: [
        ...data.attachments,
        this.addAttachment(
          'result.json',
          Buffer.from(JSON.stringify(mapped, null, 2)),
          variables.contentCatalog,
        ),
      ],
    };
  }
}
