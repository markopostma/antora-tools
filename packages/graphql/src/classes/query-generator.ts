import * as graphql from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query';
import { Microfiber } from 'microfiber';
import { GraphQLUtil } from '../utils';

export class QueryGenerator {
  constructor(readonly microfiber: Microfiber) {}

  operation(
    field: graphql.IntrospectionField,
    operationName: 'query' | 'mutation' | 'subscription',
  ) {
    const returnType = GraphQLUtil.digUnderlying(field.type);
    const ast = this.handleType(returnType);
    const { variables, args } = QueryGenerator.parseInputValues([...(field.args ?? [])]);

    return QueryGenerator.format(
      jsonToGraphQLQuery({
        [`${operationName} ${field.name}`]: {
          __variables: variables,
          [field.name]: { __args: args, ...ast },
        },
      }),
    );
  }

  private handleType(outputType: graphql.IntrospectionOutputType) {
    const type = this.microfiber.getType({
      kind: outputType.kind as graphql.TypeKind,
      name: outputType.name,
    });

    switch (type.kind) {
      case graphql.TypeKind.UNION:
        return this.renderUnion(type);
      default:
        return this.parseFields([...((type as graphql.IntrospectionObjectType).fields ?? [])]);
    }
  }

  private parseFields(fields: graphql.IntrospectionField[]) {
    return fields.reduce(
      (record, field) => {
        const underlying = GraphQLUtil.digUnderlying(field.type);

        switch (underlying.kind) {
          case graphql.TypeKind.OBJECT:
            record[field.name] = { __all_on: [underlying.name + 'Fragment'] };
            break;
          case graphql.TypeKind.UNION: {
            const { possibleTypes } = this.microfiber.getType<graphql.IntrospectionUnionType>({
              kind: graphql.TypeKind.UNION,
              name: underlying.name,
            });
            record[field.name] = {
              __all_on: possibleTypes.map((t) => t.name + 'Fragment'),
            };
            break;
          }
          default:
            record[field.name] = true;
        }
        return record;
      },
      {} as Record<string, any>,
    );
  }

  private renderUnion(type: graphql.IntrospectionUnionType) {
    const { possibleTypes } = this.microfiber.getType<graphql.IntrospectionUnionType>({
      kind: graphql.TypeKind.UNION,
      name: type.name,
    });

    return possibleTypes.reduce(
      (record, curr) => {
        const { fields } = this.microfiber.getType<graphql.IntrospectionObjectType>({
          kind: curr.kind as graphql.TypeKind,
          name: curr.name,
        });

        record.__on.push({
          __typeName: curr.name,
          ...this.parseFields([...(fields ?? [])]),
        });
        return record;
      },
      { __on: [] } as { __on: any[] },
    );
  }

  private static format(body: string) {
    const source = new graphql.Source(body);
    const astNode = graphql.parse(source);

    return graphql.print(astNode);
  }

  private static parseInputValues(inputs: graphql.IntrospectionInputValue[]) {
    const variables: Record<string, any> = {};
    const args: Record<string, any> = {};

    for (const { name, type, defaultValue } of inputs ?? []) {
      variables[name] = QueryGenerator.formatInputType(type, defaultValue);
      args[name] = new VariableType(name);
    }

    return { variables, args };
  }

  private static formatInputType(
    type: graphql.IntrospectionType | graphql.IntrospectionInputTypeRef,
    defaultValue: string | Maybe<string>,
  ) {
    const { underlying, isList, isNonNull, isDeepNonNull } =
      GraphQLUtil.parseIntrospectionType(type);
    const hasDefault = !!defaultValue;
    let formatted: string = underlying.name;

    if (isDeepNonNull) formatted = [formatted, '!'].join('');
    if (isList) formatted = ['[', formatted, ']'].join('');
    if (isNonNull) formatted = [formatted, '!'].join('');
    if (hasDefault) formatted += ` = ${defaultValue}`;

    return formatted;
  }
}
