import { AssertionError } from 'node:assert';
import { BaseTask } from '../../bases/base-task';
import { Validator } from '../../classes/validator';
import { Locale, LogLevel, Strategy } from '../../enums';
import type { Config } from '../../interfaces';

export class ValidateTask extends BaseTask {
  static readonly DEPRECATED = ['includeStyles', 'apiEndpoint'] as const;

  static readonly ALLOWED_KEYS = [
    'displayVersion',
    'headers',
    'ignore',
    'intro',
    'locale',
    'location',
    'logLevel',
    'metaFile',
    'name',
    'strategy',
    'title',
    'version',
  ] as const satisfies Array<keyof Config>;

  async handle() {
    this.validateStrictness();
    this.validateProps();
    this.validateDeprecated();
  }

  private validateProps() {
    const rules = {
      location: [Validator.isTypeof('string')],
      strategy: [Validator.isOneOf(Object.values(Strategy))],
      // // optional
      displayVersion: [Validator.optional.isTypeof('string'), Validator.optional.minLength(1)],
      headers: [Validator.optional.isTypeof('array')],
      ignore: [Validator.optional.isTypeof('array')],
      locale: [Validator.optional.isOneOf(Object.values(Locale))],
      logLevel: [Validator.optional.isOneOf(Object.values(LogLevel))],
      metaFile: [Validator.optional.isTypeof('string'), Validator.optional.minLength(6)],
      name: [Validator.optional.isTypeof('string'), Validator.optional.minLength(1)],
      title: [Validator.optional.isTypeof('string'), Validator.optional.minLength(1)],
      version: [Validator.isTypeof('string')],
    } as Record<keyof Config, any[]>;

    const invalid = Object.entries(Validator.assertObject(this.config, rules));

    if (invalid.length) {
      for (const [name, errors] of invalid) {
        for (const { actual, expected, message } of errors) {
          this.logger.error(
            new AssertionError({ actual, expected, message: name.concat(': ', message) }),
          );
        }
      }

      throw new Error('Config validation failed');
    }
  }

  private validateStrictness() {
    const strictProps = Validator.assertStrictProps([
      ...ValidateTask.ALLOWED_KEYS,
      ...ValidateTask.DEPRECATED,
    ])(this.config);

    if (!strictProps.valid) {
      throw new Error('Config validation failed'.concat(': ', strictProps.message));
    }
  }

  private validateDeprecated() {
    for (const prop of ValidateTask.DEPRECATED.filter((p) => p in this.config)) {
      Validator.deprecated(prop, this.config[prop as keyof Config]);
    }
  }
}
