import { expect, Page, test } from '@playwright/test';

test.describe('queries', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/queries/product.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('product');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(3);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText('Fetch a single Product.');
  });

  test('Return type', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Return type');
  });

  test('Arguments', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Arguments');
    await expect(visited.locator('h3#_id')).toHaveText('id');
  });

  test('Request', async () => {
    await expect(visited.locator('h2').nth(2)).toHaveText('Request');
    expect(visited.locator('code.language-graphql.hljs')).toBeDefined();
  });

  test.describe('@deprecated', () => {
    test.beforeEach(async ({ page }) => {
      visited = page;

      await page.goto('/graphql/queries/search.html');
      await page.waitForLoadState('domcontentloaded');
    });

    test('shows CAUTION message', async () => {
      await expect(visited.locator('.admonitionblock.caution').nth(0)).toHaveText(
        'Is no longer useful.',
      );
    });
  });
});
