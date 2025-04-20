import type { AntoraFile, AntoraPage, ContentCatalog } from '@antora/content-classifier';
import * as graphql from 'graphql';
import { BaseTask } from '../../bases/base-task';
import { SORTING } from '../../constants';
import type { ParsedIntrospection } from '../../interfaces';
import { TemplateService } from '../../services/template-service';
import type { AdocLiteral, CollectedData } from '../../types';
import { ArrayUtil, NumberUtil, StringUtil } from '../../utils';

export class AddPagesTask extends BaseTask<'contentClassified', { content: AntoraPage[] }> {
  private templateService!: TemplateService;

  async handle(variables: { contentCatalog: ContentCatalog }, data: CollectedData) {
    this.templateService = this.services.template;

    const { contentCatalog } = variables;
    const [_, schemaFile, schemaNoCommentsFile, introspectionFile] = data.attachments;
    const content = await Promise.all([
      ...this.addPagesFor(
        data.introspection.types,
        (type) => `types/${type.kind.toLowerCase()}.adoc`,
        (type) => `types/${type.kind}`,
        contentCatalog,
      ),
      ...this.addPagesFor(
        data.introspection.queries,
        () => 'operations/query.adoc',
        () => 'queries',
        contentCatalog,
      ),
      ...this.addPagesFor(
        data.introspection.mutations,
        () => 'operations/mutation.adoc',
        () => 'mutations',
        contentCatalog,
      ),
      ...this.addPagesFor(
        data.introspection.subscriptions,
        () => 'operations/subscription.adoc',
        () => 'subscriptions',
        contentCatalog,
      ),
      ...this.addPagesFor(
        data.introspection.directives,
        () => 'directive.adoc',
        () => 'directives',
        contentCatalog,
      ),
    ]);

    const home = await this.addHomePage(contentCatalog, content, data);
    const tools = await this.addToolsPage(
      contentCatalog,
      schemaFile,
      schemaNoCommentsFile,
      introspectionFile,
    );

    // Register a start page and set is as the start_page of the newly created component.
    contentCatalog.registerComponentVersionStartPage(
      this.config.name,
      this.config.version,
      [this.config.name, 'index.adoc'].join('::'),
    );

    // Add the homepage as first page.
    content.unshift(home);

    // Push other pages.
    content.push(tools);

    return { content };
  }

  private addPagesFor(
    array: Array<
      graphql.IntrospectionField | graphql.IntrospectionType | graphql.IntrospectionDirective
    >,
    getTemplate: (type: graphql.IntrospectionType) => AdocLiteral,
    getPrefix: (type: graphql.IntrospectionType) => string,
    contentCatalog: ContentCatalog,
  ) {
    return array.map(async (item) => {
      const template = getTemplate(item as graphql.IntrospectionType);
      const prefix = getPrefix(item as graphql.IntrospectionType);
      const title = prefix === 'directives' ? `@${item.name}` : item.name;
      const contents = await this.templateService.render(template, {
        data: {
          ...item,
          title,
          description: item.description,
          config: { ...this.config },
        },
      });

      return this.addPage(`${prefix}/${item.name}.adoc`, contents, contentCatalog);
    });
  }

  private async addHomePage(
    contentCatalog: ContentCatalog,
    content: AntoraPage[],
    data: { introspection: ParsedIntrospection },
  ) {
    return this.addPage(
      'index.adoc',
      await this.templateService.render('index.adoc', {
        data: {
          title: this.config.title,
          intro: this.config.intro ?? data.introspection.description,
          indexPages: this.renderIndexPages(content),
          config: { ...this.config },
        },
      }),
      contentCatalog,
    );
  }

  private async addToolsPage(
    contentCatalog: ContentCatalog,
    schemaFile: AntoraFile,
    schemaNoCommentsFile: AntoraFile,
    introspectionFile: AntoraFile,
  ) {
    const createLink = (path: string) => `xref:attachment$${path}[${path},window=_blank]`;

    return this.addPage(
      'tools.adoc',
      await this.templateService.render('tools.adoc', {
        data: {
          downloads: [
            {
              size: new NumberUtil(schemaFile._contents.length).formatBytes(),
              link: createLink('schema.graphql'),
            },
            {
              size: new NumberUtil(schemaNoCommentsFile._contents.length).formatBytes(),
              link: createLink('schema-no-comments.graphql'),
            },
            {
              size: new NumberUtil(introspectionFile._contents.length).formatBytes(),
              link: createLink('introspection.json'),
            },
          ],
          config: { ...this.config },
        },
      }),
      contentCatalog,
    );
  }

  private renderIndexPages(pages: AntoraPage[]) {
    const groups = new ArrayUtil(pages).groupBy((c) => {
      const [first, second] = c.path.split('/').map((p) => p.trim()) as (typeof SORTING)[number][];

      return first === 'types' ? second : first;
    });

    return (Object.keys(groups) as (typeof SORTING)[number][])
      .sort((a, b) => SORTING.indexOf(a) - SORTING.indexOf(b))
      .map((key) =>
        [
          `[.index-page-group]\n== ${new StringUtil(key).titleCase()}`,
          groups[key]
            .sort(ArrayUtil.sortBy('path'))
            .map((page) => `- xref:${page.path}[]`)
            .join('\n'),
        ].join('\n\n'),
      )
      .join('\n\n');
  }
}
