# Contributing to the Event theme

All contributions to this repository should take the following guidelines into
account.

## Styling

All `<style>` elements must be included inside the `<head>` of the
document.[^styleplacement] In other words, all style files must be loaded in the
main template. They cannot, for example, be placed inside a partial. This is a
pity, since styles are not tree-shakeable because of this.

- Place all style files under `static/styles/`.
- Reference all style files in the index file `static/styles/_index.css`.
- For every partial, put a style file with the same folder structure under
`static/styles/partials/`.
- Follow the [BEM](https://getbem.com) naming convention for selectors.

 
 ## References
 
 [^styleplacement]: According to the [HTML
 specification](https://html.spec.whatwg.org/multipage/semantics.html#the-style-element).