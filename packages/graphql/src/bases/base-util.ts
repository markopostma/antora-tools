export class BaseUtil<T = any> {
  constructor(input: T) {
    this.#input = input;
  }

  readonly #input: T;

  get input() {
    return this.#input;
  }
}
