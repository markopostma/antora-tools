import * as graphql from 'graphql';
import { Microfiber } from 'microfiber';
import { readFile } from 'node:fs/promises';
import { RequestOptions } from 'node:https';
import { BaseService } from '../bases/base-service';
import { EXTENSION_NPM, MIME_TYPES } from '../constants';
import { Strategy } from '../enums';
import type { Config } from '../interfaces';
import { GraphQLUtil } from '../utils';

export class IntrospectionService extends BaseService {
  readonly HEADERS = {
    'user-agent': EXTENSION_NPM,
    'content-type': MIME_TYPES.text,
  } as const satisfies RequestOptions['headers'];

  readonly name = 'IntrospectionService' as const;

  async load() {
    switch (this.config.strategy) {
      case Strategy.Url:
        return this.fromRemoteSchema();
      case Strategy.File:
        return this.fromSchema();
      case Strategy.Introspection:
        return this.fromIntrospection();
    }
  }

  /**
   * Load local schema from disk.
   */
  async fromSchema() {
    const paths = await IntrospectionService.glob(this.config.location);

    if (!paths.length)
      throw new Error(`No GraphQL files found for pattern ${this.config.location}`);

    const files = await Promise.all(paths.map((path) => readFile(path, 'utf-8')));
    const ast = GraphQLUtil.mergeAst(graphql.parse(files.join('\n')));

    return this.introspectionFromSchema(ast);
  }

  /**
   * Load remote schema from URL.
   */
  async fromRemoteSchema() {
    const response = await fetch(this.config.location, {
      headers: {
        ...this.HEADERS,
        ...this.parseHeaders(this.config.headers),
      },
    });
    if (!response.ok)
      throw new Error(`Failed to load schema (${response.status} ${response.statusText})`);

    return this.introspectionFromSchema(await response.text());
  }

  /**
   * Perform an introspection query on URL.
   */
  async fromIntrospection() {
    const query = graphql.getIntrospectionQuery({
      descriptions: true,
      schemaDescription: true,
    });
    const response = await fetch(this.config.location, {
      method: 'POST',
      body: JSON.stringify({ query, operationName: 'IntrospectionQuery' }),
      headers: {
        ...this.HEADERS,
        'content-type': MIME_TYPES.json,
        ...this.parseHeaders(this.config.headers),
      },
    });

    if (!response.ok)
      throw new Error(
        `Introspection failed with status ${response.status} ${response.statusText}.\n${await response.text()}`,
      );

    const { data } = (await response.json()) as {
      data: graphql.IntrospectionQuery;
    };
    const schema = graphql.buildClientSchema(data, { assumeValid: false });

    return this.introspectionFromSchema(schema);
  }

  private parseHeaders(headers: Config['headers'] = []) {
    return headers.reduce(
      (record, { name, value }) => ({ ...record, [name]: value }),
      {} as Record<string, string>,
    ) satisfies RequestOptions['headers'];
  }

  private introspectionFromSchema(source: string | graphql.GraphQLSchema) {
    const schema =
      source instanceof graphql.GraphQLSchema
        ? source
        : graphql.buildSchema(source, {
            assumeValid: false,
            assumeValidSDL: false,
          });

    return graphql.introspectionFromSchema(schema);
  }

  static createMicrofiber(introspection: graphql.IntrospectionQuery) {
    return new Microfiber(introspection, {
      fixQueryAndMutationAndSubscriptionTypes: true,
      removeUnusedTypes: true,
      cleanupSchemaImmediately: true,
      removeFieldsWithMissingTypes: true,
      removeArgsWithMissingTypes: true,
      removeInputFieldsWithMissingTypes: true,
      removePossibleTypesOfMissingTypes: true,
    });
  }

  private static async glob(pattern: string | string[]) {
    const { glob } = await import('node:fs/promises');
    const files: string[] = [];

    for await (const file of glob(pattern)) {
      files.push(file);
    }

    return files;
  }
}
