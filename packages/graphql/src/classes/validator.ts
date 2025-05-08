import assert, { type AssertionError } from 'node:assert';
import type { Typeof, Validation } from '../types';

export class Validator {
  static assertObject<V, R extends (value: V) => AssertionError>(
    value: V,
    rules: Record<string, R[]>,
  ) {
    return Object.entries(rules)
      .filter(([name, fn]) => typeof name === 'string' && Array.isArray(fn))
      .map(([name, validators]) => [name, validators.filter(Boolean)] as const)
      .map(
        ([name, validations]) =>
          [
            name as keyof V,
            validations
              .filter((fn) => typeof fn === 'function')
              .map((fn) => fn(value[name as keyof V] as V))
              .filter(Boolean),
          ] as const,
      )
      .reduce(
        (record, [name, validation]) => {
          record[name] = validation;
          return record;
        },
        {} as Record<keyof V, AssertionError[]>,
      );
  }

  static isTypeof<V>(expected: Typeof | 'array') {
    return (actual: V) =>
      this.catchAssertion(() =>
        expected === 'array'
          ? assert.strictEqual(Array.isArray(actual) ? 'array' : typeof actual, expected)
          : assert.strictEqual(typeof actual, expected),
      );
  }

  static minLength<V extends string | any[]>(min = 0) {
    return (actual: V) => this.catchAssertion(() => assert(actual.length >= min));
  }

  static isOneOf<V>(values: V[]) {
    return (actual: V) =>
      this.catchAssertion(() =>
        assert(values.includes(actual), `Expected ${actual} to be one of [${values.join(', ')}]`),
      );
  }

  static assertString<V>(minLength = 0) {
    return (value: V) =>
      typeof value === 'string'
        ? ({
            valid: value.length >= minLength,
            message: `Expected to have a minimum length of ${minLength}. Actual length: ${value.length}`,
            actual: value.length,
            expected: minLength,
          } satisfies Validation)
        : ({
            valid: false,
            message: `Expected to be of type string. Actual type: ${typeof value}`,
            actual: typeof value,
            expected: 'string',
          } satisfies Validation);
  }

  static assertArray<V>(minLength = 0) {
    return (value: V) =>
      Array.isArray(value)
        ? ({
            valid: value.length >= minLength,
            message: `Expected to have a minimum length of ${minLength}. Actual length: ${value.length}`,
            actual: value.length,
            expected: minLength,
          } satisfies Validation)
        : ({
            valid: false,
            message: `Expected to be of type array. Actual type: ${typeof value}`,
            actual: typeof value,
            expected: 'array',
          } satisfies Validation);
  }

  static assertStrictProps<V>(props: string[]) {
    return (value: V) => {
      const extraProps = Object.keys(value as any).filter((key) => !props.includes(key));

      return {
        valid: extraProps.length === 0,
        message: `Unexpected properties: ${extraProps.join(', ')}`,
        actual: Object.keys(value as any) ?? [],
        expected: props,
      } satisfies Validation;
    };
  }

  static deprecated(prop: string, value: any, reason = 'No longer supported') {
    if (value) {
      console.warn('%s is deprecated: %s', prop, reason);
    }
  }

  static get optional() {
    const notNull = (value: any) => value !== undefined && value !== null;
    const valid: Validation = {
      valid: true,
      message: '',
      actual: true,
      expected: true,
    };

    return {
      array: (min?: number) => (v: any) => (notNull(v) ? this.assertArray(min)(v) : valid),
      isOneOf: (e: any[]) => (v: any) => (notNull(v) ? this.isOneOf(e)(v) : valid),
      isTypeof: (e: Typeof | 'array') => (v: any) => (notNull(v) ? this.isTypeof(e)(v) : valid),
      string: (min?: number) => (v: any) => (notNull(v) ? this.assertString(min)(v) : valid),
      minLength: (min?: number) => (v: any) => (notNull(v) ? this.minLength(min)(v) : valid),
    } as const;
  }

  private static catchAssertion(assertion: (...args: any[]) => any) {
    if (typeof assertion === 'function') {
      try {
        assertion();
      } catch (e) {
        return e as AssertionError;
      }
    }
  }
}
