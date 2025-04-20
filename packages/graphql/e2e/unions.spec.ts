import { expect, Page, test } from '@playwright/test';

test.describe('unions', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/types/UNION/Entity.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('Entity');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(2);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText('Entity union description.');
  });

  test('Definition', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Definition');
    expect(visited.locator('code.language-json.hljs')).toBeDefined();
  });

  test('Possible types', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Possible types');
  });
});
