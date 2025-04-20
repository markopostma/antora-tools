import { expect, Page, test } from '@playwright/test';

test.describe('scalars', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/types/SCALAR/Email.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('Email');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(1);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText(
      'Email scalar type represents a valid email in mail@host.com format.',
    );
  });

  test('Example', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Example');
    expect(visited.locator('code.language-json.hljs')).toBeDefined();
  });
});
