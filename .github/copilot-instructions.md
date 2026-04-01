# Copilot Instructions for hugo-theme-event

## Overview

This repository contains a **Hugo theme** that creates modern, responsive event websites powered by [Sessionize](https://sessionize.com/). The theme generates session, speaker, and schedule pages automatically from the Sessionize API.

-   **Tech stack:** Hugo Extended (v0.126.0+), Playwright (E2E tests), Node.js LTS, CSS (BEM), TypeScript
-   **Demo site:** https://medialesson.github.io/hugo-theme-event-demo/
-   **Hugo module path:** defined in `config.toml`

---

## Repository Structure

```
.
├── assets/
│   ├── icons/           # SVG icons used in partials
│   ├── images/          # Theme images
│   ├── logos/           # Logo assets
│   ├── styles/          # CSS files (BEM, auto-merged by Hugo)
│   │   └── partials/    # Mirror of layouts/partials/ for per-partial styles
│   └── test/            # Mock Sessionize API response (sessionize-view-all.json)
├── content/
│   ├── _content.gotmpl  # Dynamic content generation from Sessionize data
│   ├── sessions/        # Session content files
│   └── speakers/        # Speaker content files
├── i18n/                # Translation files (de.yaml, en.yaml)
├── layouts/
│   ├── _default/        # Base templates (baseof.html, etc.)
│   ├── home.html        # Homepage template
│   ├── partials/        # Reusable template components
│   ├── sessions/        # Session list and detail templates
│   ├── speakers/        # Speaker list and detail templates
│   └── miscellaneous/   # Other page templates
├── static/
│   └── fonts/           # Font files
├── tests/               # Playwright E2E tests
├── hugo.yaml            # Main theme parameter documentation and language config
├── hugo.spec.yaml       # Test-only Hugo configuration (uses mocked Sessionize data)
├── playwright.config.ts # Playwright test configuration
└── config.toml          # Hugo module requirements
```

---

## Development Setup

```shell
# Install Node.js dependencies (Prettier, ESLint, Playwright)
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Start the local dev server (uses test configuration with mocked data)
hugo serve --config hugo.spec.yaml
# Open http://localhost:1313/
```

---

## Testing

Tests use [Playwright](https://playwright.dev/) and are located in the `tests/` directory.

### Running Tests

```shell
npx playwright test
```

Make sure port `1313` is free before running tests.

### Test Configuration (`hugo.spec.yaml`)

The dedicated test config sets `sessionizeId: test`, which makes Hugo load mocked Sessionize data from `assets/test/sessionize-view-all.json` instead of calling the live API.

### For Copilot Pull Requests

When running tests for a Copilot pull request:

1. **Use the demo Sessionize ID `67poir7q`** in `hugo.spec.yaml` to render realistic event content during test and preview runs:

    ```yaml
    params:
        themes:
            event:
                sessionizeId: 67poir7q
    ```

2. **Always capture screenshots** for every test run so reviewers can visually verify rendered output. Screenshots are uploaded as a CI artifact (see `.github/workflows/playwright.yaml`).

---

## Code Conventions

### Parameters

-   All theme parameters live under `params.themes.event` in `hugo.yaml` / `hugo.spec.yaml`.
-   Image paths go under `params.themes.event.images`.
-   Color values go under `params.themes.event.colors`.
-   **Parameter names are permanent.** Renaming a parameter is a breaking change.

### Styling (CSS / BEM)

-   All `<style>` elements must be placed inside `<head>` (loaded from the main template, not from partials).
-   The theme auto-merges all `*.css` files under `assets/` into one minified file.
-   All style files go under `assets/styles/`.
-   Mirror the `layouts/partials/` folder structure under `assets/styles/partials/`.
-   Follow the [BEM](https://getbem.com) naming convention with the [Two Dashes](https://bem.info/methodology/naming-convention/#two-dashes-style) schema (e.g., `block__element--modifier`).
-   **Never use type selectors or ID selectors.**

### Translations (i18n)

-   Keys follow the pattern `[feature].[element]` — e.g., `featured_speakers_section.heading`.
-   `[feature]` = descriptive functional area (e.g., `about_page`, `menu`, `countdown`).
-   `[element]` = sub-component (e.g., `heading`, `day_filter`).
-   Keys use **only lowercase letters, underscores, and exactly one period**.
-   **Translation key names are permanent.** Renaming a key is a breaking change.
-   Add new keys to both `i18n/en.yaml` and `i18n/de.yaml`.

### Hugo Templates

-   Template logic lives in `layouts/`.
-   Reusable components are Hugo partials under `layouts/partials/`.
-   Dynamic content (sessions, speakers) is generated via `content/_content.gotmpl`.

---

## CI Workflows

| Workflow          | Trigger           | Purpose                                                      |
| ----------------- | ----------------- | ------------------------------------------------------------ |
| `playwright.yaml` | Push/PR to `main` | Run Playwright E2E tests; upload HTML report and screenshots |
| `hugo.yaml`       | Push/PR to `main` | Build theme with `--panicOnWarning` (strict validation)      |
| `formatting.yaml` | Push/PR to `main` | Run Prettier and ESLint checks                               |

---

## Pull Request Checklist

Before opening a PR, verify:

-   Self-review completed
-   Hard-to-understand code is commented
-   Documentation updated if applicable
-   Playwright tests added or updated
-   Changes tested on different screen sizes
-   No parameter or translation key names changed (breaking changes)
-   Changes conform to [CONTRIBUTING.md](../CONTRIBUTING.md)
