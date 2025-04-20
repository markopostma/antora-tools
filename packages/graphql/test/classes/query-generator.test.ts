import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { introspectionFromSchema, IntrospectionQuery } from 'graphql';
import { Microfiber } from 'microfiber';
import { QueryGenerator } from '../../src/classes/query-generator';

describe('class QueryGenerator', () => {
  let introspectionQuery: IntrospectionQuery;
  let microfiber: Microfiber;
  let generator: QueryGenerator;

  beforeAll(async () => {
    introspectionQuery = introspectionFromSchema(
      await loadSchema('./test/schemas/*.graphql', {
        loaders: [new GraphQLFileLoader()],
      }),
    );
    microfiber = new Microfiber(introspectionQuery);
    generator = new QueryGenerator(microfiber);
  });

  it('creates', () => {
    expect(generator).toBeInstanceOf(QueryGenerator);
  });

  describe('query', () => {
    it('OBJECT without variables', async () => {
      const query = generator.operation(
        microfiber.getQueryType().fields.find((f) => f.name === 'products')!,
        'query',
      );
      const lines = query.split('\n').map((l) => l.trimStart());

      expect(lines.length).toEqual(11);
      expect(lines[0]).toEqual('query products {');
      expect(lines[1]).toEqual('products {');
      expect(lines[2]).toEqual('name');
      expect(lines[3]).toEqual('dueDate');
      expect(lines[4]).toEqual('price');
      expect(lines[5]).toEqual('soldItems');
      expect(lines[6]).toEqual('releaseDate');
      expect(lines[7]).toEqual('unit');
      expect(lines[8]).toEqual('releasedAt');
      expect(lines[9]).toEqual('}');
      expect(lines[10]).toEqual('}');
    });

    it('OBJECT with variables', async () => {
      const query = generator.operation(
        microfiber.getQueryType().fields.find((f) => f.name === 'product')!,
        'query',
      );
      const lines = query.split('\n').map((l) => l.trimStart());

      expect(lines.length).toEqual(11);
      expect(lines[0]).toEqual('query product($id: ID!) {');
      expect(lines[1]).toEqual('product(id: $id) {');
      expect(lines[2]).toEqual('name');
      expect(lines[3]).toEqual('dueDate');
      expect(lines[4]).toEqual('price');
      expect(lines[5]).toEqual('soldItems');
      expect(lines[6]).toEqual('releaseDate');
      expect(lines[7]).toEqual('unit');
      expect(lines[8]).toEqual('releasedAt');
      expect(lines[9]).toEqual('}');
      expect(lines[10]).toEqual('}');
    });
  });

  describe('mutation', () => {
    it('SCALAR', () => {
      const mutation = generator.operation(
        microfiber.getMutationType().fields.find((f) => f.name === 'create')!,
        'mutation',
      );
      const lines = mutation.split('\n').map((l) => l.trimStart());

      expect(lines.length).toEqual(3);
      expect(lines[0]).toEqual('mutation create($product: CreateProduct!) {');
      expect(lines[1]).toEqual('create(product: $product)');
    });

    it('OBJECT', () => {
      const mutation = generator.operation(
        microfiber.getMutationType().fields.find((f) => f.name === 'update')!,
        'mutation',
      );
      const lines = mutation.split('\n').map((l) => l.trimStart());

      expect(lines.length).toEqual(11);
      expect(lines[0]).toEqual('mutation update($product: UpdateProduct!) {');
      expect(lines[1]).toEqual('update(product: $product) {');
    });
  });

  describe('subscription', () => {
    it('OBJECT', async () => {
      const query = generator.operation(
        microfiber.getSubscriptionType().fields.find((f) => f.name === 'search')!,
        'subscription',
      );
      const lines = query.split('\n').map((l) => l.trimStart());

      expect(lines.length).toEqual(11);
      expect(lines[0]).toEqual('subscription search($query: String!) {');
      expect(lines[1]).toEqual('search(query: $query) {');
    });
  });
});
