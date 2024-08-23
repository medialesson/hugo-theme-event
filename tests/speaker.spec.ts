import { expect, test } from '@playwright/test';

[
    { name: 'Emma Test', bio: 'General student. Avid coffee' },
    {
        name: 'Jackson Test',
        bio: 'Thinker. Food trailblazer. Organizer. Student. Pop culture fanatic. Writer. Passionate twitter lover. Music advocate.',
    },
    { name: 'Noah Test', bio: 'Friend of animals everywhere. Freelance twitter practitioner. Gamer. Subtly charming food geek.' },
    {
        name: 'Sophia Test',
        bio: 'Award-winning zombie specialist. Reader. Twitter fan. Total introvert. Internet evangelist. Thinker. Beer junkie. Food advocate.',
    },
].forEach(({ name, bio }) => {
    test(`Should provide link to page of featured speaker ${name}`, async ({ page }) => {
        await page.goto('/');
        await page.getByRole('menu', { name: 'Featured Speakers' }).getByRole('link', { name: name }).click();
        await expect(page.getByRole('heading', { name: name })).toBeVisible();
        await expect(page.getByText(bio)).toBeVisible();
    });
});
