import { test, expect } from '@playwright/test';

/**
 * E2E tests for the checkout flow.
 *
 * These tests require a running dev server (handled by playwright.config webServer)
 * and a Supabase instance with seeded data for stays to load.
 */
test.describe('Checkout flow', () => {
  test('browse stays and navigate to detail, redirect to login on book', async ({
    page,
  }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Verify stays grid loads
    await expect(page.locator('[data-testid="stays-grid"]')).toBeVisible();

    // 3. Click first stay card
    const firstStay = page.locator('a[href^="/stays/"]').first();
    await expect(firstStay).toBeVisible();
    await firstStay.click();

    // 4. Verify stay detail page loads with booking CTA
    await expect(
      page.locator('text=Book this stay'),
    ).toBeVisible({ timeout: 10_000 });

    // 5. Click "Book this stay" button
    await page.click('text=Book this stay');

    // 6. Should redirect to login (unauthenticated user)
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10_000 });
  });

  test('home page loads with title and stays', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lateral/i);
    await expect(page.locator('text=Unique stays near you')).toBeVisible();
  });
});
