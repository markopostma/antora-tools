import { BaseUtil } from '../../src/bases/base-util';
import { StringUtil } from '../../src/utils';

describe('StringUtil', () => {
  let stringUtil: StringUtil;

  beforeEach(() => {
    stringUtil = new StringUtil('test');
  });

  it('creates', () => {
    expect(stringUtil).toBeInstanceOf(StringUtil);
    expect(stringUtil.input).toEqual('test');
  });

  it('extends BaseUtil', () => {
    expect(stringUtil).toBeInstanceOf(BaseUtil);
  });

  describe('transform', () => {
    describe.each([
      {
        input: 'String',
        transforms: [],
        expected: 'String',
      },
      {
        input: 'String',
        transforms: [(value: string) => (value += '1')],
        expected: 'String1',
      },
      {
        input: 'String',
        transforms: [
          (value: string) => (value += '1'),
          (value: string) => (value += '2'),
          (value: string) => (value += '3'),
        ],
        expected: 'String123',
      },
    ] as const)('processes functions', ({ input, transforms, expected }) => {
      it(`${input} returns ${expected}`, () => {
        const output = new StringUtil(input).transform(...transforms);

        expect(output).toEqual(expected);
      });
    });
  });

  describe('titleCase', () => {
    describe.each([
      { input: 'input', expected: 'Input' },
      { input: 'INPUT', expected: 'Input' },
      { input: 'INPUT_OBJECT', expected: 'Input Object' },
      { input: 'INPUT_OBJECT_TRACE', expected: 'Input Object Trace' },
      { input: 'dashed-string', expected: 'Dashed String' },
    ])('Changes first character to uppercase', ({ expected, input }) => {
      it(`${input} returns ${expected}`, () => {
        const output = new StringUtil(input).titleCase();

        expect(output).toEqual(expected);
      });
    });
  });
});
