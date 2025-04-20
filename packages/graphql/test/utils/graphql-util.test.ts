import * as graphql from 'graphql';
import { GraphQLUtil } from '../../src/utils';

describe('GraphQLUtil', () => {
  describe('xref', () => {
    describe('format', () => {
      describe.each([
        {
          input: {
            name: 'String',
            kind: graphql.TypeKind.SCALAR,
          } satisfies graphql.IntrospectionType,
          expected: 'xref:types/SCALAR/String.adoc[]',
        },
      ])('input', ({ input, expected }) => {
        it(`${expected}`, () => {
          const result = GraphQLUtil.xref.format(input);

          expect(result).toEqual(expected);
        });
      });
    });
  });

  describe('mergeAst', () => {
    it('merges a object with type duplicates', () => {
      const input = [
        'type User {',
        'name: String',
        '}',
        'type User {',
        'password: String',
        '}',
      ].join('\n');
      const document = graphql.parse(input);
      const ast = GraphQLUtil.mergeAst(document);
      const schema = graphql.buildSchema(ast);
      const objectType = schema.getType('User') as graphql.GraphQLObjectType;
      const fields = objectType.getFields();

      expect(typeof ast).toEqual('string');
      expect(objectType).toBeInstanceOf(graphql.GraphQLObjectType);
      expect(fields['name']).toBeTruthy();
      expect(fields['password']).toBeTruthy();
    });

    it('merges an input with type duplicates', () => {
      const input = [
        'input Filter {',
        'name: String',
        '}',
        'input Filter {',
        'query: String',
        '}',
      ].join('\n');
      const document = graphql.parse(input);
      const ast = GraphQLUtil.mergeAst(document);
      const schema = graphql.buildSchema(ast);
      const inputObjectType = schema.getType('Filter') as graphql.GraphQLInputObjectType;
      const fields = inputObjectType.getFields();

      expect(typeof ast).toEqual('string');
      expect(inputObjectType).toBeInstanceOf(graphql.GraphQLInputObjectType);
      expect(fields['name']).toBeTruthy();
      expect(fields['query']).toBeTruthy();
    });
  });
});
