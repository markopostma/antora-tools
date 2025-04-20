declare module 'microfiber' {
  import {
    IntrospectionDirective,
    IntrospectionField,
    IntrospectionObjectType,
    IntrospectionQuery,
    IntrospectionType,
    TypeKind,
  } from 'graphql';

  export const KINDS: typeof TypeKind;

  export interface MicrofiberConfig {
    fixQueryAndMutationAndSubscriptionTypes: boolean;
    removeUnusedTypes: boolean;
    removeFieldsWithMissingTypes: boolean;
    removeArgsWithMissingTypes: boolean;
    removeInputFieldsWithMissingTypes: boolean;
    removePossibleTypesOfMissingTypes: boolean;
    cleanupSchemaImmediately: boolean;
  }

  type MicrofiberOptions = Partial<MicrofiberConfig>;

  export class Microfiber {
    constructor(introspectionQuery: IntrospectionQuery, options?: MicrofiberOptions);

    readonly schema: IntrospectionType;

    getResponse(): IntrospectionQuery;
    setResponse(response: IntrospectionQuery): void;
    getAllTypes(options: {
      includeReserved?: boolean;
      includeQuery?: boolean;
      includeMutation?: boolean;
      includeSubscription?: boolean;
    }): IntrospectionType[];
    getType<R extends IntrospectionType>(params: { kind?: TypeKind; name?: string }): R;
    getDirectives(): IntrospectionDirective[];
    getDirective(): IntrospectionDirective;
    getQueryType(): IntrospectionObjectType;
    getQuery(): any;
    getMutationType(): IntrospectionObjectType;
    getMutation(params: { name: string }): any;
    getSubscriptionType(): IntrospectionObjectType;
    getSubscription(): any;
    getField(params: {
      typeKind?: TypeKind;
      typeName?: string;
      fieldName?: string;
    }): IntrospectionField;
    getInterfaceField(params: { typeName?: string; fieldName?: string }): IntrospectionField;
    removeField(params: {
      typeKind: TypeKind;
      typeName: string;
      fieldName: string;
      cleanup?: boolean;
    }): any;
  }
}
