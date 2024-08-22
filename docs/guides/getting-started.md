# Getting Started

## Prerequisites

1. [Hugo](https://gohugo.io/installation/) is installed on your machine.
2. You've at least one event planned on [Sessionize](https://sessionize.com/) (can be a test event).

## Installation

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
                sessionizeId: 123acb56
    ```
6. Run Hugo in development mode:
    ```shell
    hugo server
    ```
7. View your event website on http://localhost:1313/.
