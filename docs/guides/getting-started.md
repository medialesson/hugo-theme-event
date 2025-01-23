# Getting Started

## Prerequisites

1. [Hugo](https://gohugo.io/installation/) is installed on your machine.
2. You've at least one event planned on [Sessionize](https://sessionize.com/) (can be a test event).

## Installation

1. Open a shell of your choice.
1. Create a new Hugo site. Replace `path` with the name of you website. We
   recommend YAML to configure Hugo (`--format yaml`).
    ```shell
     hugo new site [path] [--format yaml]
    ```
1. Switch to the directory of your new site.

    ```shell
    cd [path]
    ```

1. Install npm dependencies for development (e.g. Prettier).

    ```shell
    npm install
    ```

1. Delete folder `archetypes`

1. Clone this repository into the `themes/` directory.

    ```shell
    git clone https://github.com/medialesson/hugo-theme-event.git themes/event
    ```

    Or add it as submodule, which simplifies updates.

    ```shell
    git init
    git submodule add https://github.com/medialesson/hugo-theme-event.git themes/event
    ```

1. Go to the [endpoint
   overview](https://sessionize.com/app/organizer/schedule/api/0) of your
   Sessionize event and create a new endpoint.

    1. As format choose `JSON`.
    2. Choose which sessions you want to see on your website (`Includes sessions`).
    3. If you want to use all features of this theme, select the following
       additional fields.
        - **Sessions:** Submission fields (Track)
        - **Sessions:** Include Service Sessions
        - **Speakers:** Links

1. Add and adapt the following minimal settings to your [Hugo
   configuration](https://gohugo.io/getting-started/configuration/):
    ```yaml
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
                sessionizeId: 67poir7q
    ```
1. Run Hugo in development mode:
    ```shell
    hugo server
    ```
1. View your event website on http://localhost:1313/.
