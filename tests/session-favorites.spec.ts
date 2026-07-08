import { expect, test } from '@playwright/test';

test(`Should show a favorite button on each session row that is unfavorited by default`, async ({ page }) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    const favoriteButton = sessionRow.locator('[data-favorite-toggle]');
    await expect(favoriteButton).toBeVisible();
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Zu Favoriten hinzufügen');
});

test(`Should mark a session as favorite when clicking its favorite button`, async ({ page }) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    const favoriteButton = sessionRow.locator('[data-favorite-toggle]');

    await favoriteButton.click();

    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Von Favoriten entfernen');
});

test(`Should persist favorite state across page reloads`, async ({ page }) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    await sessionRow.locator('[data-favorite-toggle]').click();

    await page.reload();

    const reloadedButton = page.locator('[data-session-row-id="729573"] [data-favorite-toggle]');
    await expect(reloadedButton).toHaveAttribute('aria-pressed', 'true');
    await expect(reloadedButton).toHaveAttribute('aria-label', 'Von Favoriten entfernen');
});

test(`Should unmark a session as favorite when clicking its favorite button again`, async ({ page }) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    const favoriteButton = sessionRow.locator('[data-favorite-toggle]');

    await favoriteButton.click();
    await favoriteButton.click();

    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Zu Favoriten hinzufügen');
});

test(`Should show a favorite button on the single session page`, async ({ page }) => {
    await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

    const favoriteButton = page.locator('[data-favorite-toggle]');
    await expect(favoriteButton).toBeVisible();
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Zu Favoriten hinzufügen');
});

test(`Should favorite a session from its single session page and reflect it in the sessions list`, async ({ page }) => {
    await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

    await page.locator('[data-favorite-toggle]').click();

    await page.goto('/sessions/');

    const favoriteButton = page.locator('[data-session-row-id="729571"] [data-favorite-toggle]');
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Von Favoriten entfernen');
});

test(`Should show only favorited sessions when "Nur Favoriten anzeigen" is checked`, async ({ page }) => {
    await page.goto('/sessions/');

    await page.locator('[data-session-row-id="729573"] [data-favorite-toggle]').click();

    await page.locator('label[for="filter-favorites-only"]').click();

    await expect(page.locator('[data-session-row-id="729573"]')).toBeVisible();
    await expect(page.locator('[data-session-row-id="729572"]')).toBeHidden();
});

test(`Should show all sessions again when "Nur Favoriten anzeigen" is unchecked`, async ({ page }) => {
    await page.goto('/sessions/');

    await page.locator('[data-session-row-id="729573"] [data-favorite-toggle]').click();

    const favoritesOnlyCheckbox = page.locator('label[for="filter-favorites-only"]');
    await favoritesOnlyCheckbox.click();
    await favoritesOnlyCheckbox.click();

    await expect(page.locator('[data-session-row-id="729572"]')).toBeVisible();
});
