declare module '@antora/content-aggregator' {
  import { Playbook } from '@antora/site-generator';

  function aggregateContent(playbook: Playbook): Promise<any[]>;

  export = aggregateContent;
}
