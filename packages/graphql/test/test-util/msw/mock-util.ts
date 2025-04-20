import { SetupServerApi } from 'msw/node';

export function hookLifecycleEvents(server: SetupServerApi, hook = true) {
  if (hook) {
    beforeAll(() => {
      server.listen();
    });

    afterEach(() => {
      server.resetHandlers();
    });

    afterAll(() => {
      server.close();
    });
  }

  return server;
}
