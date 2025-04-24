# Hugo Event Theme

This theme turns your event planned with
[Sessionize](https://sessionize.com/) into a modern, responsive Hugo website.

![Hugo Event Theme](https://github.com/medialesson/hugo-theme-event/raw/main/images/device-composition.png)

It automatically
creates various contents and offers the following features.

-   Filterable Event schedule
-   Session and speaker pages
-   Responsive design
-   Multilingual
-   Eye-catching home page with:
    -   Countdown
    -   Key figures
    -   Highlighted speakers and sessions
    -   Sponsors
-   Eventbrite integration
-   Map integration
-   Various CTA elements
-   Color customization
-   Plain HTML and CSS (no JavaScript needed)

## Quick start

See the Event theme in action on
https://medialesson.github.io/hugo-theme-event-demo.

The source code of this demo website is available on
[GitHub](https://github.com/medialesson/hugo-theme-event-demo). You can check
out its configuration or fork the repository to start your own project.

## Documentation

### Getting started

The easiest way to get up and running is by using the
[Hugo Event Theme Demo template](https://github.com/medialesson/hugo-theme-event-demo).
This template is a pre-configured Hugo project that uses the Event theme.

To start a new project from scratch read the [getting started
guide](docs/guides/getting-started.md).

### Customization

The Event theme tries to allow customization and configuration with Hugo
standards wherever possible.

#### Overwrite theme settings

Open the theme's configuration `themes/event/hugo.yaml` to see all options and
their defaults. You can overwrite all settings on demand in your project's [Hugo
configuration](https://gohugo.io/getting-started/configuration/). All parameters
of the Event theme are placed under `params.themes.event`. If this documentation
describes a parameter with a specific name, for example `someParameter`, the
full path of the parameters is `params.themes.event.someParameter`. And if the
parameter must have different values depending on the language, define [language
specific
parameters](https://gohugo.io/content-management/multilingual/#configure-languages)
(e.g., `languages.de.params.themes.event.someParameter`).

#### Overwrite translations

The Event theme ships with translations for German and English. Checkout the
folder `themes/event/i18n/` to see what translations this theme uses. You can
overwrite them in the `i18n/` folder of your project.

#### Configure menus

The Event theme uses Hugo's standard menu functionality. Check out our [menu
configuration guide](docs/guides/menu-configuration.md) for more details.

#### Integrate generated content

The Event theme generates various contents during build. Hugo then creates one
or more pages out of this content. You can control the visibility of these pages
with your menu configuration. All you need are the identifier and the slug
(`pageRef`). The following table gives an overview about the available pages.

| Identifier        | Slug (`pageRef`)   | Description                                          |
| ----------------- | ------------------ | ---------------------------------------------------- |
| `about`           | `/about`           | Information about the event organizers.              |
| `sessions`        | `/sessions`        | A schedule of the event's sessions.                  |
| `speakers`        | `/speakers`        | An overview of all speakers.                         |
| `location`        | `/location`        | A page with the event address, directions and a map. |
| `sponsors`        | `/sponsors`        | A page displaying sponsors and partners.             |
| `code_of_conduct` | `/code-of-conduct` | A page with the Berlin Code of Conduct.              |

#### Configure features

The Event theme comes with various features. Some features use common parameters,
while others require dedicated ones. Without configuration, the theme may exclude
features from the build.

For more details, please refer to our [feature configuration
guide](docs/guides/feature-configuration.md).

### Deployment

The [official Hugo documentation](https://gohugo.io/hosting-and-deployment/)
provides various guides and samples about how you can deploy your page.

Please take into account that the Event theme creates just static content during
build. If anything changes in your Sessionize event, you need to rebuild and
redeploy your page. Therefore, consider to run your deployment on a regular
basis (e.g., hourly or nightly).

## Contributing

Contributions to the Event theme are always welcome. Please read and follow our
[contribution guidelines](CONTRIBUTING.md) before you start.
