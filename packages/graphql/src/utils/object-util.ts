import { BaseUtil } from '../bases/base-util';

export class ObjectUtil extends BaseUtil {
  static deepMerge<T>(...objects: any[]): T {
    const isObject = (obj: any) => obj && typeof obj === 'object';

    return objects.filter(Boolean).reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.deepMerge(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }
}
