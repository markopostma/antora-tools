import { BaseTask } from '../../bases/base-task';
import { MetaGenerator } from '../../classes/meta-generator';
import { QueryGenerator } from '../../classes/query-generator';
import type { ParsedIntrospection } from '../../interfaces';
import type { CollectedData } from '../../types';

export class GenerateMetaTask extends BaseTask<
  'beforeProcess',
  { introspection: ParsedIntrospection }
> {
  async handle(_: any, data: CollectedData) {
    return {
      introspection: {
        ...data.introspection,
        ...this.handleTypes(data.introspection),
        ...this.handleOperations(data.introspection),
      },
    };
  }

  private handleTypes(introspection: ParsedIntrospection) {
    const { microfiber } = introspection;
    const generator = new MetaGenerator(microfiber, this.services.meta.getMetaFile());

    return {
      types: introspection.types.map((type) => ({
        ...type,
        codeExample: generator.json(type),
        description: generator.description(type),
      })),
    };
  }

  private handleOperations(introspection: ParsedIntrospection) {
    const { queries, mutations, subscriptions, microfiber } = introspection;
    const generator = new QueryGenerator(microfiber);
    const collections = [
      { fields: queries, id: 'query' },
      { fields: mutations, id: 'mutation' },
      { fields: subscriptions, id: 'subscription' },
    ] as const;

    collections.forEach(({ fields, id }) => {
      for (const field of fields) {
        Object.assign(field, {
          codeExample: generator.operation(field, id),
        });
      }
    });

    return {
      queries,
      mutations,
      subscriptions,
    };
  }
}
