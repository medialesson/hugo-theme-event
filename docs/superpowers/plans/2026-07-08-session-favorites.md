# Session Favorites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let visitors favorite sessions (from the sessions list and single session pages) and filter the sessions list to show only their favorites, using only client-side `localStorage` — no backend.

**Architecture:** Vanilla JavaScript (no framework/bundler) reading and writing a `favoriteSessionIds` array in `localStorage`, mirroring the theme's existing inline-`<script>` convention (see `layouts/partials/countdown.html`). The JS only toggles `data-favorite`/`aria-pressed` attributes in the DOM; the actual show/hide filtering on the sessions list reuses the theme's existing **CSS-only sibling-selector filter mechanism** (see `assets/styles/layouts/sessions/list.css`), so no JS-driven filtering logic is introduced.

**Tech Stack:** Hugo templates (Go templates), vanilla JS (ES2021, no build step), plain CSS (auto-concatenated via `resources.Match "**/*.css"` in `layouts/_default/baseof.html:83`), Playwright for e2e tests.

## Global Constraints

- No new npm dependencies, no JS framework, no bundler — inline `<script>` partials only, matching `layouts/partials/countdown.html` and `layouts/_default/baseof.html:199-222`.
- All CSS files are auto-discovered and concatenated — any new `.css` file under `assets/styles/` is automatically included; no manual `@import` or `<link>` needed.
- Favorites must degrade gracefully with JS disabled or `localStorage` unavailable: no thrown errors, no broken page (see `layouts/partials/countdown.html:24-27` for the existing "hide enhancement if JS unavailable" pattern).
- All user-facing strings go through Hugo's `T` i18n function and must be added to both `i18n/en.yaml` and `i18n/de.yaml`.
- Tests are Playwright specs under `tests/`, run via `npx playwright test` (spins up `hugo serve --config hugo.spec.yaml` automatically per `playwright.config.ts:26-30`). Requires the `hugo` CLI to be installed and on `PATH`.
- Follow existing code style: 4-space indentation in Hugo templates, Prettier/ESLint config in `.prettierrc` / `eslint.config.js` (semi-colons required, Prettier formatting enforced).

---

## Task 1: Favorite button on the sessions list (star toggle + storage)

**Files:**
- Create: `layouts/partials/elements/favorite-button.html`
- Create: `assets/styles/elements/favorite-button.css`
- Create: `layouts/partials/favorites-script.html`
- Modify: `layouts/_default/baseof.html:222` (add script include after existing scripts, before `<main>`)
- Modify: `layouts/partials/event-row.html` (wrap row in a positioned container, add favorite button)
- Modify: `assets/styles/layouts/partials/event-row.css` (add wrapper positioning)
- Modify: `layouts/sessions/list.html:89-118` (pass `sessionId` to the partial, add `data-session-row-id` to the `<li>`)
- Modify: `i18n/en.yaml`, `i18n/de.yaml` (add `add_to_favorites` / `remove_from_favorites` strings)
- Test: `tests/session-favorites.spec.ts` (new file)

**Interfaces:**
- Produces (used by later tasks):
  - Storage key: `localStorage['favoriteSessionIds']` — JSON array of session ID strings.
  - Global functions defined inside the IIFE in `favorites-script.html`: `getFavoriteIds()` returns `string[]`, `saveFavoriteIds(ids: string[])`, `applyButtonState(button: HTMLElement, favorited: boolean)`, `initFavoriteButtons()`. These are not attached to `window` (kept inside the IIFE) — later tasks reuse this same script include, they do not need to call these functions directly.
  - Markup contract: any favorite button has `[data-favorite-toggle]`, `data-session-id="<id>"`, `data-label-add="..."`, `data-label-remove="..."`. Any element that should reflect filterable favorite state has `data-session-row-id="<id>"` as an ancestor of the button; the script sets `data-favorite="true"|"false"` on it.
  - Partial signature: `partial "elements/favorite-button.html" (dict "sessionId" <string>)`.

- [ ] **Step 1: Write the failing test**

