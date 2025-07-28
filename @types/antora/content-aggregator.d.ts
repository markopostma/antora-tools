declare module '@antora/content-aggregator' {
  import { ComponentDescriptor } from '@antora/content-classifier';
  import { Playbook } from '@antora/site-generator';

  function aggregateContent(playbook: Playbook): Promise<ComponentDescriptor[]>;

  export = aggregateContent;
}
