import { expect, test } from '@playwright/test';

test('Base template', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/testcon/);

    await expect(page.getByRole('link', { name: /Testcon/ })).toHaveCount(2);
});
