import { BaseUtil } from '../bases/base-util';

export class ArrayUtil<T = any> extends BaseUtil<T[]> {
  groupBy<K extends string | number>(key: (element: T) => K) {
    return ArrayUtil.groupBy(this.input, key);
  }

  sortBy<K extends keyof T>(by: K) {
    return ArrayUtil.sortBy<T, K>(by);
  }

  static sortBy<T, B extends keyof T>(by: B) {
    return (a: T, b: T) => {
      if (a[by] < b[by]) {
        return -1;
      }
      if (a[by] > b[by]) {
        return 1;
      }
      return 0;
    };
  }

  static groupBy<K extends string | number, T>(arr: T[], key: (element: T) => K) {
    return arr.reduce(
      (groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );
  }
}
