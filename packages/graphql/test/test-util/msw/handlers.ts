import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import * as graphql from 'graphql';
import { graphql as GraphQL, http, HttpResponse } from 'msw';
import { STATUS_CODES } from 'node:http';

export const forIntrospection = () => [
  GraphQL.query('IntrospectionQuery', async ({ query: source, variables: variableValues }) => {
    const { errors, data } = await graphql.graphql({
      source,
      variableValues,
      schema: await loadSchema('test/schemas/*.graphql', {
        loaders: [new GraphQLFileLoader()],
      }),
    });

    return HttpResponse.json({ data, errors });
  }),
];

export const withDefaultSchema = () => {
  return [
    http.all('*', async () => {
      const schema = await loadSchema('test/schemas/*.graphql', {
        loaders: [new GraphQLFileLoader()],
      });
      const printed = graphql.printSchema(schema);

      return HttpResponse.text(printed, {
        status: 200,
        statusText: STATUS_CODES[200],
      });
    }),
  ];
};

export const withStatus = (status: number, body: any = null) => {
  return [
    GraphQL.query('IntrospectionQuery', async () => {
      return HttpResponse.json(body, {
        status,
        statusText: STATUS_CODES[status],
      });
    }),
    http.all('*', async () => {
      return HttpResponse.json(body, {
        status,
        statusText: STATUS_CODES[status],
      });
    }),
  ];
};

export const withBearerAuthorization = () => {
  return [
    GraphQL.query(
      'IntrospectionQuery',
      async ({ query: source, variables: variableValues, request }) => {
        const authorizationHeader = request.headers.get('Authorization');

        if (authorizationHeader && /^bearer /.test(authorizationHeader)) {
          const { errors, data } = await graphql.graphql({
            source,
            variableValues,
            schema: await loadSchema('test/schemas/*.graphql', {
              loaders: [new GraphQLFileLoader()],
            }),
          });
          return HttpResponse.json(
            { data, errors },
            { status: 200, statusText: STATUS_CODES[200] },
          );
        }
        return HttpResponse.json(
          { errors: [new graphql.GraphQLError('Some error occurred')] },
          { status: 403, statusText: STATUS_CODES[403] },
        );
      },
    ),
  ];
};
