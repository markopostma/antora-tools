import { ArrayUtil } from '../../src/utils';

describe('ArrayUtil', () => {
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
        const groups = ArrayUtil.groupBy(input, (i) => i[by]);

        expect(groups).toEqual(expected);
      });
    });
  });
});
