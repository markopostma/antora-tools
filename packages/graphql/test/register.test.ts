describe('register', () => {
  it('only exports function register', async () => {
    const source = await import('../src');
    const keys = Object.keys(source);

    expect(keys).toEqual(['register']);
    expect(source.register).toBeInstanceOf(Function);
  });
});
