import { expect, Locator, type Page, test } from '@playwright/test';

test.describe('navigation', () => {
  let visited: Page;
  let navContainer: Locator;
  let navList: Locator;

  test.beforeEach(async ({ page }) => {
    visited = page;
    navContainer = visited.locator('.nav-container[data-component="graphql"]');
    navList = visited.locator('aside nav > ul.nav-list');

    await page.goto('/graphql');
    await page.waitForLoadState('domcontentloaded');
  });

  test('nav-container is visible', async () => {
    await expect(navContainer).toBeInViewport();
  });

  test('ul.nav-list is visible and has x children', async () => {
    await expect(navList).toBeInViewport();
    await expect(navList.getByRole('listitem')).toHaveCount(6);
  });
});
