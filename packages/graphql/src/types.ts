import type { AntoraFile, AntoraPage, ComponentDescriptor } from '@antora/content-classifier';
import type * as graphql from 'graphql';
import type { ServiceContainer } from './classes/service-container';
import type { Config, ParsedIntrospection, Task } from './interfaces';
import type * as services from './services';

export type AdocLiteral = `${string}.adoc`;
export type FailedTask = Task & { state: Task['state'] & { error: Error } };
export type Services = Readonly<{
  LoggerService: services.LoggerService;
  IntrospectionService: services.IntrospectionService;
  MetaService: services.MetaService;
  TemplateService: services.TemplateService;
  TranslateService: services.TranslateService;
}>;
export type NamedMeta<N> = { [name: string]: N };
export type ParsableIntrospectionType =
  | graphql.IntrospectionInputTypeRef
  | graphql.IntrospectionListTypeRef
  | graphql.IntrospectionNamedTypeRef
  | graphql.IntrospectionNonNullTypeRef
  | graphql.IntrospectionOutputTypeRef
  | graphql.IntrospectionType;
export type TaskConstructor = {
  new (config: Config, services: ServiceContainer): Task;
};
export type CollectedData = {
  attachments: AntoraFile[];
  component: ComponentDescriptor;
  content: AntoraPage[];
  introspection: ParsedIntrospection;
};
export type Validation = {
  valid: boolean;
  message: string;
};
