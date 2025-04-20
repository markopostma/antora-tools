import type * as graphql from 'graphql';
import type { Microfiber } from 'microfiber';

export interface ParsedIntrospection {
  description?: string;
  directives: graphql.IntrospectionDirective[];
  introspectionQuery: graphql.IntrospectionQuery;
  mutations: graphql.IntrospectionField[];
  queries: graphql.IntrospectionField[];
  subscriptions: graphql.IntrospectionField[];
  types: graphql.IntrospectionType[];
  microfiber: Microfiber;
}
