# pattern-variable-fonts-usage

> Variable font axis control via CSS and JavaScript.

This repository demonstrates the correct pattern for loading and using a variable font in a web page. A single `.woff2` variable font file is declared with its full axis ranges in `@font-face`, and a JavaScript slider demonstrates live axis manipulation via `font-variation-settings`.

## What this pattern demonstrates

- Declaring a variable font’s supported axis ranges in `@font-face` (`font-weight: 100 900`, `font-stretch: 75% 125%`)
- Manipulating the weight axis at runtime via `font-variation-settings: "wght"` in JavaScript
- Self-hosting the font file from the same directory as the page — no CDN, no redistribution
- A **subset** `.woff2` checked in under `demo/` so that the demo succeeds without secrets (replace with your own licensed files for forks or private use)

## Variable fonts and licensing

A variable font is a single font file that encodes multiple styles along one or more design axes (weight, width, optical size, etc.). Licensing is the same as for any web font: a web font license is required to serve the file from your infrastructure. The practical difference is that a single variable font file can replace a family of static files — but each deployed file still requires active license coverage.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration; missing headers cause silent font blocking

## Usage

1. Obtain a variable font `.woff2` file under a valid Monotype web font license (this repo ships a **small subset**; use your own files in forks or production)
2. Place `.woff2` files in `demo/` and update the `src` path in `demo/styles.css` (`@font-face`) to match. Additional font names remain **gitignored** unless you force-add (`git add -f`) or add a `!` exception in `.gitignore`
3. Serve the `demo/` folder over **http://** (do **not** rely on opening `index.html` as a **`file://`** URL — many browsers block or mishandle `@font-face` loads that way):

```bash
npx serve demo --listen 3000
```

Then open **`http://localhost:3000`** in a browser.

4. Use the slider to adjust the weight axis live

When the page, stylesheet, and font are all served from the **same origin** (as in this command), you typically avoid cross-origin font issues. **`pc-010`** applies if you split assets across origins (for example fonts on a CDN): the font responses must include correct **`Access-Control-Allow-Origin`** (and related) headers.

## Font files

This repository includes **`demo/MyVF.woff2`**, a heavily subsetted version of GothamVar Regular. It demonstrates self-hosting only; **redistribution rights for that file are not granted to you**—use fonts you are licensed to deploy. For your own project, replace the file and the `@font-face` src path in `demo/styles.css`. See `demo/placeholder.txt` for placement notes.

To commit a different binary despite `*.woff2` in `.gitignore`, use **`git add -f demo/YourFile.woff2`** once, or add a **`!demo/YourFile.woff2`** line after the `*.woff2` rule.

## Axes

The demo slider controls the `wght` (weight) axis. The `@font-face` declaration also registers a `font-stretch` range — to demonstrate the stretch axis, add a second slider and set `font-variation-settings: "wght" ... "wdth" ...` in `script.js`. Not all variable fonts support both axes; check your font’s axis table.

## Requirements

- Any modern browser (no build step required)
- A static file server for local viewing (for example **`npx serve`**, which uses Node/npm when you run the command above)

## Related patterns

- [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) — Next.js build-time font loading via `next/font/local`
- [pattern-react-webfonts](https://github.com/Monotype/pattern-react-webfonts) — React component library with CSS variable delivery
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD pipeline font management

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Sample application **code** in this repository is licensed under the [MIT License](LICENSE). The **subset font file** in `demo/` is included **only** as a demonstration asset; it is **not** licensed to third parties for separate redistribution—use fonts you have rights to ship. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository’s terms.
