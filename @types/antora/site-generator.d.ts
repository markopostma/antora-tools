declare module '@antora/site-generator' {
  import { ContentCatalog } from '@antora/content-classifier';
  import { Logger } from '@antora/logger';
  import { NavigationCatalog } from '@antora/navigation-builder';
  import { UiCatalog } from '@antora/ui-loader';
  import { EventEmitter } from 'node:events';

  /**
   * All events in chronological order.
   * @see https://docs.antora.org/antora/latest/extend/generator-events-reference/
   */
  type EventName =
    | 'register'
    | 'contextStarted'
    | 'playbookBuilt'
    | 'beforeProcess'
    | 'contentAggregated'
    | 'uiLoaded'
    | 'contentClassified'
    | 'documentsConverted'
    | 'navigationBuilt'
    | 'pagesComposed'
    | 'redirectsProduced'
    | 'siteMapped'
    | 'beforePublish'
    | 'sitePublished'
    | 'contextStopped'
    | 'contextClosed';

  export interface Playbook {
    antora: any;
    site: any;
    content: any;
    ui: any;
    asciidoc: any;
    git: any;
    network: any;
    runtime: any;
    urls: any;
    output: any;
    file: string;
    dir: string;
    env: any;
  }
  export type CustomConfig<T = any> = Readonly<T>;
  export type SiteAsciiDocConfig = Readonly<Record<string, any>>;
  export type SiteCatalog = Readonly<Record<string, any>>;
  export type Publications = Readonly<Record<string, any>>;
  export type ContentAggregate = any[];

  /**
   * Based on the official documentation provided by Antora:
   * @see https://docs.antora.org/antora/latest/extend/generator-events-reference/
   */
  export interface LifecycleMap {
    register: (variables: { playbook: Playbook; config: CustomConfig }) => void;
    contextStarted: (variables: { playbook: Playbook }) => void;
    playbookBuilt: (variables: { playbook: Playbook }) => void;
    beforeProcess: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
    }) => void;
    contentAggregated: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      contentAggregate: ContentAggregate;
    }) => void;
    uiLoaded: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uiCatalog: UiCatalog;
    }) => void;
    contentClassified: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
    }) => void;
    documentsConverted: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
    }) => void;
    navigationBuilt: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
      navigationCatalog: NavigationCatalog;
    }) => void;
    pagesComposed: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
    }) => void;
    redirectsProduced: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
    }) => void;
    siteMapped: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
    }) => void;
    beforePublish: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
    }) => void;
    sitePublished: (variables: {
      playbook: Playbook;
      siteAsciiDocConfig: SiteAsciiDocConfig;
      siteCatalog: SiteCatalog;
      uitCatalog: UiCatalog;
      contentCatalog: ContentCatalog;
      publications: Publications;
    }) => void;
    [name: string]: (...args: any[]) => void;
  }

  export type LifeCycleVariables<E extends EventName> = Parameters<LifecycleMap[E]>['0'];

  export type ContextVariables = {
    contentCatalog: ContentCatalog;
    navigationCatalog: NavigationCatalog;
    playbook: Playbook;
    publications: Publications;
    siteAsciiDocConfig: SiteAsciiDocConfig;
    siteCatalog: SiteCatalog;
    uiCatalog: UiCatalog;
  } & Record<string | symbol, any>;

  /**
   * @see https://gitlab.com/antora/antora/-/blob/main/packages/site-generator/lib/generator-context.js
   */
  export class GeneratorContext extends EventEmitter {
    static close(instance: GeneratorContext): Promise<void>;
    static isStopSignal(err: Error): boolean;
    static start(instance: GeneratorContext, playbook: Playbook): GeneratorContext;

    getFunctions(): Readonly<Record<string, any>>;
    getLogger(name?: string): Logger;
    getVariables(): ContextVariables;
    require(name: string): any;
    on<E extends EventName>(event: E, cb: LifecycleMap[E]): this;
    once<E extends EventName>(event: E, cb: LifecycleMap[E]): this;
    lockVariable(name: string | symbol): any;
    replaceFunctions(obj: any): Readonly<Record<string, any>>;
    removeVariable(name: string): any;
    stop(): any;
    updateVariables(obj: any): any;
  }
}
