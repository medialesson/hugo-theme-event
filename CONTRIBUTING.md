# Contributing to the Event theme

All contributions to this repository should take the following guidelines into
account.

## Styling

All `<style>` elements must be included inside the `<head>` of the
document.[^styleplacement] In other words, all style files must be loaded in the
main template. They cannot, for example, be placed inside a partial. This is a
pity, since styles are not tree-shakeable because of this. The theme
automatically integrates all `*.css` files from the `assets/` directory.

- Place all style files under `assets/styles/`.
- Follow the [BEM](https://getbem.com) naming convention for selectors.
- For every partial, put a style file with the same folder structure under
`assets/styles/partials/`.
- Never use type selectors and avoid ID selectors.

 
 ## References
 
 [^styleplacement]: According to the [HTML
 specification](https://html.spec.whatwg.org/multipage/semantics.html#the-style-element).