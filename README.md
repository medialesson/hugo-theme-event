# Hugo Conference Theme

Create a website for your [Sessionize](https://sessionize.com/) conference within seconds. 

## Getting started

### Prerequisites

1. [Hugo](https://gohugo.io/installation/) is installed on your machine.
2. You've at least one conference planned on [Sessionize](https://sessionize.com/) (can be a test conference). 

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
4. Clone this repository into the `themes/` directory:
    ```shell
    git clone https://github.com/medialesson/hugo-theme-conference.git themes/conference
    ```
5. Set the `theme`, `sectionPagesMenu` and the Sessionize endpoint ID of your
[Hugo configuration](https://gohugo.io/getting-started/configuration/) like in
the following sample:
    ```yaml
    theme: conference
    sectionPagesMenu: main
    params:
        themes:
            conference:
                # 👇 Fetch the ID of your conference's API endpoint from
                # 👇 https://sessionize.com/app/organizer/schedule/api/0
                # 👇 and enter it here.
                sessionizeId: 123acb56
    ```
6. Run Hugo in development mode:
    ```shell
    hugo server
    ```
7. View you conference website on http://localhost:1313/.

### Configuration

#### Add custom pages to the footer menu

In the `content/` folder of your Hugo project create a Markdown file for the
designated language (e.g., `privacy-policy.en.md`). In the front matter, set the
menu entry to `footer`. For more configuration options, please refer to
[the official Hugo documentation](https://gohugo.io/content-management/menus/#define-in-front-matter).

```yaml
---
title: Privacy Policy
menu: footer
---
```