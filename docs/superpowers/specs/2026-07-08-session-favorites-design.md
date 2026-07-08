# Design: Local Session Favorites

## Summary

Allow visitors to mark sessions as favorites so they can build a personal
schedule, entirely client-side. No backend, no account, no cross-device sync —
favorites are stored in the browser's `localStorage` and persist only on that
browser/device.

## Goals

-   A user can favorite/unfavorite a session from the sessions list page and
    from a session's single page.
-   A user can filter the sessions list to show only their favorited sessions.
-   Favorite state persists across page reloads and navigation, without any
    server involvement.
-   Works within the theme's existing constraints: no JS framework, no build
    pipeline, no new dependencies.

## Non-goals

-   Syncing favorites across devices or browsers.
-   Persisting favorites if the user clears browser storage or uses a different
    browser/incognito session.
-   Any backend storage or account system.

## Approach

Vanilla JavaScript + `localStorage`, following the theme's existing
conventions exactly: small inline `<script>` blocks embedded via Hugo
partials, the same pattern already used by `countdown.html` and the language
redirect script in `baseof.html`. No JS framework or bundler is introduced.

Filtering integrates with the theme's existing **CSS-only sibling-selector
filter mechanism** (already used for day/track filters in
`layouts/sessions/list.html` + `assets/styles/layouts/sessions/list.css`)
rather than introducing a second, JS-driven filtering system. JS is only
responsible for reading `localStorage` and reflecting favorite state into
`data-*` attributes in the DOM; the existing CSS rules take care of
show/hide behavior.

### Alternatives considered

1. **Fully JS-driven filtering** — JS directly shows/hides session elements
   in response to the favorites toggle. Rejected: it would create a second,
   inconsistent filtering mechanism alongside the existing CSS-only one for
   day/track, doubling the logic a future maintainer needs to understand.
2. **Small state library or web component** — Rejected: violates YAGNI and
   introduces the theme's first JS dependency where a ~40-line vanilla script
   suffices.

## Components

### 1. Shared favorites script (`layouts/partials/favorites-script.html`)

An inline `<script>` partial included once (in `baseof.html`, after the
existing scripts) providing:

-   `getFavoriteIds()` — reads and parses the `favoriteSessionIds` key from
    `localStorage` (JSON array of session IDs). Returns `[]` on any error
    (missing key, storage disabled, parse failure).
-   `isFavorite(id)` / `setFavorite(id, isFavorite)` — read/write helpers,
    wrapped in `try/catch` so a `localStorage` failure (e.g., disabled storage,
    private browsing quota) never throws — it just fails to persist silently.
-   `initFavoriteButtons()` — runs on `DOMContentLoaded`:
    -   Finds all `[data-favorite-toggle]` buttons (favorite star buttons).
    -   For each, reads `data-session-id`, sets initial pressed/visual state and
        the row/card's `data-favorite` attribute from storage.
    -   Attaches a `click` listener that toggles storage, updates the clicked
        button's visual state/`aria-pressed`, and updates the ancestor row's
        `data-favorite` attribute (used by the CSS filter).

No polling, no cross-tab sync (out of scope) — state is only read on load and
written on click.

### 2. Favorite star button partial (`layouts/partials/elements/favorite-button.html`)

Reusable partial taking a `sessionId` param, rendering:

```html
<button
    type="button"
    class="favorite-button"
    data-favorite-toggle
    data-session-id="{{ .sessionId }}"
    aria-pressed="false"
    aria-label="{{ T "sessions_page.add_to_favorites" }}">
    <!-- inline star SVG -->
</button>
```

A single inline star SVG (not `<img>`, so CSS can restyle its `fill` based on
`aria-pressed`/a `.is-favorited` class without needing two separate icon
files). The label text swaps between "Add to favorites" / "Remove from
favorites" (i18n) based on state, updated by the shared script.

Used in two places, both as a **corner overlay** (confirmed via mockup):