Create `tests/session-favorites.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test(`Should show a favorite button on each session row that is unfavorited by default`, async ({
    page,
}) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    const favoriteButton = sessionRow.locator('[data-favorite-toggle]');
    await expect(favoriteButton).toBeVisible();
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Zu Favoriten hinzufügen');
});

test(`Should mark a session as favorite when clicking its favorite button`, async ({ page }) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    const favoriteButton = sessionRow.locator('[data-favorite-toggle]');

    await favoriteButton.click();

    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Von Favoriten entfernen');
});

test(`Should persist favorite state across page reloads`, async ({ page }) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    await sessionRow.locator('[data-favorite-toggle]').click();

    await page.reload();

    const reloadedButton = page.locator('[data-session-row-id="729573"] [data-favorite-toggle]');
    await expect(reloadedButton).toHaveAttribute('aria-pressed', 'true');
    await expect(reloadedButton).toHaveAttribute('aria-label', 'Von Favoriten entfernen');
});

test(`Should unmark a session as favorite when clicking its favorite button again`, async ({
    page,
}) => {
    await page.goto('/sessions/');

    const sessionRow = page.locator('[data-session-row-id="729573"]');
    const favoriteButton = sessionRow.locator('[data-favorite-toggle]');

    await favoriteButton.click();
    await favoriteButton.click();

    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Zu Favoriten hinzufügen');
});
```

Notes on this test file:
- The sessions list `<li>` elements have `role="presentation"` (see `layouts/sessions/list.html`), which strips the implicit `listitem` accessibility role — so locate rows by `[data-session-row-id]` (the fixture's "Emma's Session" has Sessionize ID `729573`, see `assets/test/sessionize-view-all.json`), not `getByRole('listitem')`.
- The favorite button's accessible name (`aria-label`) changes after each click (add ↔ remove), so a locator captured via `getByRole('button', { name: ... })` before a click would stop matching after the label changes. Locate the button by the stable `[data-favorite-toggle]` attribute instead, and assert the label via `toHaveAttribute('aria-label', ...)`.
- `hugo.spec.yaml` sets `defaultContentLanguage: de`, so root-level pages render German i18n strings (matching the existing `session-page.spec.ts`, which asserts the German `'mehr erfahren'` label) — use the German translations from `i18n/de.yaml` in test assertions, not the English ones from `i18n/en.yaml`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/session-favorites.spec.ts`
Expected: FAIL — `page.locator('[data-favorite-toggle]')` finds no element, because no favorite button exists in the markup yet.

- [ ] **Step 3: Create the favorite button partial**

Create `layouts/partials/elements/favorite-button.html`:

```html
{{ $input := . }}


<button
    type="button"
    class="favorite-button"
    data-favorite-toggle
    data-session-id="{{ $input.sessionId }}"
    data-label-add="{{ T "sessions_page.add_to_favorites" }}"
    data-label-remove="{{ T "sessions_page.remove_from_favorites" }}"
    aria-pressed="false"
    aria-label="{{ T "sessions_page.add_to_favorites" }}">
    <svg
        class="favorite-button__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true">
        <path
            d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.7 7.1-.6z" />
    </svg>
</button>
```

- [ ] **Step 4: Add the favorite button styles**

Create `assets/styles/elements/favorite-button.css`:

```css
.favorite-button {
    all: unset;
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    cursor: pointer;
    z-index: 1;
}

.favorite-button__icon {
    width: 1.5rem;
    height: 1.5rem;
    fill: none;
    stroke: var(--color-secondary-darker);
    stroke-width: 1.5;
    transition:
        fill 0.2s ease,
        stroke 0.2s ease;
}

.favorite-button[aria-pressed='true'] .favorite-button__icon {
    fill: var(--color-primary);
    stroke: var(--color-primary);
}

.favorite-button:hover .favorite-button__icon {
    stroke: var(--color-primary);
}
```

- [ ] **Step 5: Create the shared favorites script partial**

Create `layouts/partials/favorites-script.html`:

```html
<script>
    (function () {
        var STORAGE_KEY = 'favoriteSessionIds';

        function getFavoriteIds() {
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                var parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }

        function saveFavoriteIds(ids) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
            } catch (e) {
                // Storage unavailable (disabled, private-mode quota, etc.) — ignore.
            }
        }

        function applyButtonState(button, favorited) {
            button.setAttribute('aria-pressed', favorited ? 'true' : 'false');
            button.setAttribute(
                'aria-label',
                favorited ? button.dataset.labelRemove : button.dataset.labelAdd,
            );

            var row = button.closest('[data-session-row-id]');
            if (row) {
                row.setAttribute('data-favorite', favorited ? 'true' : 'false');
            }
        }

        function initFavoriteButtons() {
            var favoriteIds = getFavoriteIds();

            document.querySelectorAll('[data-favorite-toggle]').forEach(function (button) {
                var sessionId = button.dataset.sessionId;
                applyButtonState(button, favoriteIds.indexOf(sessionId) !== -1);

                button.addEventListener('click', function () {
                    var currentIds = getFavoriteIds();
                    var index = currentIds.indexOf(sessionId);
                    var nowFavorited = index === -1;

                    if (nowFavorited) {
                        currentIds.push(sessionId);
                    } else {
                        currentIds.splice(index, 1);
                    }

                    saveFavoriteIds(currentIds);
                    applyButtonState(button, nowFavorited);
                });
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFavoriteButtons);
        } else {
            initFavoriteButtons();
        }
    })();
