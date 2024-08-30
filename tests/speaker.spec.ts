import { expect, test } from '@playwright/test';

[
    {
        fullName: 'Top Speaker 1',
        bio: 'Top Speaker 1 is a renowned cybersecurity expert with over 25 years of experience in protecting critical infrastructure and sensitive data. They have worked with leading global organizations to develop and implement robust security strategies. Known for their deep technical knowledge and strategic vision, Top Speaker 1 is a trusted advisor and frequent speaker at international security conferences. Outside of their professional endeavors, they are an avid traveler, a passionate advocate for digital privacy, and enjoy mentoring the next generation of cybersecurity professionals.',
        tagLine: 'Visionary Technologist and Thought Leader',
    },
    {
        fullName: 'Top Speaker 2',
        bio: 'Top Speaker 2 is a visionary leader in the field of artificial intelligence and machine learning. With over 20 years of experience, they have spearheaded groundbreaking research and development projects that have significantly advanced the industry. Their work has been recognized globally, earning them numerous awards and accolades. Top Speaker 2 is a prolific author and a sought-after keynote speaker at major tech conferences. When not immersed in AI, they enjoy teaching, writing, and exploring the intersection of technology and society.',
        tagLine: 'Dynamic PR Specialist and Communications Expert',
    },
    {
        fullName: 'Top Speaker 3',
        bio: 'Top Speaker 3 is a seasoned software engineer with a deep expertise in full-stack development. With over 15 years in the tech industry, they have contributed to numerous high-profile projects, specializing in creating robust and scalable web applications. Known for their innovative problem-solving skills and dedication to continuous learning, Top Speaker 3 is a frequent speaker at international tech conferences. Outside of work, they are passionate about coffee, gourmet cooking, and exploring the latest trends in technology.',
        tagLine: 'Innovative Tech Visionary and Mentor',
    },
    {
        fullName: 'Top Speaker 4',
        bio: 'Top Speaker 4 is a highly regarded web development expert with a passion for pioneering new technologies. With over a decade of experience in the tech industry, they have been at the forefront of numerous innovative projects, pushing the boundaries of what is possible on the web. Known for their dynamic approach and ability to solve complex problems, Top Speaker 4 is a sought-after speaker at tech conferences worldwide. When not coding, they enjoy exploring new tech trends, mentoring aspiring developers, and indulging in their love for gourmet cuisine.',
        tagLine: 'Pioneering Innovator in Tech Solutions',
    },
].forEach(({ fullName, tagLine, bio }) => {
    test(`Should provide link to page of featured speaker ${fullName} on home page`, async ({ page }) => {
        await page.goto('/');
        const featuredSpeakersSection = page.getByRole('region', { name: 'Featured Speakers' });
        const featuredSpeakersMenu = featuredSpeakersSection.getByRole('menu', { name: 'Featured Speakers' });
        const featuredSpeakersMenuItem = featuredSpeakersMenu.getByRole('menuitem', { name: fullName });
        await expect(featuredSpeakersMenuItem.getByText(fullName)).toBeVisible();
        await expect(featuredSpeakersMenuItem.getByText(tagLine)).toBeVisible();
        await featuredSpeakersMenuItem.getByRole('link', { name: fullName }).click();
        await expect(page.getByText(bio)).toBeVisible();
    });
});
