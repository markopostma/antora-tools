import * as graphql from 'graphql';
import { BaseTask } from '../../bases/base-task';
import type { ParsedIntrospection } from '../../interfaces';
import { IntrospectionService } from '../../services/introspection-service';

export class IntrospectionTask extends BaseTask<
  'beforeProcess',
  { introspection: ParsedIntrospection }
> {
  async handle() {
    this.logger.trace(`Using ${this.config.strategy} introspection strategy`);

    const { location } = this.config;
    const introspectionService = new IntrospectionService(this.config);
    const introspectionQuery = await introspectionService.load();
    const schema = graphql.buildClientSchema(introspectionQuery);
    const microfiber = IntrospectionService.createMicrofiber(introspectionQuery);
    const [queryFields, mutationFields, subscriptionFields, directives, types] = [
      [...(microfiber.getQueryType()?.fields ?? [])],
      [...(microfiber.getMutationType()?.fields ?? [])],
      [...(microfiber.getSubscriptionType()?.fields ?? [])],
      microfiber.getDirectives() ?? [],
      microfiber.getAllTypes({ includeReserved: false }) ?? [],
    ];

    this.logger.trace(`Loaded schema from ${location}.`);

    return {
      introspection: {
        description: microfiber.schema.description!,
        directives: this.applyMutations(directives),
        mutations: this.applyMutations(mutationFields),
        queries: this.applyMutations(queryFields),
        subscriptions: this.applyMutations(subscriptionFields),
        types: this.applyMutations(types).map((type) => ({
          ...type,
          serialized: schema.getType(type.name),
        })),
        introspectionQuery,
        microfiber,
      } satisfies ParsedIntrospection,
    };
  }

  private applyMutations<
    T extends
      | graphql.IntrospectionType
      | graphql.IntrospectionField
      | graphql.IntrospectionDirective,
  >(types: T[]) {
    return types
      .filter(Boolean)
      .filter(({ name }) => !this.config.ignore.some((expr) => new RegExp(expr).test(name)));
  }
}
