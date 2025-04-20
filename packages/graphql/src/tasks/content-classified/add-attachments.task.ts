import type { AntoraFile, ContentCatalog } from '@antora/content-classifier';
import * as graphql from 'graphql';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BaseTask } from '../../bases/base-task';
import { TEMPLATES_PATH } from '../../constants';
import type { CollectedData } from '../../types';
import { GraphQLUtil } from '../../utils';

export class AddAttachmentsTask extends BaseTask<
  'contentClassified',
  { attachments: AntoraFile[] }
> {
  async handle(variables: { contentCatalog: ContentCatalog }, data: CollectedData) {
    const { introspectionQuery } = data.introspection;
    const { contentCatalog } = variables;
    const attachments = [
      this.addAttachment(
        'css/style.css',
        await this.getRelativeAttachment('css/style.css'),
        contentCatalog,
      ),
      this.addAttachment(
        'schema.graphql',
        Buffer.from(GraphQLUtil.printSchema(graphql.buildClientSchema(introspectionQuery))),
        contentCatalog,
      ),
      this.addAttachment(
        'schema-no-comments.graphql',
        Buffer.from(
          GraphQLUtil.printSchema(graphql.buildClientSchema(introspectionQuery), {
            descriptions: false,
          }),
        ),
        contentCatalog,
      ),
      this.addAttachment(
        'introspection.json',
        Buffer.from(JSON.stringify(introspectionQuery, null, 2)),
        contentCatalog,
      ),
    ];

    return { attachments };
  }

  private async getRelativeAttachment(path: string) {
    return readFile(join(TEMPLATES_PATH, 'attachments', path));
  }
}
