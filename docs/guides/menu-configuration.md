## Menu Configuration

Hugo offers various ways how you can create multilingual menus. In the initial
setup above we used `sectionPagesMenu: main` to make Hugo create menu entries
automatically for each section. This option is very limited and gives you no
control about the order of the menu entries.

Another option is to configure menus in front matter. This option spreads the
menu configuration over multiple files. Therefore, we recommend to configure
menus in the Hugo configuration of your project. That way, you have everything
in one place.

This theme offers a `main` menu, a `footer` menu and a `secondary` menu. You can
create menu entries for contents created by this theme and your custom contents
(e.g. an imprint). When the menus get rendered, this theme tries to translate
each menu entry by its identifier (`menu.` + identifier). If no translation is
available, the name of the menu entry will be used.

**Note:** A maximum of four menu items can be displayed in the `secondary` menu.

The following sample demonstrates how to create menu entries with standard Hugo
configuration.

```yaml
defaultContentLanguage: de
languages:
    en:
        menus:
            main:
                - identifier: sessions
                  pageRef: /sessions
                  weight: 10
                - identifier: code_of_conduct
                  pageRef: /code-of-conduct
                  weight: 20
            footer:
                - identifier: imprint
                  pageRef: /imprint
                  weight: 10
            secondary:
                - identifier: about
                  pageRef: /about
                  weight: 10
                  params:
                      description: |
                          Provide menu item description here.
    de:
        menus:
            main:
                - identifier: sessions
                  pageRef: /sessions
                  weight: 10
                - identifier: code_of_conduct
                  pageRef: /code-of-conduct
                  weight: 20
            footer:
                - identifier: imprint
                  pageRef: /imprint
                  weight: 10
            secondary:
                - identifier: about
                  pageRef: /about
                  weight: 10
                  params:
                      description: |
                          Geben Sie hier die Menüpunktbeschreibung ein.
```
