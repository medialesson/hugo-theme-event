import { expect, test } from '@playwright/test';

[
    {
        title: 'Building Scalable Microservices with Kubernetes',
        description:
            'Explore the world of microservices and learn how to build scalable, resilient applications using Kubernetes. This session will cover the fundamentals of microservices architecture, containerization, a',
    },
    {
        title: 'The Future of AI: Trends and Innovations',
        description:
            'Join us for an insightful session where we explore the latest trends and innovations in artificial intelligence. From cutting-edge research to practical applications, this session will cover a wide ra',
    },
].forEach(({ title, description }) => {
    test(`Should display information about the featured session ${title} on home page`, async ({ page }) => {
        await page.goto('/');
        const featuredSessionsRegion = page.getByRole('region', { name: 'Featured Sessions' });
        await expect(featuredSessionsRegion.getByText(title)).toBeVisible();
        await expect(featuredSessionsRegion.getByText(description)).toBeVisible();
    });
});

[
    {
        title: 'Mastering Personal Branding in the Digital Age',
        description:
            "In this engaging session, we will explore the essential strategies for building and maintaining a strong personal brand in today's digital landscape. Learn ",
    },
    {
        title: 'Lunch',
        description: 'Take a break and enjoy a delicious lunch while networking with fellow attendees. This is',
    },
].forEach(({ title, description }) => {
    test(`Should not display information about not featured session ${title} on home page`, async ({ page }) => {
        await page.goto('/');
        const featuredSessionsRegion = page.getByRole('region', { name: 'Featured Sessions' });
        await expect(featuredSessionsRegion.getByText(title)).not.toBeVisible();
        await expect(featuredSessionsRegion.getByText(description)).not.toBeVisible();
    });
});
