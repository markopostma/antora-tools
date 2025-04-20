import { BaseUtil } from '../../src/bases/base-util';
import { ArrayUtil } from '../../src/utils';

describe('ArrayUtil', () => {
  let arrayUtil: ArrayUtil;

  beforeEach(() => {
    arrayUtil = new ArrayUtil([1, 2, 3]);
  });

  it('creates', () => {
    expect(arrayUtil).toBeInstanceOf(ArrayUtil);
  });

  it('extends BaseUtil', () => {
    expect(arrayUtil).toBeInstanceOf(BaseUtil);
  });

  describe('groupBy', () => {
    const input = [
      { name: 'Hank', age: 20 },
      { name: 'Peter', age: 20 },
      { name: 'William', age: 21 },
      { name: 'Hank', age: 21 },
    ];
    describe.each([
      {
        by: 'age' as const,
        expected: {
          20: [
            { name: 'Hank', age: 20 },
            { name: 'Peter', age: 20 },
          ],
          21: [
            { name: 'William', age: 21 },
            { name: 'Hank', age: 21 },
          ],
        },
      },
      {
        by: 'name' as const,
        expected: {
          Hank: [
            { name: 'Hank', age: 20 },
            { name: 'Hank', age: 21 },
          ],
          Peter: [{ name: 'Peter', age: 20 }],
          William: [{ name: 'William', age: 21 }],
        },
      },
    ])('returns an object', ({ expected, by }) => {
      it('input returns expected output', () => {
        const groups = new ArrayUtil(input).groupBy((i) => i[by]);

        expect(groups).toEqual(expected);
      });
    });
  });
});
