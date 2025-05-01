export class StringUtil {
  static titleCase(input: string) {
    if (typeof input !== 'string') return String(input);

    return input
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

  static transform<T extends (value: string) => string>(input: string, ...transforms: Array<T>) {
    return transforms
      .filter((t) => typeof t === 'function')
      .reduce((output, fn) => fn(output), input);
  }
}
