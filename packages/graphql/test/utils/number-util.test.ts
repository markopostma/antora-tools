import { BaseUtil } from '../../src/bases/base-util';
import { NumberUtil } from '../../src/utils';

describe('NumberUtil', () => {
  let numberUtil: NumberUtil;

  beforeEach(() => {
    numberUtil = new NumberUtil(123);
  });

  it('creates', () => {
    expect(numberUtil).toBeInstanceOf(NumberUtil);
    expect(numberUtil.input).toEqual(123);
  });

  it('extends BaseUtil', () => {
    expect(numberUtil).toBeInstanceOf(BaseUtil);
  });

  describe('formatBytes', () => {
    describe.each([
      { input: 1, output: '1 Bytes' },
      { input: 1024, output: '1 KB' },
      { input: Math.pow(1024, 2), output: '1 MB' },
      { input: Math.pow(1024, 3), output: '1 GB' },
      { input: Math.pow(1024, 4), output: '1 TB' },
      { input: Math.pow(1024, 5), output: '1 PB' },
      { input: Math.pow(1024, 6), output: '1 EB' },
      { input: Math.pow(1024, 7), output: '1 ZB' },
      { input: Math.pow(1024, 8), output: '1 YB' },
    ])('formats correctly', ({ input, output }) => {
      it(`formatBytes ${input} returns ${output}`, () => {
        expect(new NumberUtil(input).formatBytes()).toEqual(output);
      });
    });
  });
});
