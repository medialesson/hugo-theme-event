import { expect, test } from '@playwright/test';

test(`Should display the secondary menu`, async ({ page }) => {
    await page.goto('/');

    const secondaryNavigation = page.getByRole('navigation', { name: 'Secondary' });
    const menuItem = secondaryNavigation.getByRole('menuitem', { name: 'Über uns' });
    await expect(menuItem).toBeVisible();
    await expect(menuItem.getByText('Über uns')).toBeVisible();
    await expect(menuItem.getByText('Erfahren Sie wer wir sind uns was uns antreibt.')).toBeVisible();

    menuItem.click();

    await expect(page).toHaveURL('/about/');
});