</script>
```

- [ ] **Step 6: Include the script partial in the base layout**

In `layouts/_default/baseof.html`, find this existing block (around line 213-222):

```html
        <script>
            function checkWhichMenuToUse() {
                document.body.setAttribute('data-menu-mode', 'header');
                if (pageHeaderContent.scrollWidth > pageHeaderContent.clientWidth) {
                    document.body.setAttribute('data-menu-mode', 'sidebar');
                }
            }

            new ResizeObserver(checkWhichMenuToUse).observe(document.body);
        </script>

        <main class="page-main">
```

Replace it with:

```html
        <script>
            function checkWhichMenuToUse() {
                document.body.setAttribute('data-menu-mode', 'header');
                if (pageHeaderContent.scrollWidth > pageHeaderContent.clientWidth) {
                    document.body.setAttribute('data-menu-mode', 'sidebar');
                }
            }

            new ResizeObserver(checkWhichMenuToUse).observe(document.body);
        </script>

        {{- partial "favorites-script.html" }}

        <main class="page-main">
```

- [ ] **Step 7: Add i18n strings**

In `i18n/en.yaml`, after the line `sessions_page.heading_track_filter: Track`, add:

```yaml
sessions_page.add_to_favorites: Add to favorites
sessions_page.remove_from_favorites: Remove from favorites
```

In `i18n/de.yaml`, after the line `sessions_page.heading_track_filter: Track`, add:

```yaml
sessions_page.add_to_favorites: Zu Favoriten hinzufügen
sessions_page.remove_from_favorites: Von Favoriten entfernen
```

- [ ] **Step 8: Wire the favorite button into `event-row.html`**

Replace the full contents of `layouts/partials/event-row.html`:

```html
{{ $input := . }}


<div class="event-row-wrapper">
    <a
        {{- if $input.isServiceSession }}
            class="event-row event-row--service-session"
        {{- else }}
            class="event-row" href="{{- $input.link }}"
        {{- end }}>
        <div class="event-row__left">
            {{- if $input.track }}
                <h1 class="event-row__track">
                    #{{- $input.track | upper -}}
                </h1>
            {{- end }}
            <h2 class="event-row__title">
                {{- $input.title -}}
            </h2>
            <h3 class="event-row__speakers">
                {{- range $input.speakers }}
                    <span>{{- .name -}}</span>
                {{- end }}
            </h3>
            <h3 class="event-row__room">
                {{- T "sessions_page.room" }}:
                {{ $input.room -}}
            </h3>
        </div>
        <div class="event-row__right">
            <ul class="event-row__avatars">
                {{- range $input.speakers }}
                    {{- $speaker := . }}
                    {{- with $speaker.avatarResource }}
                        {{- with images.Filter (images.Process "resize 128x") . }}
                            <li>
                                <img
                                    class="event-row__avatar-img"
                                    src="{{ .RelPermalink }}"
                                    alt="{{ $speaker.name }}"
                                    width="{{ .Width }}"
                                    height="{{ .Height }}" />
                            </li>
                        {{- end }}
                    {{- else }}
                        {{- with resources.Get "images/avatar-image-fallback.webp" }}
                            <li>
                                <img
                                    class="event-row__avatar-img"
                                    src="{{ .RelPermalink }}"
                                    alt="{{ $speaker.name }}"
                                    width="{{ .Width }}"
                                    height="{{ .Height }}" />
                            </li>
                        {{- end }}
                    {{- end }}
                {{- end }}
            </ul>

            {{- partial "session-categories.html" (
                dict
                "categories" $input.categories
                "listClasses" "event-row__categories"
                "listItemClasses" "event-row__category"
                )
            -}}
        </div>
    </a>

    {{- if not $input.isServiceSession }}
        {{- partial "elements/favorite-button.html" (dict "sessionId" $input.sessionId) }}
    {{- end }}
