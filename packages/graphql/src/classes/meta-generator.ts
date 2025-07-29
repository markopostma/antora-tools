import * as graphql from 'graphql';
import { type Microfiber } from 'microfiber';
import type { MetaConfig, MetaField, MetaInputObject, MetaObject } from '../interfaces';
import { GraphQLUtil, StringUtil } from '../utils';

export class MetaGenerator {
  static SCALAR_VALUES = {
    Boolean: true,
    Date: '01-01-1970',
    DateTime: '01-01-1970 00:00:00',
    Float: 123.45,
    ID: 'ac23e983-c67e-442c-9570-c3f2d40e5bf3',
    Int: 12345,
    String: 'Some string',
  };

  constructor(
    readonly microfiber: Microfiber,
    readonly metaFile: MetaConfig = {},
  ) {}

  json(type: graphql.IntrospectionType) {
    const isList = MetaGenerator.isList(type);
    const render = () => {
      switch (type.kind) {
        case graphql.TypeKind.INTERFACE:
        case graphql.TypeKind.OBJECT:
          return this.parseObject(type);
        case graphql.TypeKind.INPUT_OBJECT:
          return this.parseInputObject(type);
        case graphql.TypeKind.SCALAR:
          return this.renderScalar(type);
        case graphql.TypeKind.ENUM:
          return this.renderEnum(type);
        default:
          return type.name;
      }
    };
    const data = isList ? [render()] : render();
    const json = JSON.stringify(data, null, 2) ?? '';
    const matchArrays = [...(json.match(/\[\s*([^\[\]]*?)\s*\]/gm) ?? [])];

    return new StringUtil(json).transform(
      // Minifies arrays with just one entry.
      ...matchArrays.map((m) => (value: string) => {
        const arr: any[] = JSON.parse(m);

        return value.replace(m, arr.length >= 2 ? m : JSON.stringify(arr));
      }),
      (value) => value.replaceAll(/("_{3}\#\{|\}_{3}")/gm, ''),
    );
  }

  description(type: graphql.IntrospectionType) {
    if (type.kind === graphql.TypeKind.SCALAR) {
      return this.findNamedMeta(type)?.documentation?.description ?? type.description;
    }

    return type.description;
  }

  private parseObject(
    object: graphql.IntrospectionObjectType | graphql.IntrospectionInterfaceType,
  ) {
    const meta = this.findNamedMeta(object);

    return object.fields.reduce(
      (record, field) => ({
        ...record,
        [field.name]: this.renderField(
          field,
          meta ? this.findMetaField(meta, field.name) : undefined,
        ),
      }),
      {} as Record<string, any>,
    );
  }

  private parseInputObject(type: graphql.IntrospectionInputObjectType) {
    const meta = this.findNamedMeta(type);

    return type.inputFields.reduce(
      (record, field) => {
        record[field.name] = this.renderField(
          field,
          meta ? this.findMetaField(meta, field.name) : undefined,
        );
        return record;
      },
      {} as Record<string, any>,
    );
  }

  private renderField(
    field: graphql.IntrospectionField | graphql.IntrospectionInputValue,
    meta?: MetaField,
  ) {
    const isList = MetaGenerator.isList(field.type);
    const forced = meta?.documentation?.example;
    const underlying = GraphQLUtil.digUnderlying(field.type);
    const render = () => {
      switch (underlying.kind) {
        case graphql.TypeKind.OBJECT:
        case graphql.TypeKind.UNION:
          return this.renderLiteral(underlying);
        case graphql.TypeKind.ENUM:
          return this.renderEnum(underlying);
        case graphql.TypeKind.SCALAR:
          return this.renderScalar(underlying);
        default:
          return field.name;
      }
    };
    const value = forced ?? render();

    return isList && !Array.isArray(value) ? [value] : value;
  }

  private renderLiteral(object: { name: string }) {
    return `___#{${object.name}}___`;
  }

  private renderScalar(scalar: graphql.IntrospectionScalarType) {
    const indexName = scalar.name as keyof typeof MetaGenerator.SCALAR_VALUES;
    const metaExample = this.findNamedMeta(scalar)?.documentation?.example;
    const value = metaExample ?? MetaGenerator.SCALAR_VALUES[indexName];

    return value ?? this.renderLiteral(scalar);
  }

  private renderEnum(enumType: graphql.IntrospectionEnumType) {
    const metaExample = this.findNamedMeta(enumType)?.documentation?.example;
    const [enumValue] = this.microfiber.getType<graphql.IntrospectionEnumType>({
      kind: graphql.TypeKind.ENUM,
      name: enumType.name,
    }).enumValues;

    return metaExample ?? enumValue.name;
  }

  private findNamedMeta(type: graphql.IntrospectionType) {
    const underlying = GraphQLUtil.digUnderlying(type);
    const metaKind = this.metaFile[underlying.kind];

    if (metaKind) {
      return metaKind[type.name];
    }
  }

  private findMetaField<O extends MetaObject | MetaInputObject>(object: O, name: string) {
    if ('fields' in object) return object.fields![name];
    else if ('inputFields' in object) return object.inputFields![name];
  }

  private static isList(
    type:
      | graphql.IntrospectionType
      | graphql.IntrospectionNamedTypeRef
      | graphql.IntrospectionOutputTypeRef
      | graphql.IntrospectionInputTypeRef,
  ) {
    return GraphQLUtil.parseIntrospectionType(type as any).isList;
  }
}
