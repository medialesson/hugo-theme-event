import { expect, test } from '@playwright/test';

test('Should use event title as page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/test conference/);
});

test('Should provide link to home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Testcon/ })).toHaveCount(2);
});

test('Should use short event title as a link to home page in the header menu', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Testcon/ })).toHaveCount(2);
});

test('should not render language selector with one language', async ({ page }) => {
    await page.goto('/');

    const languageSelector = page.locator('[data-testid="language-select"]');
    await expect(languageSelector).toHaveCount(0);
});

test('Should include generator meta tag by default', async ({ page }) => {
    await page.goto('/');

    const generatorMeta = page.locator('meta[name="generator"][content="hugo-theme-event"]');
    await expect(generatorMeta).toHaveCount(1);
});

test('Should serve /.well-known/theme-info.json with theme name', async ({ request }) => {
    const response = await request.get('/.well-known/theme-info.json');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await response.json();
    expect(body).toHaveProperty('name', 'hugo-theme-event');
});