</div>
```

- [ ] **Step 9: Add wrapper positioning CSS**

In `assets/styles/layouts/partials/event-row.css`, add this rule at the top of the file (before `.event-row`):

```css
.event-row-wrapper {
    position: relative;
    width: 100%;
}
```

- [ ] **Step 10: Pass `sessionId` into the partial call and mark rows for filtering**

In `layouts/sessions/list.html`, find this block (around lines 89-118):

```html
                        {{- range .Pages }}
                            {{- $page := . }}
                            <li
                                role="presentation"
                                {{- if .Params.track }}
                                    data-track="{{ (index $sessionTrackIndices .Params.track) }}"
                                {{- end }}>
                                {{- $transformedSpeakers := slice }}
                                {{- range .Params.speakers }}
                                    {{- $speakerAvatarResource := ($sectionResources.GetMatch (printf "avatar-%s-%s.*" $page.Params.sessionId .id)) }}
                                    {{- $transformedSpeakers = $transformedSpeakers | append (
                                        dict
                                        "name" .fullName
                                        "avatarResource" $speakerAvatarResource
                                        )
                                    }}
                                {{- end }}
                                {{- partial "event-row.html" (
                                    dict
                                    "track" .Params.track
                                    "title" .Title
                                    "link" .RelPermalink
                                    "speakers" $transformedSpeakers
                                    "isServiceSession" .Params.isServiceSession
                                    "room" .Params.room.name
                                    "categories" .Params.categories
                                    )
                                }}
                            </li>
                        {{- end }}
```

Replace it with:

```html
                        {{- range .Pages }}
                            {{- $page := . }}
                            <li
                                role="presentation"
                                data-session-row-id="{{ .Params.sessionId }}"
                                {{- if .Params.track }}
                                    data-track="{{ (index $sessionTrackIndices .Params.track) }}"
                                {{- end }}>
                                {{- $transformedSpeakers := slice }}
                                {{- range .Params.speakers }}
                                    {{- $speakerAvatarResource := ($sectionResources.GetMatch (printf "avatar-%s-%s.*" $page.Params.sessionId .id)) }}
                                    {{- $transformedSpeakers = $transformedSpeakers | append (
                                        dict
                                        "name" .fullName
                                        "avatarResource" $speakerAvatarResource
                                        )
                                    }}
                                {{- end }}
                                {{- partial "event-row.html" (
                                    dict
                                    "sessionId" .Params.sessionId
                                    "track" .Params.track
                                    "title" .Title
                                    "link" .RelPermalink
                                    "speakers" $transformedSpeakers
                                    "isServiceSession" .Params.isServiceSession
                                    "room" .Params.room.name
                                    "categories" .Params.categories
                                    )
                                }}
                            </li>
                        {{- end }}
