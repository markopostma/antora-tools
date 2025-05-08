import { AssertionError } from 'assert';

export class ValidationError extends AssertionError {
  constructor(options?: ConstructorParameters<typeof AssertionError>['0']) {
    super(options);
  }
}
