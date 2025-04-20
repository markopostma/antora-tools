import * as graphql from 'graphql';
import { STATUS_CODES } from 'node:http';
import { join } from 'node:path';
import { DEFAULT_CONFIG } from '../../src/constants';
import { Strategy } from '../../src/enums';
import type { Config } from '../../src/interfaces';
import { IntrospectionService } from '../../src/services/introspection-service';
import { ArrayUtil, ObjectUtil } from '../../src/utils';
import { createGraphQLServer } from '../test-util/msw/graphql-server';

describe('IntrospectionService', () => {
  let service: IntrospectionService;

  const withDefaults = (config: Partial<Config>) => {
    return new IntrospectionService(ObjectUtil.deepMerge(DEFAULT_CONFIG, config));
  };

  describe.each([
    './test/schemas/*.graphql',
    'test/schemas/*.graphql',
    join(__dirname, '../schemas/*.graphql'),
  ])('fromSchema()', (location) => {
    it(location, async () => {
      service = withDefaults({ strategy: Strategy.File, location });

      assertIntrospection(await service.fromSchema());
    });
  });

  describe.each([
    'http://some-remote-host.com',
    'https://some-remote-host.com',
    'https://some-remote-host.com/schema',
  ])('fromRemoteSchema()', (location) => {
    createGraphQLServer.withRemoteDefaultSchema();

    it(location, async () => {
      service = withDefaults({
        strategy: Strategy.Url,
        location,
      });

      assertIntrospection(await service.fromRemoteSchema());
    });
  });

  describe.each([
    'http://some-remote-host.com',
    'https://some-remote-host.com',
    'https://some-remote-host.com/schema',
  ])('fromIntrospection()', (location) => {
    describe('200 OK', () => {
      createGraphQLServer.forIntrospection();

      it(location, async () => {
        service = withDefaults({
          strategy: Strategy.Introspection,
          location,
        });

        assertIntrospection(await service.fromIntrospection());
      });
    });

    for (const status of [400, 500]) {
      describe(`when ${status} ${STATUS_CODES[status]}`, () => {
        createGraphQLServer.withStatusCode(status);

        it(location, (done) => {
          service = withDefaults({
            strategy: Strategy.Introspection,
            location,
          });

          service.fromIntrospection().catch((err) => {
            expect(err?.message).toContain(
              `Introspection failed with status ${status} ${STATUS_CODES[status]}`,
            );
            done();
          });
        });
      });
    }
  });

  it('fromIntrospection() real URL', async () => {
    const url = 'https://spacex-production.up.railway.app';

    service = withDefaults({
      strategy: Strategy.Introspection,
      location: url,
    });

    const introspection = await service.fromIntrospection();

    expect(introspection.__schema.queryType.name).toEqual('Query');
    expect(introspection.__schema.mutationType?.name).toEqual('Mutation');
    expect(introspection.__schema.subscriptionType?.name).toEqual('Subscription');
    expect(introspection.__schema.types.length).toEqual(108);
    expect(introspection.__schema.directives.length).toEqual(17);
  }, 20000);

  function assertIntrospection(introspection: graphql.IntrospectionQuery) {
    assertProduct(introspection);
    assertUser(introspection);
    assertCompany(introspection);
    assertOperations(introspection);
  }

  function assertUser(introspection: graphql.IntrospectionQuery) {
    const { fields } = findType<graphql.IntrospectionObjectType>('User', introspection);

    assertFields(fields, [
      'dateOfBirth',
      'email',
      'emailConfirmed',
      'employer',
      'fax',
      'fullName',
      'height',
      'id',
      'products',
    ]);
  }

  function assertProduct(introspection: graphql.IntrospectionQuery) {
    const { fields } = findType<graphql.IntrospectionObjectType>('Product', introspection);

    assertFields(fields, [
      'dueDate',
      'name',
      'price',
      'releaseDate',
      'releasedAt',
      'soldItems',
      'unit',
    ]);
  }

  function assertCompany(introspection: graphql.IntrospectionQuery) {
    const { fields } = findType<graphql.IntrospectionObjectType>('Company', introspection);

    assertFields(fields, ['alias', 'belongsTo', 'email', 'emailConfirmed', 'employees']);
  }

  function assertOperations(introspection: graphql.IntrospectionQuery) {
    const query = introspection.__schema.queryType;
    const mutation = introspection.__schema.mutationType!;
    const subscription = introspection.__schema.subscriptionType!;

    expect(query.name).toEqual('Query');
    expect(mutation.name).toEqual('Mutation');
    expect(subscription.name).toEqual('Subscription');
  }

  function assertFields(actual: readonly graphql.IntrospectionField[], expected: string[]) {
    const fields = [...actual].sort(ArrayUtil.sortBy('name')).map((f) => f.name);

    expect(fields).toEqual(expected);
  }

  function findType<T extends graphql.IntrospectionType>(
    name: string,
    introspectionQuery: graphql.IntrospectionQuery,
    kind = graphql.TypeKind.OBJECT,
  ) {
    return introspectionQuery.__schema.types.find((t) => t.name === name && t.kind === kind) as T;
  }
});
