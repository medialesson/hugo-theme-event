# Feature Configuration

The Event theme comes with various features. Some features use common
parameters, while others require dedicated ones. Without configuration, the
theme may exclude features from the build.

### Call to action (CTA)

-   Tbd

### Countdown

The home page displays a countdown that counts down till the start of the event.

### Parameters

-   `startDate`: Start date of the event.

### Featured speakers

This feature highlights speakers marked as top speaker in Sessionize on the home
page.

## Map

The location page can display a map. The theme supports all map services that
provide an embeddable URL of the map (e.g., OpenStreetMap or Google). A free and
open-source map service based on OpenStreetMap is
[uMap](https://umap.openstreetmap.de). With uMap you can create fully
customizable and reusable maps.

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

-   Tbd
