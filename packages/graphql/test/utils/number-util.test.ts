import { NumberUtil } from '../../src/utils';

describe('NumberUtil', () => {
  describe.each([
    { input: 1, output: 'Bytes' },
    { input: 1024, output: 'KB' },
    { input: Math.pow(1024, 2), output: 'MB' },
    { input: Math.pow(1024, 3), output: 'GB' },
    { input: Math.pow(1024, 4), output: 'TB' },
    { input: Math.pow(1024, 5), output: 'PB' },
    { input: Math.pow(1024, 6), output: 'EB' },
    { input: Math.pow(1024, 7), output: 'ZB' },
    { input: Math.pow(1024, 8), output: 'YB' },
  ])('formatBytes', ({ input, output }) => {
    describe(`<number> ${input}`, () => {
      it('returns without decimals', () => {
        expect(NumberUtil.formatBytes(input)).toEqual(`1${output}`);
      });

      it(`returns 2 decimals ${`1.51${output}`}`, () => {
        expect(NumberUtil.formatBytes(input * 1.511)).toEqual(`1.51${output}`);
      });

      [10, 100, 1000].forEach((multiplier) => {
        const result = `${multiplier}${output}`;

        it(`returns ${result}`, () => {
          expect(NumberUtil.formatBytes(input * multiplier)).toEqual(result);
        });
      });
    });
  });
});
