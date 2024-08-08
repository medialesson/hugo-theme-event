# Hugo Event Theme

This theme turns your event planned with
[Sessionize](https://sessionize.com/) into a Hugo website. It automatically
creates various contents like a start page, a schedule and speaker pages.

## Getting started

### Prerequisites

1. [Hugo](https://gohugo.io/installation/) is installed on your machine.
2. You've at least one event planned on [Sessionize](https://sessionize.com/) (can be a test event).

### Installation

1. Open a shell of your choice.
2. Create a new Hugo site:
   ```shell
   hugo new site [path]
   ```
3. Switch to the directory of your new site:
   ```shell
   cd [path]
   ```
4. Clone this repository into the `themes/` directory or add it as submodule:

   ```shell
   git clone https://github.com/medialesson/hugo-theme-event.git themes/event

   # or

   git submodule add git@github.com:medialesson/hugo-theme-event.git themes/event
   ```

5. Add and adapt the following minimal settings to your [Hugo
   configuration](https://gohugo.io/getting-started/configuration/):
   `yaml
    theme: event
    sectionPagesMenu: main
    params:
        themes:
            event:
                # 👇 Set the name of your event.
                title: My Event
                # 👇 Fetch the ID of your event's API endpoint from
                # 👇 https://sessionize.com/app/organizer/schedule/api/0
                # 👇 and enter it here.
                sessionizeId: 123acb56
    `
6. Run Hugo in development mode:
   ```shell
   hugo server
   ```
7. View your event website on http://localhost:1313/.

## Content creation

This theme creates various contents during build. You can control the visibility
of this content with your menu configuration (see below). Simply add menu
entries for every content you want to use.

| Identifier        | Slug (`pageRef`)   | Description                             |
| ----------------- | ------------------ | --------------------------------------- |
| `sessions`        | `/sessions`        | A schedule of the event's sessions.     |
| `speakers`        | `/speakers`        | A list of speakers.                     |
| `code_of_conduct` | `/code-of-conduct` | A page with the Berlin Code of Conduct. |

## Customization

This theme tries to allow customization and configuration with Hugo standards
wherever possible.

### Overwrite theme settings

Open the theme's configuration `themes/event/hugo.yaml` to see all options
and their defaults. You can overwrite all settings on demand in your project's
Hugo configuration.

### Overwrite translations

The ships with translations for German and English. Checkout the folder
`themes/event/i18n/` to see what translations this theme uses. You can
overwrite them in the `i18n/` folder of your project.

### Configure menus

Hugo offers various ways how you can create multilingual menus. In the initial
setup above we used `sectionPagesMenu: main` to make Hugo create menu entries
automatically for each section. This option is very limited and gives you no
control about the order of the menu entries.

Another option is to configure menus in front matter. This option spreads the
menu configuration over multiple files. Therefore, we recommend to configure
menus in the Hugo configuration of your project. That way, you have everything
in one place.

This theme offers a `main` menu and a `footer` menu. You can create menu entries
for contents created by this theme (see above) and your custom contents (e.g. an
imprint). When the menus get rendered, this theme tries to translate each menu
entry by its identifier (`menu_` + identifier). If no translation is available,
the name of the menu entry will be used.

The following sample demonstrates how to create menu entries with standard Hugo
configuration.

```yaml
defaultContentLanguage: de
languages:
  en:
    menus:
      main:
        - identifier: sessions
          pageRef: /sessions
          weight: 10
        - identifier: code_of_conduct
          pageRef: /code-of-conduct
          weight: 20
      footer:
        - identifier: imprint
          pageRef: /imprint
          weight: 10
  de:
    menus:
      main:
        - identifier: sessions
          pageRef: /sessions
          weight: 10
        - identifier: code_of_conduct
          pageRef: /code-of-conduct
          weight: 20
      footer:
        - identifier: imprint
          pageRef: /imprint
          weight: 10
```
