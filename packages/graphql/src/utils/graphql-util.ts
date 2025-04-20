import * as graphql from 'graphql';
import { GRAPHQL_DESCRIPTIONS_REGEXP } from '../constants';
import { ParsableIntrospectionType } from '../types';

export class GraphQLUtil {
  static mergeAst(input: graphql.DocumentNode | string) {
    const { definitions } = typeof input === 'string' ? graphql.parse(input) : input;
    const typeDefs: Record<string, graphql.DefinitionNode> = {};
    const otherDefs: graphql.DefinitionNode[] = [];

    for (const def of definitions) {
      if ('name' in def && def.name && def.kind.endsWith('TypeDefinition')) {
        const name = def.name.value;
        const existing = typeDefs[name];

        if (!existing) typeDefs[name] = def;
        else {
          // Merge relevant properties: fields (for Object/Interface), values (Enum), types (Union)
          const mergedDef = { ...def };

          ['fields', 'values', 'types'].forEach((prop) => {
            if ((def as any)[prop] && (existing as any)[prop]) {
              (mergedDef as any)[prop] = [...(existing as any)[prop], ...(def as any)[prop]];
            }
          });

          typeDefs[name] = mergedDef;
        }
      } else {
        otherDefs.push(def);
      }
    }

    const mergedDoc: graphql.DocumentNode = {
      kind: graphql.Kind.DOCUMENT,
      definitions: [...otherDefs, ...Object.values(typeDefs)],
    };

    return graphql.print(mergedDoc);
  }

  static printType(type: graphql.GraphQLNamedType, { descriptions = true, args = true } = {}) {
    if (descriptions && args) return graphql.printType(type);

    return graphql.printType(type).replace(GRAPHQL_DESCRIPTIONS_REGEXP, '').trimStart();
  }

  static printSchema(schema: graphql.GraphQLSchema, { descriptions = true } = {}) {
    if (descriptions) return graphql.printSchema(schema);

    const introspection = graphql.introspectionFromSchema(schema, {
      descriptions: false,
    });

    return graphql.printSchema(graphql.buildClientSchema(introspection));
  }

  static parseIntrospectionType(input: ParsableIntrospectionType) {
    const isNonNull = [input.kind].includes(graphql.TypeKind.NON_NULL) && 'ofType' in input;
    const isNonNullListWithNonNull =
      isNonNull &&
      [input.ofType?.kind].includes(graphql.TypeKind.LIST) &&
      'ofType' in input.ofType &&
      [input.ofType?.ofType?.kind].includes(graphql.TypeKind.NON_NULL);
    const isListWithNonNull =
      [input.kind].includes(graphql.TypeKind.LIST) &&
      'ofType' in input &&
      [input.ofType.kind].includes(graphql.TypeKind.NON_NULL);
    const isList =
      [input.kind].includes(graphql.TypeKind.LIST) ||
      ('ofType' in input && [input.ofType?.kind].includes(graphql.TypeKind.LIST));
    const isDeepNonNull = isNonNullListWithNonNull || isListWithNonNull;

    return Object.freeze({
      isDeepNonNull,
      isList,
      isNonNull,
      underlying: this.digUnderlying(input),
    });
  }

  static digUnderlying(input: ParsableIntrospectionType) {
    const dig = (type: ParsableIntrospectionType) => {
      if ('ofType' in type && type.ofType !== null) {
        return dig(type.ofType);
      }
      return type;
    };

    return dig(input) as graphql.IntrospectionOutputType;
  }

  static readonly xref = {
    link(input: graphql.IntrospectionType) {
      const { kind, name } = GraphQLUtil.digUnderlying(input);

      return `xref:types/${kind}/${name}.adoc[]`;
    },

    format(input: graphql.IntrospectionType) {
      const { isList, isNonNull, isDeepNonNull } = GraphQLUtil.parseIntrospectionType(input);
      let xrefLink = this.link(input);

      if (isDeepNonNull) xrefLink = [xrefLink, '!'].join('');
      if (isList) xrefLink = `[${xrefLink}]`;
      if (isNonNull) xrefLink = [xrefLink, '!'].join('');

      return xrefLink;
    },
  } as const;
}
