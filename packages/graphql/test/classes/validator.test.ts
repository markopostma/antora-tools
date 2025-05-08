import { AssertionError } from 'assert';
import { Validator } from '../../src/classes/validator';
import { LogLevel } from '../../src/enums';

describe('Validator', () => {
  describe.each([
    { input: 1, actual: 'number', expected: 'number', valid: true },
    { input: 'test', actual: 'string', expected: 'number', valid: false },
    { input: [], actual: 'array', expected: 'array', valid: true },
  ] as const)('isTypeof', ({ input, actual, expected, valid }) => {
    it(`${actual} ${input} expected to be ${valid ? 'VALID' : 'INVALID'}`, () => {
      const e = Validator.isTypeof(expected)(input);

      if (!valid) {
        expect(e).toBeInstanceOf(AssertionError);
        expect(e?.actual).toEqual(actual);
        expect(e?.expected).toEqual(expected);
      } else {
        expect(e).toBeUndefined();
      }
    });
  });

  describe.each([
    { input: '', min: 0, valid: true },
    { input: 'ab', min: 2, valid: true },
    { input: '', min: 1, valid: false },
    { input: [] as any[], min: 0, valid: true },
    { input: [] as any[], min: 1, valid: false },
    { input: ['a'] as any[], min: 2, valid: false },
  ] as const)('minLength', ({ input, min, valid }) => {
    it(`${JSON.stringify(input)} expected to have a minimum length of ${min}`, () => {
      const e = Validator.minLength(min)(input);

      if (!valid) {
        expect(e).toBeInstanceOf(AssertionError);
        expect(e?.actual).toEqual(false);
        expect(e?.expected).toEqual(true);
      } else {
        expect(e).toBeUndefined();
      }
    });
  });

  describe('isOneOf', () => {
    it('valid', () => {
      const error = Validator.isOneOf(Object.values(LogLevel))(LogLevel.Debug);

      expect(valid).toBeTruthy();
    });

    it('invalid value', () => {
      const { valid, message, actual, expected } = Validator.isOneOf(Object.values(LogLevel))(
        'fail' as any,
      );

      expect(valid).toBeFalsy();
      expect(message).toEqual(
        'Expected to be one of [trace, debug, info, warn, error, fatal]. Actual: fail',
      );
      expect(actual).toEqual('fail');
      expect(expected).toEqual(Object.values(LogLevel));
    });
  });

  describe('assertString', () => {
    it('valid', () => {
      const { valid } = Validator.assertString()('some-name');

      expect(valid).toBeTruthy();
    });

    it('invalid length', () => {
      const { valid, message, actual, expected } = Validator.assertString(1)('');

      expect(valid).toBeFalsy();
      expect(message).toEqual('Expected to have a minimum length of 1. Actual length: 0');
      expect(actual).toEqual(0);
      expect(expected).toEqual(1);
    });

    it('invalid type', () => {
      const { valid, message, actual, expected } = Validator.assertString()(5);

      expect(valid).toBeFalsy();
      expect(message).toEqual('Expected to be of type string. Actual type: number');
      expect(actual).toEqual('number');
      expect(expected).toEqual('string');
    });
  });

  describe('assertArray', () => {
    it('valid', () => {
      const { valid } = Validator.assertArray()([]);

      expect(valid).toBeTruthy();
    });

    it('invalid length', () => {
      const { valid, message, actual, expected } = Validator.assertArray(1)([]);

      expect(valid).toBeFalsy();
      expect(message).toEqual('Expected to have a minimum length of 1. Actual length: 0');
      expect(actual).toEqual(0);
      expect(expected).toEqual(1);
    });

    it('invalid type', () => {
      const { valid, message, actual, expected } = Validator.assertArray()('');

      expect(valid).toBeFalsy();
      expect(message).toEqual('Expected to be of type array. Actual type: string');
      expect(actual).toEqual('string');
      expect(expected).toEqual('array');
    });
  });
});
