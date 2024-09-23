import { expect, test } from '@playwright/test';

test('Should use event title as page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/test conference/);
});

test('Should provide link to home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Test conference/ })).toHaveCount(1);
});

test('Should use short event title as a link to home page in the header menu', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Testcon/ })).toHaveCount(1);
});
