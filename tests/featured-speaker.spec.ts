import { expect, test } from '@playwright/test';

[
    {
        fullName: 'Top Speaker 1',
        tagLine: 'Visionary Technologist and Thought Leader',
        profileUrl: '/speakers/top-speaker-1-00000000-0000-0000-0000-000000000004/',
    },
    {
        fullName: 'Top Speaker 2',
        tagLine: 'Dynamic PR Specialist and Communications Expert',
        profileUrl: '/speakers/top-speaker-2-00000000-0000-0000-0000-000000000008/',
    },
    {
        fullName: 'Top Speaker 3',
        tagLine: 'Innovative Tech Visionary and Mentor',
        profileUrl: '/speakers/top-speaker-3-00000000-0000-0000-0000-000000000002/',
    },
    {
        fullName: 'Top Speaker 4',
        tagLine: 'Pioneering Innovator in Tech Solutions',
        profileUrl: '/speakers/top-speaker-4-00000000-0000-0000-0000-000000000006/',
    },
].forEach(({ fullName, tagLine, profileUrl }) => {
    test(`Should provide link to page of featured speaker ${fullName} on home page`, async ({ page }) => {
        await page.goto('/');
        const featuredSpeakersSection = page.getByRole('region', { name: 'Featured Speakers' });
        const featuredSpeakersMenu = featuredSpeakersSection.getByRole('menu', { name: 'Featured Speakers' });
        const featuredSpeakersMenuItem = featuredSpeakersMenu.getByRole('menuitem', { name: fullName });
        await expect(featuredSpeakersMenuItem.getByText(fullName)).toBeVisible();
        await expect(featuredSpeakersMenuItem.getByText(tagLine)).toBeVisible();
        await featuredSpeakersMenuItem.getByRole('link', { name: fullName }).click();
        await expect(page).toHaveURL(profileUrl);
    });
});
