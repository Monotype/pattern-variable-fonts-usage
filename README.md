# pattern-variable-fonts-usage

> Variable font axis control via CSS and JavaScript.

This repository demonstrates the correct pattern for loading and using a variable font in a web page. A single `.woff2` variable font file is declared with its full axis ranges in `@font-face`, and a JavaScript slider demonstrates live axis manipulation via `font-variation-settings`.

## What this pattern demonstrates

- Declaring a variable font’s supported axis ranges in `@font-face` (`font-weight: 100 900`, `font-stretch: 75% 125%`)
- Manipulating the weight axis at runtime via `font-variation-settings: "wght"` in JavaScript
- Self-hosting the font file from the same directory as the page — no CDN, no redistribution

## Variable fonts and licensing

A variable font is a single font file that encodes multiple styles along one or more design axes (weight, width, optical size, etc.). Licensing is the same as for any web font: a web font license is required to serve the file from your infrastructure. The practical difference is that a single variable font file can replace a family of static files — but each deployed file still requires active license coverage.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets

## Usage

1. Obtain a variable font `.woff2` file under a valid Monotype web font license
2. Place it in `demo/` — this directory is gitignored for font files; do not commit the font
3. Update the `src` path in `demo/styles.css` to match your filename
4. Open `demo/index.html` in a browser (or serve via any static server)
5. Use the slider to adjust the weight axis live

## Font files

Font files are intentionally excluded from this repository via `.gitignore`. Place your licensed `.woff2` file in `demo/`. See `demo/placeholder.txt` for placement instructions.

## Axes

The demo slider controls the `wght` (weight) axis. The `@font-face` declaration also registers a `font-stretch` range — to demonstrate the stretch axis, add a second slider and set `font-variation-settings: "wght" ... "wdth" ...` in `script.js`. Not all variable fonts support both axes; check your font’s axis table.

## Requirements

- Any modern browser (no build step required)

## Related patterns

- [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) — Next.js build-time font loading via `next/font/local`
- [pattern-react-webfonts](https://github.com/Monotype/pattern-react-webfonts) — React component library with CSS variable delivery
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD pipeline font management

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Code in this repository is provided for educational and interoperability purposes. Font files are not included. Canonical guidance © Monotype Imaging Inc.