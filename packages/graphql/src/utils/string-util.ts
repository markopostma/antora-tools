import { BaseUtil } from '../bases/base-util';

export class StringUtil extends BaseUtil<string> {
  titleCase() {
    if (typeof this.input !== 'string') return String(this.input);

    return this.input
      .replaceAll(/(\_|\-|\s){1,}/gm, ' ')
      .split(' ')
      .map((w) => w.trim())
      .map((word) =>
        word.length > 1
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.toUpperCase(),
      )
      .join(' ');
  }

  transform<T extends (value: string) => string>(...transforms: Array<T>) {
    return transforms
      .filter((t) => typeof t === 'function')
      .reduce((output, fn) => fn(output), this.input);
  }
}
