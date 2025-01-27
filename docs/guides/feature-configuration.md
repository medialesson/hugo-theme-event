# Feature Configuration

The Event theme comes with various features. Some features use common
parameters, while others require dedicated ones. Without configuration, the
theme may exclude features from the build.

## Call to action (CTA)

To encourage users to buy tickets for your event, the Event theme contains
various elements that display messages and interactions.

### Privacy concern

When using the Eventbrite integration, Eventbrite will open various connections
to third party servers. These connections are not established before the user
clicks on the CTA button. However, depending on where you operate your website,
you may need to obtain the user's consent before establishing such connections
("cookie banner").

### Parameters

-   `callToAction.eventbrite.eventId`: ID of an event from Eventbrite. If set,
    users will see an embedded ticket order dialog when they click on the CTA
    button. To get the event ID, open the dashboard of your event on Eventbrite and
    take the 12-digit number in the URL.
-   `callToAction.other.url`: Any URL to which users are forwarded to when they
    click on the CTA button and Eventbrite is not used.
-   `callToAction.enableBanner`: Boolean flag to show/hide the CTA banner on top
    of the page. To change the text of the banner, overwrite the corresponding
    translations.

## Countdown

The home page displays a countdown that counts down till the start of the event.

### Parameters

-   `startDate`: Start date of the event.

## Featured speakers

This feature highlights speakers marked as top speaker in Sessionize on the home
page.

## Featured speakers

This feature highlights selected sessions on the home page. Because Sessionize has no
corresponding functionality, the featured sessions must be configured in the
theme parameters.

Please note that this feature presents the first 200 characters of an event's
description and up to two speakers.

### Parameters

-   `featuredSessions`: A list of Sessionize session IDs. You can find the ID of a session
    on the session's page of your event on Sessionize. In the URL, you'll find the
    session ID in form of a number or UUID (a.k.a. GUID).

    **IMPORTANT**: The list items must be strings. If your session ID is a
    number, put it explicitly in quotes (e.g., `'123456'`).

## Map

The location page can display a map. The theme supports all map services that
provide an embeddable URL of the map (e.g., OpenStreetMap or Google). A free and
open-source map service based on OpenStreetMap is
[uMap](https://umap.openstreetmap.de). With uMap you can create fully
customizable and reusable maps.

### Privacy concern

When using the map feature, a website of the map service gets embedded into the
location page. This connection, by design, sends personally identifiable data to
the map service. Depending on where you operate your website, you may need to
obtain the user's consent before establishing such connections ("cookie
banner").

### Parameters

-   `map.embeddableMapUrl`: URL of the map to include in the page.
-   `map.viewLargerMapUrl`: Standalone URL of the map (optional). If set, the
    theme will display a link to this URL.

## Organizing team

The about page can present the organization team of your event.

### Parameters

-   `organizers`: A list of Sessionize speaker IDs. You can find the ID of a speaker
    on the speaker's page of your event on Sessionize. In the URL, you'll find the
    speaker ID in form of a UUID (a.k.a. GUID).

## Sponsors and partners

The sponsors page lists all event sponsors and partners. Additionally, the home
page also displays the sponsors.

### Parameters

-   `sponsors`: A list of objects with properties `logo`, `url` and `name`.
-   `partners`: Same structure as `sponsors`, just for partners.

## Social links

The sidebar and footer can display links to social media profiles.

### Parameters

-   `socialLinks.xUrl`: URL to a X (Twitter) profile.
-   `socialLinks.facebookUrl`: URL to a Facebook profile.
-   `socialLinks.linkedinUrl`: URL to a LinkedIn profile.

## Tracks and other session categories

All categories of a session provided via the Sessionize API get displayed in the
various session descriptions as a list of tags. If you want a specific category
not to be visible, turn it off in the configuration of the Sessionize API.

One dedicated category is interpreted as track of a session. This category is
also part of each session description, but in a more prominent way and with
additional features (e.g., filtering).

### Parameters

-   `trackCategoryTitle`: Name of the category used for the session tracks
    (default: `Track`).