```

- [ ] **Step 11: Run the tests to verify they pass**

Run: `npx playwright test tests/session-favorites.spec.ts`
Expected: All 4 tests PASS.

- [ ] **Step 12: Commit**

```bash
git add layouts/partials/elements/favorite-button.html assets/styles/elements/favorite-button.css layouts/partials/favorites-script.html layouts/_default/baseof.html layouts/partials/event-row.html assets/styles/layouts/partials/event-row.css layouts/sessions/list.html i18n/en.yaml i18n/de.yaml tests/session-favorites.spec.ts
git commit -m "feat: add favorite button and localStorage persistence to session rows"
```

---

## Task 2: Favorite button on the single session page

**Files:**
- Modify: `layouts/sessions/single.html:1-21`
- Modify: `assets/styles/layouts/sessions/single.css:10-16`
- Test: `tests/session-favorites.spec.ts` (append tests)

**Interfaces:**
- Consumes: `partial "elements/favorite-button.html" (dict "sessionId" <string>)` from Task 1. Session ID available as `page.Params.sessionId` on this template.
- Produces: no new interfaces; single session page becomes a second consumer of the same favorite button + shared script from Task 1.

- [ ] **Step 1: Write the failing test**

Append to `tests/session-favorites.spec.ts`:

```typescript
test(`Should show a favorite button on the single session page`, async ({ page }) => {
    await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

    const favoriteButton = page.locator('[data-favorite-toggle]');
    await expect(favoriteButton).toBeVisible();
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Zu Favoriten hinzufügen');
});

test(`Should favorite a session from its single session page and reflect it in the sessions list`, async ({
    page,
}) => {
    await page.goto('/sessions/mastering-personal-branding-in-the-digital-age-729571');

    await page.locator('[data-favorite-toggle]').click();

    await page.goto('/sessions/');

    const favoriteButton = page.locator('[data-session-row-id="729571"] [data-favorite-toggle]');
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Von Favoriten entfernen');
});
```

Use `[data-favorite-toggle]` and `[data-session-row-id]` attribute locators, not `getByRole('listitem')` or role+name locators — see the notes under Task 1's test file for why.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx playwright test tests/session-favorites.spec.ts -g "single session page"`
Expected: FAIL — no favorite button rendered on `layouts/sessions/single.html` yet.

- [ ] **Step 3: Add the favorite button to the single session page**

In `layouts/sessions/single.html`, find this block (lines 5-21):

```html
            <div class="single-session-section__session-information">
                <h1 class="single-session-section__heading">
                    <div class="single-session-section__metadata">
                        {{- if page.Params.isScheduled }}
                            {{- if page.Params.track }}
                                <span class="single-session-section__pipe">
                                    {{- partial "elements/hashtag.html" (dict "hashtag" page.Params.track) }}
                                </span>
                            {{- end }}
                            <span class="single-session-section__pipe">
                                {{- partial "elements/date-and-time.html" (dict "date" page.Params.startsAt ) }}
                            </span>
                            @{{ page.Params.room.name }}
                        {{- end }}
                    </div>
                    {{- page.Title -}}
                </h1>
```

Replace it with:

```html
            <div class="single-session-section__session-information">
                {{- partial "elements/favorite-button.html" (dict "sessionId" page.Params.sessionId) }}
                <h1 class="single-session-section__heading">
                    <div class="single-session-section__metadata">
                        {{- if page.Params.isScheduled }}
                            {{- if page.Params.track }}
                                <span class="single-session-section__pipe">
                                    {{- partial "elements/hashtag.html" (dict "hashtag" page.Params.track) }}
                                </span>
                            {{- end }}
                            <span class="single-session-section__pipe">
                                {{- partial "elements/date-and-time.html" (dict "date" page.Params.startsAt ) }}
                            </span>
                            @{{ page.Params.room.name }}
                        {{- end }}
                    </div>
                    {{- page.Title -}}
                </h1>
```

- [ ] **Step 4: Add positioning CSS for the hero button**

In `assets/styles/layouts/sessions/single.css`, find this rule (lines 10-16):

```css
.single-session-section__session-information {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2.625rem;
    width: 70%;
}
```

Replace it with:

```css
.single-session-section__session-information {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2.625rem;
    width: 70%;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx playwright test tests/session-favorites.spec.ts -g "single session page"`
Expected: Both tests PASS.

- [ ] **Step 6: Run the full favorites test file to check for regressions**

Run: `npx playwright test tests/session-favorites.spec.ts`
Expected: All tests PASS (6 total: 4 from Task 1, 2 from Task 2).

- [ ] **Step 7: Commit**

```bash
git add layouts/sessions/single.html assets/styles/layouts/sessions/single.css tests/session-favorites.spec.ts
git commit -m "feat: add favorite button to the single session page"
```

---

## Task 3: "My Schedule" filter toggle on the sessions list

