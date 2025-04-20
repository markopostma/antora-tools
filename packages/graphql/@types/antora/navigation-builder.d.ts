// https://gitlab.com/antora/antora/-/blob/main/packages/navigation-builder/lib/navigation-catalog.js?ref_type=heads
declare module '@antora/navigation-builder' {
  export interface Tree {
    items: Tree[];
    content?: string;
    url?: string;
    urlType?: string;
    root?: boolean;
    order?: number;
  }

  export class NavigationCatalog {
    addTree(component: string, version: string, tree: Partial<Tree>): Tree;
    addNavigation(component: string, version: string, trees: Partial<Tree>[]): Tree[];
    getNavigation(component: string, version: string): Tree[];
  }
}
