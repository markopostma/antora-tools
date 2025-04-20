import { expect, Page, test } from '@playwright/test';

test.describe('objects', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/types/OBJECT/User.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('User');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(4);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText('Object type User.');
  });

  test('Definition', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Definition');
    expect(visited.locator('code.language-graphql.hljs')).toBeDefined();
  });

  test('Fields', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Fields');
    await expect(visited.locator('h3#_id')).toHaveText('id');
  });

  test('Example', async () => {
    await expect(visited.locator('h2').nth(2)).toHaveText('Example');
    expect(visited.locator('code.language-json.hljs')).toBeDefined();
  });

  test('Implementations', async () => {
    await expect(visited.locator('h2').nth(3)).toHaveText('Implementations');
  });
});
