import { test, expect } from '@playwright/test';

test('storefront loads and visual layout is intact', async ({ page }) => {
  // Navigate to your local fashion-store
  await page.goto('/');

  // This will wait for the page to load, then take a full page screenshot.
  // The very first time it runs, it will save a "baseline" image in the tests folder.
  // Every time it runs after that, it will compare the new UI to the baseline image!
  await expect(page).toHaveScreenshot('home-baseline.png', {
    fullPage: true,
  });
});
