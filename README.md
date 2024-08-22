# Hugo Event Theme

This theme turns your event planned with
[Sessionize](https://sessionize.com/) into a Hugo website. It automatically
creates various contents and offers the following features.

-   Filterable Event schedule
-   Session and speaker pages
-   Responsive design
-   Multilingual
-   Eye-catching home page with:
    -   Countdown
    -   Key figures
    -   Top speakers
    -   Sponsors
-   Eventbrite integration
-   Map integration
-   Various CTA elements
-   Color customization
-   Plain HTML and CSS (almost no JavaScript)

## Quick start

See the Event theme in action on
https://medialesson.github.io/hugo-theme-event-demo.

The source code of this demo website is available on
[GitHub](https://github.com/medialesson/hugo-theme-event-demo). You can check
out its configuration or fork the repository to start your own project.

## Documentation

### Getting started

Learn how to start a new project from scratch in our [getting started
guide](docs/guides/getting-started.md).

### Customization

The Event theme tries to allow customization and configuration with Hugo
standards wherever possible.

#### Overwrite theme settings

Open the theme's configuration `themes/event/hugo.yaml` to see all options
and their defaults. You can overwrite all settings on demand in your project's
Hugo configuration.

#### Overwrite translations

The ships with translations for German and English. Checkout the folder
`themes/event/i18n/` to see what translations this theme uses. You can
overwrite them in the `i18n/` folder of your project.

#### Configure menus

The Event theme uses Hugo's standard menu functionality. Check out our [menu
configuration guide](docs/guides/getting-started.md) for more details.

#### Configure generated content

The Event theme generates various contents during build. Hugo then creates one
or more pages out of this content. You can control the visibility of these pages
with your menu configuration. All you need are the identifier and the slug
(`pageRef`). The following table gives an overview about the available pages.
For more details about available configuration options of each page, please read

| Identifier        | Slug (`pageRef`)   | Description                                          |
| ----------------- | ------------------ | ---------------------------------------------------- |
| `about`           | `/about`           | Information about the event organizers.              |
| `sessions`        | `/sessions`        | A schedule of the event's sessions.                  |
| `speakers`        | `/speakers`        | An overview of all speakers.                         |
| `location`        | `/location`        | A page with the event address, directions and a map. |
| `sponsors`        | `/sponsors`        | A page displaying sponsors and partners.             |
| `code_of_conduct` | `/code-of-conduct` | A page with the Berlin Code of Conduct.              |

### Deployment

The [official Hugo documentation](https://gohugo.io/hosting-and-deployment/)
provides various guides and samples about how you can deploy your page.

Please take into account that the Event theme creates just static content during
build. If anything changes in your Sessionize event, you need to rebuild and
redeploy your page. Therefore, consider to run your deployment on a regular
basis (e.g., hourly or nightly).
