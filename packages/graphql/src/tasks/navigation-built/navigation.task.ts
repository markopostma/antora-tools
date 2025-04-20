import type { AntoraPage } from '@antora/content-classifier';
import type { Tree } from '@antora/navigation-builder';
import type { LifeCycleVariables } from '@antora/site-generator';
import { BaseTask } from '../../bases/base-task';
import { SORTING } from '../../constants';
import type { CollectedData } from '../../types';
import { ArrayUtil, StringUtil } from '../../utils';

export class NavigationTask extends BaseTask<'navigationBuilt'> {
  async handle(variables: LifeCycleVariables<'navigationBuilt'>, data: CollectedData) {
    return variables.navigationCatalog.addNavigation(
      this.config.name,
      this.config.version,
      this.createNav(data.content),
    );
  }

  private createNav(pages: AntoraPage[]): Tree[] {
    const without = (p: AntoraPage) => !['tools.adoc', 'index.adoc'].includes(p.src.relative);

    return [
      ...this.getEntries(pages.filter(without)).map(([pageType, entries]) => ({
        content: new StringUtil(pageType).titleCase(),
        items: this.mapPageTypes(pageType, entries.sort(ArrayUtil.sortBy('path'))),
      })),
      this.createToolsNav(pages),
    ];
  }

  private mapPageTypes(pageType: string, pages: AntoraPage[]): Tree[] {
    if (pageType !== 'types') return pages.map(this.mapPageToTree.bind(this));

    const groups = new ArrayUtil(pages).groupBy(this.getPageType(1));

    return Object.entries(groups)
      .sort(this.sortLiteral([...SORTING] as string[]))
      .map(([content, entries]) => ({
        content,
        items: entries.sort(ArrayUtil.sortBy('path')).map(this.mapPageToTree.bind(this)),
      }));
  }

  private mapPageToTree(page: AntoraPage): Tree {
    return {
      content: page.src.stem,
      url: page.pub.url,
      items: [],
      urlType: 'internal',
    };
  }

  private getEntries(pages: AntoraPage[]) {
    const pageTypes = new ArrayUtil(pages).groupBy(this.getPageType());

    return Object.entries(pageTypes).sort(this.sortLiteral([...SORTING] as string[]));
  }

  private createToolsNav(pages: AntoraPage[]) {
    const toolsPage = pages.find((page) => page.src.relative === 'tools.adoc')!;

    return {
      content: 'Tools',
      urlType: 'internal',
      items: [],
      url: toolsPage.pub.url,
    } as const satisfies Tree;
  }

  private getPageType(depth = 0) {
    return (p: AntoraPage) => p.src.relative.split('/')[depth]!;
  }

  private sortLiteral<T>(order: T[]) {
    return (
      a: [n: (typeof order)[number], e: AntoraPage[]],
      b: [n: (typeof order)[number], e: AntoraPage[]],
    ) => order.indexOf(a[0]) - order.indexOf(b[0]);
  }
}
