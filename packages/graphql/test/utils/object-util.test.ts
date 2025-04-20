import { ObjectUtil } from '../../src/utils';

describe('ObjectUtil', () => {
  describe('deepMerge', () => {
    it('merges objects', () => {
      const merged = ObjectUtil.deepMerge(
        { prop1: 'value1', prop2: 'value2' },
        { prop1: 'value3', prop2: 'value4', prop3: 'value5' },
      ) as any;
      expect(merged.prop1).toEqual('value3');
      expect(merged.prop2).toEqual('value4');
      expect(merged.prop3).toEqual('value5');
    });

    it('merges arrays', () => {
      const merged = ObjectUtil.deepMerge(
        { prop1: ['value1'], prop2: ['value2'] },
        { prop1: ['value3'], prop2: 'value4', prop3: ['value5'] },
      ) as any;
      expect(merged.prop1).toEqual(['value1', 'value3']);
      expect(merged.prop2).toEqual('value4');
      expect(merged.prop3).toEqual(['value5']);
    });
  });
});
