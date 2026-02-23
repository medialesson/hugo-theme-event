import { expect, test } from '@playwright/test';

test(`Should display the CTA banner`, async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sichern Sie sich jetzt Ihr Ticket!')).toBeVisible();
});

test(`Should display secondary CTA button in the banner when URL is provided`, async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sprecher:in werden')).toBeVisible();
});
