import { BaseTask } from '../../bases/base-task';
import { Locale, LogLevel, Strategy } from '../../enums';
import type { Config } from '../../interfaces';
import type { Validation } from '../../types';

export class ValidateTask extends BaseTask {
  async handle() {
    const invalid = this.validate();

    if (invalid.length) {
      const message = [
        'Error:\n    Config validation failed:',
        ...invalid.map((validation) => '\t- ' + validation.message),
      ].join('\n');

      throw new Error(message);
    }
  }

  private validate() {
    const { assertEnum, assertString, assertExtraProps } = this;
    const optional = this.optional.bind(this);
    const validations: Validation[] = [
      // Strict property checking
      assertExtraProps(this.config),
      // Mandatory
      assertString('location', this.config.location, 1),
      assertEnum('strategy', this.config.strategy, Strategy),
      // Optional
      optional('displayVersion').string(1),
      optional('headers').array(),
      optional('ignore').array(1),
      optional('includeStyles').boolean(),
      optional('intro').string(1),
      optional('locale').enum(Locale),
      optional('logLevel').enum(LogLevel),
      optional('metaFile').string(1),
      optional('name').string(1),
      optional('title').string(1),
      optional('version').string(),
    ]
      .flat()
      .filter(Boolean);

    return validations.filter(({ valid }) => !valid);
  }

  private assertEnum<T extends Record<string, any>>(
    prop: keyof Config,
    value: T[string],
    enumerator: T,
  ) {
    const enumValues = Object.values(enumerator);

    return {
      valid: enumValues.includes(value),
      message: `${prop} has an unexpected value, allowed values: ${enumValues.join(', ')}. Actual: ${value}.`,
    } satisfies Validation;
  }

  private assertString(prop: keyof Config, value: string, minLength = 0) {
    return [
      {
        valid: typeof value === 'string',
        message: `${prop} is expected to be of type string. Actual type: ${typeof value}.`,
      },
      {
        valid: value?.length >= minLength,
        message: `${prop} is expected to have a minimum length of ${minLength}. Actual length: ${value?.length}.`,
      },
    ] satisfies Validation[];
  }

  private assertArray(prop: keyof Config, value: any[], minLength = 0) {
    return [
      {
        valid: Array.isArray(value),
        message: `${prop} is expected to be an array. Actual type: ${typeof value}.`,
      },
      {
        valid: value?.length >= minLength,
        message: `${prop} is expected to have a minimum length of ${minLength}.`,
      },
    ] satisfies Validation[];
  }

  private assertBoolean(prop: keyof Config, value: boolean) {
    return {
      valid: typeof value === 'boolean',
      message: `${prop} is expected to be of type boolean. Actual type: ${typeof value}.`,
    } satisfies Validation;
  }

  private assertExtraProps(config: Config) {
    const {
      displayVersion,
      headers,
      ignore,
      includeStyles,
      intro,
      locale,
      location,
      logLevel,
      metaFile,
      name,
      strategy,
      title,
      version,
      ...rest
    } = config;

    return {
      valid: Object.keys(rest).length === 0,
      message: `Config has unexpected properties: ${Object.keys(rest).join(', ')}`,
    } satisfies Validation;
  }

  private optional(prop: keyof Config) {
    const value = this.config[prop];
    const notNull = value !== undefined && value !== null;
    const validation = { valid: true, message: '' } satisfies Validation;
    const { assertArray, assertBoolean, assertEnum, assertString } = this;

    return {
      array: (min?: number) => (notNull ? assertArray(prop, value as any[], min) : validation),
      boolean: () => (notNull ? assertBoolean(prop, value as boolean) : validation),
      enum: (e: Record<string, any>) => (notNull ? assertEnum(prop, value, e) : validation),
      string: (min?: number) => (notNull ? assertString(prop, value as string, min) : validation),
    } as const;
  }
}
