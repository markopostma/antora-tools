describe('package.json', () => {
  let packageJSON: typeof import('../package.json');
  const rootCjsTarget = './lib/index.js';

  beforeAll(async () => {
    packageJSON = await import('../package.json');
  });

  it('name', () => {
    expect(packageJSON.name).toEqual('@antora-tools/graphql');
  });

  it('main', () => {
    expect(packageJSON.main).toEqual(rootCjsTarget);
  });
});
