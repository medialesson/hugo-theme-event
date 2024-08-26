import { expect, test } from '@playwright/test';

test(`Should display the CTA banner`, async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sichern Sie sich jetzt Ihr Ticket!')).toBeVisible();
});
