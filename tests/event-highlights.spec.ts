import { expect, test } from '@playwright/test';

test(`Should display event highlights on home page`, async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('Highlight').getByText('9 Sprecher')).toBeVisible();
    await expect(page.getByLabel('Highlight').getByText('9 Sessions')).toBeVisible();
    await expect(page.getByLabel('Highlight').getByText('3 Tage')).toBeVisible();
    await expect(page.getByLabel('Highlight').getByText('Pforzheim, Germany')).toBeVisible();
});