**Files:**
- Modify: `layouts/sessions/list.html:33-73` (add filter checkbox + filter group UI)
- Modify: `assets/styles/layouts/sessions/list.css` (add favorites-only CSS filter rule)
- Modify: `i18n/en.yaml`, `i18n/de.yaml` (add filter heading/label strings)
- Test: `tests/session-favorites.spec.ts` (append tests)

**Interfaces:**
- Consumes: `data-session-row-id` / `data-favorite` attributes produced on session `<li>` elements by Task 1's `favorites-script.html`.
- Produces: no new interfaces for later tasks (this is the final task in the plan).

- [ ] **Step 1: Write the failing test**

Append to `tests/session-favorites.spec.ts`:

```typescript
test(`Should show only favorited sessions when "Nur Favoriten anzeigen" is checked`, async ({
    page,
}) => {
    await page.goto('/sessions/');

    await page.locator('[data-session-row-id="729573"] [data-favorite-toggle]').click();

    await page.getByLabel('Nur Favoriten anzeigen').check();

    await expect(page.locator('[data-session-row-id="729573"]')).toBeVisible();
    await expect(page.locator('[data-session-row-id="729572"]')).toBeHidden();
});

test(`Should show all sessions again when "Nur Favoriten anzeigen" is unchecked`, async ({
    page,
}) => {
    await page.goto('/sessions/');

    await page.locator('[data-session-row-id="729573"] [data-favorite-toggle]').click();

    const favoritesOnlyCheckbox = page.getByLabel('Nur Favoriten anzeigen');
    await favoritesOnlyCheckbox.check();
    await favoritesOnlyCheckbox.uncheck();

    await expect(page.locator('[data-session-row-id="729572"]')).toBeVisible();
});
```

Use `[data-session-row-id="..."]` locators (Emma's Session = `729573`, Jackson's Session = `729572`, per `assets/test/sessionize-view-all.json`), not `getByRole('listitem')` — see the notes under Task 1's test file for why.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx playwright test tests/session-favorites.spec.ts -g "Nur Favoriten anzeigen"`
Expected: FAIL — no element labeled "Nur Favoriten anzeigen" exists yet.

- [ ] **Step 3: Add i18n strings for the filter**

In `i18n/en.yaml`, after the line `sessions_page.remove_from_favorites: Remove from favorites` (added in Task 1), add:

```yaml
sessions_page.heading_favorites_filter: My Schedule
sessions_page.favorites_filter_label: Show favorites only
```

In `i18n/de.yaml`, after the line `sessions_page.remove_from_favorites: Von Favoriten entfernen` (added in Task 1), add:

```yaml
sessions_page.heading_favorites_filter: Mein Zeitplan
sessions_page.favorites_filter_label: Nur Favoriten anzeigen
```

- [ ] **Step 4: Add the filter checkbox input**

In `layouts/sessions/list.html`, find this block (lines 23-31):

```html
    {{- range $index, $element := $sessionsGroupedByTrack }}
        <input
            name="filter-track"
            type="checkbox"
            class="session-filter-input"
            value="track-{{ $index }}"
            id="filter-track-{{ $index }}"
            checked />
    {{- end }}
```

Replace it with:

```html
    {{- range $index, $element := $sessionsGroupedByTrack }}
        <input
            name="filter-track"
            type="checkbox"
            class="session-filter-input"
            value="track-{{ $index }}"
            id="filter-track-{{ $index }}"
            checked />
    {{- end }}

    <input
        name="filter-favorites"
        type="checkbox"
        class="session-filter-input"
        value="favorites-only"
        id="filter-favorites-only" />
```

- [ ] **Step 5: Add the filter group UI**

In `layouts/sessions/list.html`, find this block (lines 55-70, the track filter `<article>`):

```html
                {{- if gt ($sessionsGroupedByTrack | len) 1 }}
                    <article class="session-list-filter">
                        <h2 class="session-list-filter__heading">
                            {{- T "sessions_page.heading_track_filter" }}
                        </h2>
                        <menu class="session-list-filter__menu">
                            {{- range $index, $element := $sessionsGroupedByTrack }}
                                <li role="presentation">
                                    <label class="session-list-filter__label" for="filter-track-{{ $index }}">
                                        #{{- $element.Key | upper }}
                                    </label>
                                </li>
                            {{- end }}
                        </menu>
                    </article>
                {{- end }}
            </div>
        </div>
    </header>
```

