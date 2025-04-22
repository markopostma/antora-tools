import { setupServer } from 'msw/node';
import * as handlers from './handlers';
import { hookLifecycleEvents } from './mock-util';

export const createGraphQLServer = {
  /**
   * Create for introspection.
   * @param hook
   */
  forIntrospection(hook = true) {
    const server = setupServer(...handlers.forIntrospection());

    return hookLifecycleEvents(server, hook);
  },
  /**
   * Create with specified remote schema.
   * @param url
   * @param hook
   */
  withRemoteDefaultSchema(hook = true) {
    const server = setupServer(...handlers.withDefaultSchema());

    return hookLifecycleEvents(server, hook);
  },
  /**
   * Create with specific status code.
   * @param status
   * @param hook
   */
  withStatusCode(status: number, hook = true) {
    const server = setupServer(...handlers.withStatus(status));

    return hookLifecycleEvents(server, hook);
  },
  /**
   * Create server with Bearer authorization or return 403 with errors.
   * @param status
   * @param hook
   */
  withBearerAuthorization(hook = true) {
    const server = setupServer(...handlers.withBearerAuthorization());

    return hookLifecycleEvents(server, hook);
  },
} as const;
