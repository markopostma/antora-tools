export class ArrayUtil {
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
