import { expect, test } from '@playwright/test';

test(`Should display all relevant session information`, async ({ page }) => {
    await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

    const sessionInformation = page.getByRole('region', { name: 'Session information' });
    await expect(sessionInformation.getByRole('heading', { name: 'BUSINESS' })).toBeVisible();
    await expect(sessionInformation.getByRole('heading', { name: '30.01.2025, 14:00' })).toBeVisible();
    await expect(sessionInformation.getByRole('heading', { name: '@Room 2' })).toBeVisible();
    await expect(
        sessionInformation.getByRole('heading', { name: 'Mastering Personal Branding in the Digital Age' }),
    ).toBeVisible();
    await expect(
        sessionInformation.getByText(
            "In this engaging session, we will explore the essential strategies for building and maintaining a strong personal brand in today's digital landscape. Learn how to leverage social media, create compelling content, and effectively communicate your unique value proposition. Whether you're a professional looking to enhance your career prospects or an entrepreneur aiming to stand out in a crowded market, this session will provide actionable insights and practical tips to elevate your personal brand.",
        ),
    ).toBeVisible();
    await expect(sessionInformation.getByRole('listitem', { name: 'Session' })).toBeVisible();
    await expect(sessionInformation.getByRole('listitem', { name: 'Introductory and overview' })).toBeVisible();
    await expect(sessionInformation.getByRole('listitem', { name: 'English' })).toBeVisible();
});

[
    {
        fullName: 'John Jackson',
        bio: 'John is a seasoned software engineer with over 15 years of experience in the tech industry. He has worked with leading tech companies, contributing to innovative projects in AI, cloud computing, and cybersecurity. John is a passionate advocate for open-source software and has been an active contributor to several high-profile projects. He frequently speaks at international conferences, sharing his insights on emerging technologies and best practices in software development. In his free time, Joh',
        tagLine: 'Innovative Tech Leader and AI Enthusiast',
        profileUrl: '/speakers/john-jackson-00000000-0000-0000-0000-000000000001/',
    },
    {
        fullName: 'Sophia Test',
        bio: "Sophia is a renowned software architect with over a decade of experience in developing scalable web applications. She has a deep passion for cloud computing and has led numerous successful projects in the tech industry. Sophia is also a prolific writer and speaker, known for her engaging presentations at major tech conferences around the world. When she's not coding, Sophia enjoys hiking, photography, and contributing to open-source projects.",
        tagLine: 'CEO / Contoso',
        profileUrl: '/speakers/sophia-test-00000000-0000-0000-0000-000000000000/',
    },
].forEach(({ fullName, tagLine, bio, profileUrl }) => {
    test(`Should display speaker of the session ${fullName}`, async ({ page }) => {
        await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

        const sessionSpeakers = page.getByRole('region', { name: 'Speaker of the session' });
        const speaker1 = sessionSpeakers.getByRole('listitem', { name: fullName });
        await expect(speaker1).toBeVisible();
        await expect(speaker1).toContainText(fullName);
        await expect(speaker1).toContainText(tagLine);
        await expect(speaker1).toContainText(bio);
        const readMoreLink = speaker1.getByRole('link', { name: 'mehr erfahren' });
        await expect(readMoreLink).toBeVisible();
        await readMoreLink.click();
        await expect(page).toHaveURL(profileUrl);
    });
});

test(`Should display further session from the same track`, async ({ page }) => {
    await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

    const furtherSessions = page.getByRole('region', { name: 'Further session from the same track' });
    const sessionLink = furtherSessions.getByRole('link', { name: "Emma's Session" });
    await expect(sessionLink).toBeVisible();
    await expect(sessionLink).toContainText("Emma's Session");
    await expect(sessionLink).toContainText('30.01.2025, 12:00');
});
