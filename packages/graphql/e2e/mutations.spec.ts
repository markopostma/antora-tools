import { expect, Page, test } from '@playwright/test';

test.describe('mutations', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/mutations/create.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('create');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(3);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText('Create a Product.');
  });

  test('Return type', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Return type');
  });

  test('Arguments', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Arguments');
    await expect(visited.locator('h3#_product')).toHaveText('product');
  });

  test('Request', async () => {
    await expect(visited.locator('h2').nth(2)).toHaveText('Request');
    expect(visited.locator('code.language-graphql.hljs')).toBeDefined();
  });

  test.describe('@deprecated', () => {
    test.beforeEach(async ({ page }) => {
      visited = page;

      await page.goto('/graphql/mutations/delete.html');
      await page.waitForLoadState('domcontentloaded');
    });

    test('shows CAUTION message', async () => {
      await expect(visited.locator('.admonitionblock.caution').nth(0)).toHaveText(
        'No longer supported',
      );
    });
  });
});
