# Contributing to the Event theme

All contributions to this repository should take the following guidelines into
account.

## Workflow

-   Always start with an issue.
-   If you found a bug or want to suggest an enhancement, create a new issue.
-   Create a branch that solves the issue.
-   Open a pull request (PR) for your branch.
-   Consider to update the demo project after your PR was completed.

## Parameters

Parameter names must conform to the following rules to reduce the chance of
breaking changes when refactoring.

-   Place all parameters under `params.themes.event`.
-   Place paths to general images under `params.themes.event.images`.
-   Place colors used as CCS property to `params.themes.event.colors`.
-   Choose the parameter name wisely! A later modification of a parameter would introduce a breaking change.

## Styling

All `<style>` elements must be included inside the `<head>` of the
document.[^styleplacement] In other words, all style files must be loaded in the
main template. They cannot, for example, be placed inside a partial. This is a
pity, since styles are not tree-shakeable because of this. The theme
automatically merges all `*.css` files from the `assets/` directory to one
minimized file `styles.min.[fingerprint].css` in the root folder. Consider this
when you reference relative paths in style files (e.g., fonts).

-   Place all style files under `assets/styles/`.
-   Follow the [BEM](https://getbem.com) naming convention for selectors.
-   Use the [Two Dashes](https://bem.info/methodology/naming-convention/#two-dashes-style) naming schema.
-   For every partial, put a style file with the same folder structure under
    `assets/styles/partials/`.
-   Never use type selectors and avoid ID selectors.

## Translations

Translation keys must conform to the following rules to reduce the chance of
breaking changes when refactoring.

-   All keys must have the form `[feature].[element]` and must give the key a precise context.
    -   Where `[feature]` is a descriptive name of one functional part of the
        theme like `about_page` or `featured_speakers_section`. In very clear and
        unambiguous cases sometimes just `menu` or `countdown`.
    -   Where `[element]` is a descriptive name of one functional part of the
        specific feature like `heading` or `day_filter`. Or, as last resort, the
        English term (e.g., `day`).
-   Keys consist only of lower cases and underscores (`_`) and exactly one period (`.`).
-   The key as a whole should be as descriptive as possible. Developers and
    translators should get an idea of where and how the translation is used just by
    the key.
-   Choose the keys wisely! A later modification of a key would introduce a breaking change.
-   Avoid technical or framework related terms (e.g., `single`, `list` or `taxonomy`).

## Tests

The functionality of the theme is ensured with [Playwright](https://playwright.dev/) tests.

Before you run the tests, make sure neither Hugo nor any other process runs on port `1313`.
Playwright runs its own instance of the theme and executes the tests against it.

You can run the tests with `npx playwright test`.

For a reliable and deterministic test environment, the tests run a dedicated
Hugo configuration (`hugo.spec.yaml`). This configuration sets the Sessionize ID
to `test` which makes the theme load a mocked API response from
`assets/test/sessionize-view-all.json`.

## References

[^styleplacement]:
    According to the [HTML
    specification](https://html.spec.whatwg.org/multipage/semantics.html#the-style-element).
