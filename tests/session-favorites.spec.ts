import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

    const favoritesOnlyCheckbox = page.locator('#filter-favorites-only');
    await expect(favoritesOnlyCheckbox).toBeEnabled();
    await page.locator('label[for="filter-favorites-only"]').click();

    await expect(page.locator('[data-session-row-id="729573"]')).toBeVisible();
    await expect(page.locator('[data-session-row-id="729572"]')).toBeHidden();
});

test(`Should show all sessions again when "Nur Favoriten anzeigen" is unchecked`, async ({ page }) => {
    await page.goto('/sessions/');

    await page.locator('[data-session-row-id="729573"] [data-favorite-toggle]').click();

    await expect(page.locator('#filter-favorites-only')).toBeEnabled();
    const favoritesOnlyCheckbox = page.locator('label[for="filter-favorites-only"]');
    await favoritesOnlyCheckbox.click();
    await favoritesOnlyCheckbox.click();

    await expect(page.locator('[data-session-row-id="729572"]')).toBeVisible();
});

for (const configuration of ['false', 'missing']) {
    test(`Should omit favorites when enableSessionFavorites is ${configuration}`, async ({ page }) => {
        const directory = mkdtempSync(join(tmpdir(), 'session-favorites-'));
        try {
            const config = readFileSync('hugo.spec.yaml', 'utf8').replace(
                'enableSessionFavorites: true',
                configuration === 'false' ? 'enableSessionFavorites: false' : '',
            );
            const configPath = join(directory, 'hugo.yaml');
            const destination = join(directory, 'public');
            writeFileSync(configPath, config);
            execFileSync('hugo', ['--config', configPath, '--destination', destination, '--panicOnWarning']);

            for (const path of ['sessions', 'sessions/mastering-personal-branding-in-the-digital-age-729571']) {
                const html = readFileSync(join(destination, path, 'index.html'), 'utf8');
                expect(html).not.toContain('favoriteSessionIds');
                await page.setContent(html);
                await expect(page.locator('[data-favorite-toggle]')).toHaveCount(0);
                await expect(page.locator('#filter-favorites-only')).toHaveCount(0);
                await expect(page.locator('label[for="filter-favorites-only"]')).toHaveCount(0);
                await expect(page.locator('.event-row__title, .single-session-section__heading').first()).toBeVisible();
                if (path === 'sessions') {
                    await expect(page.locator('label[for="filter-day-0"]')).toHaveCount(1);
                    await expect(page.locator('label[for="filter-track-0"]')).toHaveCount(1);
                }
            }
        } finally {
            rmSync(directory, { recursive: true, force: true });
        }
    });
}
