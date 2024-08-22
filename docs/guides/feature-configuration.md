# Feature Configuration

The Event theme comes with various features. Some features use common
parameters, while others require dedicated ones. Without configuration, the
theme may exclude features from the build.

## Map

The location page can display a map. The theme supports all map platforms that
provide an embeddable URL of the map (e.g., OpenStreetMap or Google).

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
