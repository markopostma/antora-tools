import { expect, Page, test } from '@playwright/test';

test.describe('interfaces', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/types/INTERFACE/ContactInfo.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('ContactInfo');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(4);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText(
      'Basic generic contact information.',
    );
  });

  test('Definition', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Definition');
    expect(visited.locator('code.language-graphql.hljs')).toBeDefined();
  });

  test('Fields', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Fields');
  });

  test('Example', async () => {
    await expect(visited.locator('h2').nth(2)).toHaveText('Example');
    expect(visited.locator('code.language-json.hljs')).toBeDefined();
  });

  test('Implemented by', async () => {
    await expect(visited.locator('h2').nth(3)).toHaveText('Implemented by');
  });
});