-   `layouts/partials/event-row.html` — positioned absolutely in the top-right
    corner of each session row/card in the sessions list.
-   `layouts/sessions/single.html` — positioned absolutely in the top-right
    corner of the session hero/information card.

Both call sites wrap in a container with `position: relative` and pass their
own `Params.sessionId`.

### 3. "Favorites only" filter toggle (sessions list page)

Added to `layouts/sessions/list.html` alongside the existing day/track filter
`<input>` elements, following the identical existing pattern:

```html
<input name="filter-favorites" type="checkbox" class="session-filter-input" value="favorites-only" id="filter-favorites-only" />
```

Rendered as its own small filter group (label via i18n, e.g. "My schedule")
next to the day/track filter groups, using the same
`.session-list-filter` / `.session-list-filter__label` markup and styling.

New CSS rule in `assets/styles/layouts/sessions/list.css`, mirroring the
existing day/track sibling-selector rules:

```css
[value='favorites-only'].session-filter-input:checked ~ * .session-day-section [role='presentation']:not([data-favorite='true']) {
    display: none;
}
```

Because `data-favorite="true"` is only ever set client-side (by the shared
script reading `localStorage`), this checkbox has no effect until JS has run
— fully consistent with "no JS = no favorites feature", which is an
acceptable and expected degradation (see Error Handling).

### 4. Icons

New inline star SVG (single icon, outline path, filled via CSS `fill`
based on state) — no new icon files needed since it's inlined directly in
the favorite-button partial (unlike `icons/*.svg` which are used as
standalone `<img>` sources elsewhere in the theme). This avoids a network
request per star and allows pure-CSS color toggling.

### 5. i18n strings

Added to `i18n/en.yaml` and `i18n/de.yaml` under `sessions_page`:

-   `add_to_favorites` — "Add to favorites" / "Zu Favoriten hinzufügen"
-   `remove_from_favorites` — "Remove from favorites" / "Von Favoriten entfernen"
-   `heading_favorites_filter` — "My schedule" / "Mein Zeitplan"

## Data flow

1. Page loads → shared script runs on `DOMContentLoaded` → reads
   `favoriteSessionIds` from `localStorage` → sets `data-favorite` on each
   session row/card and `aria-pressed`/visual state on each star button.
2. User clicks a star button → script toggles the session ID in
   `localStorage` → updates the button's own state and its ancestor row's
   `data-favorite` attribute immediately (no reload needed).
3. User checks "My schedule" filter checkbox → pure CSS (no JS) hides rows
   without `data-favorite="true"`, exactly like the existing day/track
   filters.

No data ever leaves the browser. No sync between tabs is attempted (a second
open tab will reflect updated state only on next reload/navigation).

## Error handling

-   `localStorage` reads/writes are wrapped in `try/catch`. If storage is
    unavailable (disabled, private-mode quota errors, etc.), favoriting still
    toggles the button's visual state for the current page view but silently
    fails to persist — no thrown errors, no broken page.
-   If JavaScript is disabled entirely, star buttons render but are inert
    (no click handler attached), and the "My schedule" filter checkbox simply
    has no effect (nothing is ever marked `data-favorite="true"`). This is
    consistent with existing theme behavior for JS-dependent enhancements
    (e.g., `countdown.html`, which hides its whole widget without JS).

## Testing

New Playwright tests (`tests/session-favorites.spec.ts`):

-   Favoriting a session row on the list page updates the button's
    `aria-pressed` state immediately.
-   Favorite state persists after reloading the sessions list page.
-   Checking "My schedule" shows only favorited sessions and hides the rest.
-   Favoriting a session on its single session page updates state, and
    navigating back to the sessions list reflects the same favorite state on
    the corresponding row.
-   Unfavoriting removes the session from the "My schedule" filtered view.

## Out of scope / future considerations

-   Cross-device or account-based sync.
-   A dedicated "My Schedule" page (explicitly deferred; the list-page filter
    toggle was chosen instead).
-   Real-time sync across multiple open tabs.
