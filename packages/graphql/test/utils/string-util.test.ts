import { StringUtil } from '../../src/utils';

describe('StringUtil', () => {
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
        const output = StringUtil.transform(input, ...transforms);

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
        const output = StringUtil.titleCase(input);

        expect(output).toEqual(expected);
      });
    });
  });
});
