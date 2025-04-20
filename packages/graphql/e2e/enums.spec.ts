import { expect, Page, test } from '@playwright/test';

test.describe('enums', () => {
  let visited: Page;

  test.beforeEach(async ({ page }) => {
    visited = page;

    await page.goto('/graphql/types/ENUM/MeasurementUnit.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('<h1>', async () => {
    await expect(visited.locator('h1')).toHaveText('MeasurementUnit');
  });

  test('<h2>', async () => {
    await expect(visited.locator('h2')).toHaveCount(2);
  });

  test('#preamble', async () => {
    await expect(visited.locator('#preamble .lead p')).toHaveText(
      'Enumerator used for unit measurement determination.',
    );
  });

  test('Enum values', async () => {
    await expect(visited.locator('h2').nth(0)).toHaveText('Enum values');
  });

  test('Definition', async () => {
    await expect(visited.locator('h2').nth(1)).toHaveText('Definition');
    expect(visited.locator('code.language-graphql.hljs')).toBeDefined();
  });
});
