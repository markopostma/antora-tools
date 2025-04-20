import { expect, Page, test } from '@playwright/test';

test.describe('input objects', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/types/INPUT_OBJECT/UserFilter.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('UserFilter');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(3);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText(
      'Filter options used in users query.',
    );
  });

  test('Definition', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Definition');
    expect(visited.locator('code.language-graphql.hljs')).toBeDefined();
  });

  test('Input fields', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Input fields');
  });

  test('Example', async () => {
    await expect(visited.locator('h2').nth(2)).toHaveText('Example');
    expect(visited.locator('code.language-json.hljs')).toBeDefined();
  });
});
