import { expect, test } from '@playwright/test';

test(`Should display the secondary menu`, async ({ page }) => {
    await page.goto('/');

    const menu = page.getByRole('list', { name: 'Zusätzliches Menü' });
    const menuItems = menu.getByRole('link', { name: 'Über uns' });

    await expect(menu).toBeVisible();
    await expect(menuItems).toBeVisible();
    await expect(menuItems.getByText('Erfahren Sie wer wir sind uns was uns antreibt.')).toBeVisible();

    await menuItems.click();

    await expect(page).toHaveURL('/about/');
});
