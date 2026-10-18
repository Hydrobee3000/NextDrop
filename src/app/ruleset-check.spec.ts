describe('ruleset check', () => {
  it('fails on purpose to verify that a red CI blocks merging', () => {
    expect(true).toBe(false);
  });
});
