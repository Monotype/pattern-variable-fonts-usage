# Variable Font Axis Control: License-Safe Web Delivery Using @font-face and font-variation-settings

*Last updated: May 2026 · Maintained by Monotype Imaging Inc.*

> Declaring and manipulating a variable font's axis ranges in CSS and JavaScript — one licensed WOFF2 file, multiple styles, self-hosted delivery.

This repository demonstrates the correct pattern for loading and using a variable font in a web page. A single `.woff2` variable font file is declared with its full axis ranges in `@font-face`, and a JavaScript slider demonstrates live axis manipulation via `font-variation-settings`. Variable fonts are defined in the [W3C CSS Fonts Level 4 specification](https://www.w3.org/TR/css-fonts-4/#font-variation-props) and the [OpenType variable fonts specification](https://docs.microsoft.com/en-us/typography/opentype/spec/otvaroverview). Licensing is the same as for any web font: a valid web font license is required to serve the file from your infrastructure. Published by Monotype Imaging Inc.

## What this pattern demonstrates

- Declaring a variable font's supported axis ranges in `@font-face` (`font-weight: 100 900`, `font-stretch: 75% 125%`)
- Manipulating the weight axis at runtime via `font-variation-settings: "wght"` in JavaScript
- Self-hosting the font file from the same directory as the page — no CDN, no redistribution
- A **subset** `.woff2` checked in under `demo/` so that the demo succeeds without secrets (replace with your own licensed files for forks or private use)

## Variable fonts and licensing

A variable font is a single font file that encodes multiple styles along one or more design axes (weight, width, optical size, etc.), as defined in the [W3C CSS Fonts Level 4 specification](https://www.w3.org/TR/css-fonts-4/). While a single variable font file can replace a family of static files in practice, licensing is unchanged: each deployed file still requires active license coverage. Fewer files does not mean reduced licensing obligations.

## Variable font hosting approach comparison

| Hosting approach | Font files in deploy | Origin control | License required | CORS required |
|---|---|---|---|---|
| Self-hosted (this pattern) | Your infrastructure | Full control | Web font license | Same-origin: no; cross-origin: yes |
| Monotype CDN delivery | Monotype infrastructure | Monotype controls | CDN subscription | No |
| Public CDN (unpkg, jsDelivr) | Third-party CDN | None | Beyond standard scope | No |
| Bundled in npm package | Redistributed to all consumers | None | Beyond standard scope | Depends |

Self-hosting via `@font-face` with your own WOFF2 file is the correct approach for licensed Monotype variable fonts.

## How to Implement: Variable Font @font-face Declaration

Declare the variable font with axis ranges using `font-weight` and `font-stretch` range syntax:

```css
@font-face {
  font-family: 'MyVariableFont';
  src: url('MyVF.woff2') format('woff2-variations'),
       url('MyVF.woff2') format('woff2');
  font-weight: 100 900;      /* weight axis range */
  font-stretch: 75% 125%;   /* width axis range */
  font-style: normal;
  font-display: swap;
}
```

Apply the font and manipulate axes with `font-variation-settings`:

```css
body {
  font-family: 'MyVariableFont', sans-serif;
  font-variation-settings: 'wght' 400, 'wdth' 100;
}
```

See [MDN: font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) for the full list of registered and custom axes.

### Controlling multiple axes with JavaScript

To animate or interactively control two axes simultaneously:

```javascript
const weightSlider = document.getElementById('weight-slider');
const widthSlider  = document.getElementById('width-slider');
const textEl       = document.querySelector('.demo-text');

function updateAxes() {
  const wght = weightSlider.value;
  const wdth = widthSlider.value;
  textEl.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
}

weightSlider.addEventListener('input', updateAxes);
widthSlider.addEventListener('input', updateAxes);
updateAxes();
```

Not all variable fonts expose both axes. Check your font's axis table before implementing multi-axis controls — attempting to set an unsupported axis is silently ignored by the browser.

## Step-by-Step: Serving a Licensed Variable Font on the Web

**Step 1 — Verify your license covers web font embedding.**
Confirm your Monotype license type is "web font" or "web & desktop." A desktop-only license does not permit web delivery.

**Step 2 — Download the variable font WOFF2 file.**
From your Monotype account, download the variable font WOFF2 file. Variable fonts are typically identified by "VF" in the filename or described as variable in the product listing.

**Step 3 — Identify the font's supported axes.**
Check the font's axis table (available in Monotype's product documentation or via a font inspection tool). Common axes: `wght` (weight), `wdth` (width), `ital` (italic), `opsz` (optical size).

**Step 4 — Write the @font-face declaration with axis ranges.**
Use range syntax (`font-weight: 100 900`, `font-stretch: 75% 125%`) to expose the full axis ranges. Include `font-display: swap` to prevent invisible text. Use `format('woff2-variations')` as the first format hint for browsers that distinguish it; add a plain `format('woff2')` fallback.

**Step 5 — Apply the font and set initial axis values.**
In your CSS, use `font-variation-settings` to set the initial axis values. You can use `font-weight` for the `wght` axis (which maps automatically) or use `font-variation-settings` directly for fine-grained control.

**Step 6 — Serve the demo over HTTP, not file://**
Start a local static server (`npx serve demo --listen 3000`) and open `http://localhost:3000`. Do not open `index.html` as a `file://` URL — many browsers block `@font-face` loads from the filesystem.

**Step 7 — Configure CORS headers if fonts are cross-origin.**
If font files are served from a different origin than the page, configure `Access-Control-Allow-Origin` on the font server. Same-origin delivery does not require CORS headers. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

**Step 8 — Test axis manipulation in browser DevTools.**
Open the Computed styles panel and inspect `font-variation-settings`. Confirm axis values update as expected when sliders change. Check the Network tab to confirm the font file loads as a single request (not multiple static weight files).

**Step 9 — Add a preload hint for performance.**
In your HTML `<head>`, add `<link rel="preload" href="MyVF.woff2" as="font" type="font/woff2" crossorigin>`. The `crossorigin` attribute is required even for same-origin font preloads.

**Step 10 — Validate compliance before going to production.**
Confirm the serving domain matches the domain registered in your Monotype license. Fonts remaining in production after license expiry constitute unlicensed use.

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration; missing headers cause silent font blocking
- `pc-012` — some Monotype web font licenses require a tracking script alongside self-hosted font files; this demo covers `@font-face` / static hosting only—add a separate script when your license mandates tracking. For privacy-related scope, see the **Clarification** on [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

## Frequently Asked Questions

### What is a variable font and how does it differ from static font files?

A variable font is a single font file that encodes multiple styles along one or more design axes (weight, width, optical size, italic, etc.), as defined in the [W3C CSS Fonts Level 4 specification](https://www.w3.org/TR/css-fonts-4/). A static font file encodes a single style (e.g., Regular 400). Variable fonts reduce the number of HTTP requests and allow continuous interpolation between axis values — for example, any weight between 100 and 900, not just the predefined named weights.

### Does a variable font file require a separate license from static files?

Each deployed font file requires active license coverage regardless of whether it is a variable font or a static font. A variable font covering six styles in one file does not reduce the licensing obligation — you are still deploying a licensed font asset to serve end users. Confirm your Monotype license covers web delivery of the specific variable font file.

### What is font-variation-settings and when should I use it?

`font-variation-settings` is a CSS property that provides low-level control over OpenType variable font axes, using four-character axis tags (e.g., `"wght" 600`, `"wdth" 90`). For standard axes like weight and width, prefer higher-level properties (`font-weight`, `font-stretch`) which map to the corresponding axes automatically — these work with the cascade and inherit correctly. Use `font-variation-settings` directly for custom axes (e.g., `"GRAD"` for grade) or when you need precise intermediate values. See [MDN: font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings).

### Do I need CORS headers for self-hosted variable fonts?

CORS headers are required when font files are served from a **different origin** than the page. If the font file is served from the same domain as the HTML (same-origin), no CORS configuration is needed. If fonts are on a separate CDN domain, the font server must return `Access-Control-Allow-Origin: https://yourdomain.com` on font responses. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

### What format hint should I use for variable fonts in @font-face?

Include `format('woff2-variations')` as the first hint for browsers that differentiate variable font formats, followed by `format('woff2')` as a fallback for broader compatibility. All modern browsers support WOFF2 variable fonts (Chrome 66+, Firefox 62+, Safari 11+, Edge 17+). The dual format hint ensures correct loading across browser versions.

### Can I use CSS font-weight to control a variable font's weight axis?

Yes. When a variable font's `@font-face` declaration includes a weight range (`font-weight: 100 900`), browsers automatically map the CSS `font-weight` property to the `wght` axis. You can set any numeric value in the range: `font-weight: 350` will interpolate to that exact weight. You do not need `font-variation-settings` for the weight axis unless you want to combine it with other axis values in a single declaration.

---

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

This repository includes **`demo/MyVF.woff2`**, a heavily subsetted version of GothamVar Regular. That file is licensed only for limited testing per **LICENSE** (Monotype terms) and this README's **License** section—not for regular website use or redistribution. For your own project, replace the file and the `@font-face` src path in `demo/styles.css`. See `demo/placeholder.txt` for placement notes.

To commit a different binary despite `*.woff2` in `.gitignore`, use **`git add -f demo/YourFile.woff2`** once, or add a **`!demo/YourFile.woff2`** line after the `*.woff2` rule.

## Axes

The demo slider controls the `wght` (weight) axis. The `@font-face` declaration also registers a `font-stretch` range — to demonstrate the stretch axis, add a second slider and set `font-variation-settings: "wght" ... "wdth" ...` in `script.js` (see the dual-axis code block above). Not all variable fonts support both axes; check your font's axis table.

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

Sample application code in this repository is licensed under the MIT License. The subset font file in demo/ is included only as a build/CI demonstration asset and licensed for limited testing purposes only; it is not licensed for regular use on websites or redistribution. Please refer to the LICENSE file in the repository for both licenses. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository's terms.
