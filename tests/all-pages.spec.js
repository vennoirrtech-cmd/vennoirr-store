import { test, expect } from '@playwright/test';

const pagesToTest = [
  { path: '/', titleName: 'Vennoirr' },
  { path: '/men', titleName: 'Men' },
  { path: '/women', titleName: 'Women' },
  { path: '/cart', titleName: 'Cart' },
  { path: '/login', titleName: 'Login' },
  { path: '/about', titleName: 'About' },
  { path: '/terms', titleName: 'Terms' },
  { path: '/privacy', titleName: 'Privacy' },
  { path: '/faq', titleName: 'FAQ' },
  { path: '/returns', titleName: 'Returns' },
  { path: '/shipping', titleName: 'Shipping' },
  { path: '/contact', titleName: 'Contact' },
];

test.describe('All Pages Load Successfully', () => {
  for (const pageInfo of pagesToTest) {
    test(`Testing page: ${pageInfo.path}`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);
      
      // Ensure the response is OK (unless the server is a SPA that returns 200 for everything, 
      // in which case checking content works best)
      if (response) {
        expect(response.status()).not.toBe(404);
      }
      
      // Wait for network idle or domcontentloaded
      await page.waitForLoadState('domcontentloaded');
      
      // Verify basic content (e.g. check for footer or navbar to ensure the app rendered)
      const navbar = page.locator('nav').first();
      await expect(navbar).toBeVisible({ timeout: 10000 });
      
      // Optionally just a general assertion if it hasn't crashed
      expect(await page.title()).not.toBe('');
    });
  }
});
