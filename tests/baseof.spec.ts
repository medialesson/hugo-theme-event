import { expect, test } from '@playwright/test';

test('Should use event title as page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/testcon/);
});

test('Should provide link to home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Testcon/ })).toHaveCount(2);
});
