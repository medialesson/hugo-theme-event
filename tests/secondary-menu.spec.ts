import { expect, test } from '@playwright/test';

test(`Should display the secondary menu`, async ({ page }) => {
    await page.goto('/');

    const menu = page.getByRole('list', { name: 'Zusätzliches Menü' });
    const aboutUsMenuItem = menu.getByRole('link', { name: 'Über uns' });
    const codeOfConductMenuItem = menu.getByRole('link', { name: 'Verhaltens­kodex' });

    await expect(menu).toBeVisible();
    await expect(aboutUsMenuItem).toBeVisible();
    await expect(aboutUsMenuItem.getByText('Erfahren Sie wer wir sind uns was uns antreibt.')).toBeVisible();

    await expect(codeOfConductMenuItem).toBeVisible();
    await expect(codeOfConductMenuItem.getByText('Verhaltens\u00ADkodex')).toBeVisible();
    //                                                         👆 hidden soft hyphen (shy)

    await aboutUsMenuItem.click();

    await expect(page).toHaveURL('/about/');
});
