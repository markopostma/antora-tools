import { NamedMeta } from '../types';

export interface MetaDocumentation {
  description?: string;
  example?: any;
}

export interface MetaField {
  args?: NamedMeta<MetaField>;
  documentation?: MetaDocumentation;
}

export interface MetaObject {
  documentation?: MetaDocumentation;
  fields?: NamedMeta<MetaField>;
}

export interface MetaInputObject {
  documentation?: MetaDocumentation;
  inputFields?: NamedMeta<MetaField>;
}

export interface MetaFile {
  ENUM?: NamedMeta<{ documentation?: MetaDocumentation }>;
  INPUT_OBJECT?: NamedMeta<MetaInputObject>;
  INTERFACE?: NamedMeta<MetaObject>;
  OBJECT?: NamedMeta<MetaObject>;
  SCALAR?: NamedMeta<{ documentation?: MetaDocumentation }>;
  UNION?: NamedMeta<{ documentation?: MetaDocumentation }>;
  LOCALE?: Record<string, string>;
}
