declare module '@antora/content-classifier' {
  import { Stream } from 'node:stream';

  interface ComponentDescriptor {
    version: string;
    title: string;
    name: string;
    url?: string;
    displayVersion?: string;
    prerelease?: boolean | string;
    startPage?: boolean | string;
    asciidoc?: Record<string, any>;
    ext?: Record<string, any>;
    files: AntoraFile[];
  }

  interface FileDescriptor {
    type?: string;
    path?: string;
    contents: Buffer | Stream;
    src: {
      component: string;
      version: string;
      module: string;
      family: string;
      relative: string;
    };
    out?: {
      dirname: string;
      path: string;
      basename: string;
    };
  }

  interface AntoraFile extends File {
    path: string;
    history: string[];
    src: {
      component: string;
      version: string;
      module: string;
      family: string;
      relative: string;
      basename: string;
      extname: string;
      stem: string;
      mediaType: string;
      path: string;
    };
    out: {
      dirname: string;
      basename: string;
      path: string;
      moduleRootPath: string;
      rootPath: string;
    };
    asciidoc: {
      attributes: Record<string, string>;
      doctitle: string;
      xreftext: string;
      navtitle: string;
    };
    pub: {
      url: string;
      moduleRootPath: string;
      rootPath: string;
    };
    mediaType: string;
    stat: any;
    _contents: Buffer;
  }

  interface AntoraPage extends AntoraFile {
    src: AntoraFile['src'] & {
      family: 'page';
    };
  }

  /**
   * @TODO
   * @see https://gitlab.com/antora/antora/-/blob/main/packages/content-classifier/lib/content-catalog.js?ref_type=heads
   */
  class ContentCatalog {
    constructor(playbook: any);

    registerComponentVersion(
      name: string,
      version: string,
      descriptor?: Partial<ComponentDescriptor>,
    ): ComponentDescriptor;
    addFile(file: FileDescriptor, componentVersion?: string): AntoraFile;
    removeFile(file: any): boolean;
    findBy(criteria: Record<string, any>): AntoraFile[];
    getById(id: any): AntoraFile;
    getComponent(name: string): Required<ComponentDescriptor>;
    getComponentVersion(component: any, version: string): string;
    getComponents(): ComponentDescriptor[];
    getComponentsSortedBy(property: string): any[];
    getFiles(): AntoraFile[];
    getPages(filter?: (page: AntoraPage) => boolean): AntoraPage[];
    getSiteStartPage(): AntoraPage;
    registerComponentVersionStartPage(
      name: string,
      componentVersion: string,
      startPageSpec?: any,
    ): void;
    registerSiteStartPage(spec: any): void;
    registerPageAlias(spec: any, target: any): any;
    resolvePage(page: string): AntoraPage;
  }
}