Replace it with:

```html
                {{- if gt ($sessionsGroupedByTrack | len) 1 }}
                    <article class="session-list-filter">
                        <h2 class="session-list-filter__heading">
                            {{- T "sessions_page.heading_track_filter" }}
                        </h2>
                        <menu class="session-list-filter__menu">
                            {{- range $index, $element := $sessionsGroupedByTrack }}
                                <li role="presentation">
                                    <label class="session-list-filter__label" for="filter-track-{{ $index }}">
                                        #{{- $element.Key | upper }}
                                    </label>
                                </li>
                            {{- end }}
                        </menu>
                    </article>
                {{- end }}

                <article class="session-list-filter">
                    <h2 class="session-list-filter__heading">
                        {{- T "sessions_page.heading_favorites_filter" }}
                    </h2>
                    <menu class="session-list-filter__menu">
                        <li role="presentation">
                            <label class="session-list-filter__label" for="filter-favorites-only">
                                {{- T "sessions_page.favorites_filter_label" }}
                            </label>
                        </li>
                    </menu>
                </article>
            </div>
        </div>
    </header>
```

- [ ] **Step 6: Add the CSS filter rule**

In `assets/styles/layouts/sessions/list.css`, find the closing rule of the track filter block (around lines 148-152):

```css
[value='track-0'].session-filter-input:checked ~ * [for='filter-track-0']:hover,
[value='track-1'].session-filter-input:checked ~ * [for='filter-track-1']:hover,
[value='track-2'].session-filter-input:checked ~ * [for='filter-track-2']:hover,
[value='track-3'].session-filter-input:checked ~ * [for='filter-track-3']:hover,
[value='track-4'].session-filter-input:checked ~ * [for='filter-track-4']:hover,
[value='track-5'].session-filter-input:checked ~ * [for='filter-track-5']:hover,
[value='track-6'].session-filter-input:checked ~ * [for='filter-track-6']:hover,
[value='track-7'].session-filter-input:checked ~ * [for='filter-track-7']:hover,
[value='track-8'].session-filter-input:checked ~ * [for='filter-track-8']:hover,
[value='track-9'].session-filter-input:checked ~ * [for='filter-track-9']:hover {
```

Directly after that rule's closing `}`, add:

```css
[value='favorites-only'].session-filter-input:checked
    ~ *
    [data-session-row-id]:not([data-favorite='true']) {
    display: none;
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx playwright test tests/session-favorites.spec.ts -g "Nur Favoriten anzeigen"`
Expected: Both tests PASS.

- [ ] **Step 8: Run the full favorites test file and the existing session-page suite to check for regressions**

Run: `npx playwright test tests/session-favorites.spec.ts tests/session-page.spec.ts`
Expected: All tests PASS (8 favorites tests + existing session-page tests unaffected).

- [ ] **Step 9: Commit**

```bash
git add layouts/sessions/list.html assets/styles/layouts/sessions/list.css i18n/en.yaml i18n/de.yaml tests/session-favorites.spec.ts
git commit -m "feat: add \"Nur Favoriten anzeigen\" filter to the sessions list"
```

---

## Final Verification

- [ ] **Step 1: Run the full Playwright suite**

Run: `npx playwright test`
Expected: All tests PASS, including the 8 new tests in `tests/session-favorites.spec.ts` and all pre-existing tests.

- [ ] **Step 2: Run lint-staged checks manually on changed files**

Run: `npx eslint layouts/partials/favorites-script.html tests/session-favorites.spec.ts --no-error-on-unmatched-pattern`
Run: `npx prettier --check layouts/partials/elements/favorite-button.html layouts/partials/favorites-script.html layouts/partials/event-row.html layouts/sessions/list.html layouts/sessions/single.html assets/styles/elements/favorite-button.css assets/styles/layouts/partials/event-row.css assets/styles/layouts/sessions/list.css assets/styles/layouts/sessions/single.css tests/session-favorites.spec.ts i18n/en.yaml i18n/de.yaml`
Expected: No errors. If Prettier reports formatting issues, run `npx prettier --write <file>` on the affected file(s) and re-run the check.

