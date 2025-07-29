import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import * as graphql from 'graphql';
import { Microfiber } from 'microfiber';
import { MetaGenerator } from '../../src/classes/meta-generator';
import type { MetaConfig } from '../../src/interfaces';

describe('class MetaGenerator', () => {
  let introspectionQuery: graphql.IntrospectionQuery;
  let microfiber: Microfiber;
  let generator: MetaGenerator;

  beforeAll(async () => {
    introspectionQuery = graphql.introspectionFromSchema(
      await loadSchema('./test/schemas/*.graphql', {
        loaders: [new GraphQLFileLoader()],
      }),
    );
    microfiber = new Microfiber(introspectionQuery);
  });

  beforeEach(() => {
    generator = new MetaGenerator(microfiber);
  });

  it('creates', () => {
    expect(generator).toBeInstanceOf(MetaGenerator);
  });

  describe('json', () => {
    describe('OBJECT', () => {
      it('Product', () => {
        const lines = generator
          .json(microfiber.getType({ name: 'Product' }))
          .split('\n')
          .map((l) => l.trim().replace(/\,$/, ''));

        expect(lines.length).toEqual(9);
        expect(lines[1]).toEqual('"name": "Some string"');
        expect(lines[2]).toEqual('"dueDate": "01-01-1970"');
        expect(lines[3]).toEqual('"price": [123.45]');
        expect(lines[4]).toEqual('"soldItems": 12345');
        expect(lines[5]).toEqual('"releaseDate": "01-01-1970"');
        expect(lines[6]).toEqual('"unit": "IMPERIAL"');
        expect(lines[7]).toEqual('"releasedAt": "01-01-1970"');
      });

      it('Company with UNION', () => {
        const json = generator.json(
          microfiber.getType({
            kind: graphql.TypeKind.OBJECT,
            name: 'Company',
          }),
        );
        const lines = json.split('\n').map((l) => l.trim());

        expect(lines.length).toEqual(7);
        expect(lines[5]).toEqual('"belongsTo": Entity');
      });
    });

    describe('OBJECT with meta', () => {
      const meta = {
        OBJECT: {
          User: {
            fields: {
              fullName: {
                documentation: {
                  example: 'William Dykstra',
                },
              },
            },
          },
        },
      } satisfies MetaConfig;

      beforeEach(() => {
        generator = new MetaGenerator(microfiber, meta);
      });

      it('User', () => {
        const json = generator.json(
          microfiber.getType({ kind: graphql.TypeKind.OBJECT, name: 'User' }),
        );
        const lines = json.split('\n').map((l) => l.trim().replace(/\,$/, ''));

        expect(lines.length).toEqual(11);
        expect(lines[2]).toEqual('"fullName": "William Dykstra"');
      });
    });

    describe('SCALAR', () => {
      const scalarTypes = {
        String: 'Some string',
        Boolean: true,
        Float: 123.45,
        Int: 12345,
        ID: 'ac23e983-c67e-442c-9570-c3f2d40e5bf3',
        Date: '01-01-1970',
      };

      for (const [name, value] of Object.entries(scalarTypes)) {
        it(`default value for ${name}`, () => {
          const type = microfiber.getType({
            kind: graphql.TypeKind.SCALAR,
            name,
          });
          const json = JSON.parse(generator.json(type));

          expect(json).toEqual(value);
        });
      }

      it('unsupported custom scalar', () => {
        const type = microfiber.getType({
          kind: graphql.TypeKind.SCALAR,
          name: 'Email',
        });
        const json = generator.json(type);

        expect(json).toEqual('Email');
      });
    });

    describe('SCALAR with meta', () => {
      const meta = {
        SCALAR: {
          Email: {
            documentation: {
              example: 'some@email.com',
            },
          },
        },
      } satisfies MetaConfig;

      beforeEach(() => {
        generator = new MetaGenerator(microfiber, meta);
      });

      it('Email', () => {
        const json = generator.json(
          microfiber.getType({ kind: graphql.TypeKind.SCALAR, name: 'Email' }),
        );

        expect(json).toEqual('"some@email.com"');
      });
    });

    it('ENUM', () => {
      const json = JSON.parse(
        generator.json(
          microfiber.getType({
            kind: graphql.TypeKind.ENUM,
            name: 'MeasurementUnit',
          }),
        ),
      );

      expect(json).toEqual('IMPERIAL');
    });
  });

  describe('description', () => {
    const meta = {
      SCALAR: {
        String: {
          documentation: {
            description: 'OVERRIDDEN',
          },
        },
      },
    } satisfies MetaConfig;

    beforeEach(() => {
      generator = new MetaGenerator(microfiber, meta);
    });

    it('SCALAR returns description from metaFile', () => {
      const description = generator.description(
        microfiber.getType({ kind: graphql.TypeKind.SCALAR, name: 'String' }),
      );

      expect(description).toEqual('OVERRIDDEN');
    });

    it('SCALAR without meta returns description from schema', () => {
      const description = generator.description(
        microfiber.getType({ kind: graphql.TypeKind.SCALAR, name: 'Float' }),
      );

      expect(description?.startsWith('The `Float` scalar type represents')).toBeTruthy();
    });

    it('non SCALAR returns description from schema', () => {
      const description = generator.description(
        microfiber.getType({ kind: graphql.TypeKind.OBJECT, name: 'User' }),
      );

      expect(description).toEqual('Object type `User`.');
    });
  });
});
