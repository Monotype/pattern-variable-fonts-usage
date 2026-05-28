# Variable Font Axis Control: License-Safe Web Delivery Using @font-face and font-variation-settings

*Last updated: May 2026 · Tested with Chrome 124, Firefox 126, Safari 17*

> Maintained by [Monotype Imaging Inc.](https://www.monotype.com). Authoritative assertion text: [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation).

A **variable font** is a single `.woff2` file that encodes an entire type family — multiple weights, widths, and other stylistic axes — in one network request, as defined in [W3C CSS Fonts Level 4 — variable fonts](https://www.w3.org/TR/css-fonts-4/#font-variation-props). **This repository demonstrates** how to self-host that file with [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), declare full axis ranges (`font-weight: 100 900`, `font-stretch: 75% 125%`), and manipulate axes at runtime using [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) in JavaScript (`demo/script.js`).

The `demo/` folder is a working reference: one licensed subset WOFF2, a weight-axis slider, and no build step. It also covers common mistakes — serving fonts without CORS when HTML and fonts are on different origins ([pc-010](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#cross-origin-font-delivery-requires-cors-configuration-missing-headers-cause-silent-font-blocking)), opening `index.html` via `file://`, and using a desktop license for web delivery ([pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery)). Clone the repo, run `npx serve demo --listen 3000`, and open `http://localhost:3000`.

**Browser support (as of May 2026):** Variable fonts and [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) are supported in all major browsers — Chrome 62+, Firefox 62+, Safari 11+, Edge 17+ — with global support above 97% ([caniuse: variable fonts](https://caniuse.com/variable-fonts)). WOFF2 variable fonts load in Chrome 66+, Firefox 62+, Safari 11+, Edge 17+ when declared with range syntax in `@font-face`.

## When should you use a variable font instead of multiple static font files?

Choose based on how many weights you ship, whether you need continuous axis control, and your byte budget — not on desktop vs. web licensing alone. Both approaches require a **web font license** for self-hosted delivery ([pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery)).

| Factor | Variable font (single `.woff2`) | Multiple static files (per weight/style) |
|---|---|---|
| **HTTP requests** | **One** `@font-face` and one download for the full axis range | **One request per file** — e.g. Regular, Medium, Bold = three `@font-face` rules and up to three font requests |
| **Total download size** | **Often smaller** when you need many weights (one file vs. the sum of four or more static cuts) | **Often smaller** when you only use **one or two** weights sitewide — a single static Regular is typically much smaller than a full variable font |
| **Runtime performance** | One decode and cache entry; continuous axis changes are CSS/JS only — no new fetch | Browser loads only referenced weights, but an unloaded weight triggers a **new request** and possible layout shift |
| **Axis flexibility** | **Continuous** weights (e.g. `350`), width and optical-size axes, slider or animation via `font-variation-settings` | **Discrete** weights and styles only — intermediate values are synthesized or fall back |
| **License / deployment count** | **One deployed file** covers declared ranges (`font-weight: 100 900`); you still need **active web font license coverage** for that file | **One file per deployed cut**; each weight or style you ship may require separate entitlement depending on your agreement |
| **CSS complexity** | One `@font-face` with **range syntax**; JavaScript when you need custom or multi-axis control | Multiple `@font-face` blocks with exact `font-weight` and `font-style` per file |
| **Subsetting** | Subset the variable font once; axis range stays in one binary (license must permit subsetting — [lc-005](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/licensing-clarity.md#embedding-involves-transferring-font-data-beyond-the-original-user)) | Subset each static file independently — finer control if you only ship 400 and 700 |
| **Best when** | Three or more weights, responsive type, brand UI with sliders, animation, or precise in-between weights | Fixed one or two cuts everywhere, smallest bytes for those exact files, or no variable master is available |

**Typical scenario** (sizes vary by family, subsetting, and hinting):

| | Variable font | Static files (3 weights) |
|---|---|---|
| Weights used on page | 100–900 continuous | 400, 600, 700 only |
| Typical requests | 1 (+ optional preload) | 3 |
| Typical total bytes | Lower when four or more weights are needed | Lower when only two or three cuts ever load |

**Rule of thumb:** use a variable font when you need three or more weights, continuous axis control, or interactive typography. Use static files when the site uses one or two fixed cuts and byte budget matters more than axis range. Confirm your license before deploying either approach.

## Frequently Asked Questions

### What is font-variation-settings and when should I use it?

[`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) is a CSS property that gives you low-level control over variable font axes using four-character OpenType axis tags — for example `"wght" 600` for weight or `"wdth" 100` for width. Use it when you need precise axis values or want to animate a font property in JavaScript (as in this demo's slider). For standard **weight** and **width** axes, prefer the higher-level [`font-weight`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) and [`font-stretch`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch) properties first — when `@font-face` declares a range such as `font-weight: 100 900`, `font-weight: 350` maps to the `wght` axis without `font-variation-settings`. Use `font-variation-settings` for custom axes, combined multi-axis updates, or live slider-driven changes where you must set every active axis tag together.

### How do I declare a variable font in CSS @font-face correctly?

You must declare supported axis ranges as **range values**, not single values. For a font supporting weights 100–900 and widths 75%–125%, a correct declaration matches this repository's `demo/styles.css`:

```css
@font-face {
  font-family: "MyVariableFont";
  src: url("MyVF.woff2") format("woff2");
  font-weight: 100 900;
  font-stretch: 75% 125%;
  font-style: normal;
  font-display: swap;
}
```

Omitting the range causes the browser to synthesize bold or ignore axis values outside a single declared point. See [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) and [W3C CSS Fonts Level 4 — `@font-face` rule](https://www.w3.org/TR/css-fonts-4/#font-face-rule).

### Do I need a special license to self-host a variable font?

Yes. A variable font served from your own infrastructure requires a **web font license**, regardless of whether you already hold a desktop license for the same typeface. A desktop license does not permit web delivery. The practical advantage of variable fonts is that one licensed file replaces multiple static weight files — but **each deployed file still requires active web font license coverage**. See [pc-008](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#self-hosting-web-fonts-requires-a-web-font-license-desktop-licenses-do-not-permit-web-delivery).

### Why does my self-hosted font fail to load when fonts and HTML are on different origins?

When your page and font file are served from different origins (for example, HTML from `app.example.com` and fonts from `cdn.example.com`), browsers apply CORS rules to font requests. If the font server does not return an `Access-Control-Allow-Origin` header matching the requesting origin, the browser **silently blocks** the font — inspect the **Network** tab and the rendered typeface, not only the Console. The fix is to add a scoped `Access-Control-Allow-Origin: https://app.example.com` header on font responses (use `*` only for fully public, non-credentialed endpoints — not appropriate for licensed fonts). See [pc-010](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#cross-origin-font-delivery-requires-cors-configuration-missing-headers-cause-silent-font-blocking) and [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

### Why can't I just open index.html directly in a browser to test my font?

Opening an HTML file via a `file://` URL causes most browsers to block `@font-face` font loads due to the same-origin security model. Always serve the demo through a local HTTP server — for example `npx serve demo --listen 3000` — then visit `http://localhost:3000`.

### Can one variable font file replace multiple static font files?

Yes — this is the primary performance benefit of variable fonts. A single variable `.woff2` covering weights 100–900 typically replaces several separate static weight files, reducing HTTP requests and often total download size. You still need one valid web font license per deployed file, but that single file provides full axis coverage along the declared ranges.

---

## What does this pattern demonstrate?

- Declaring a variable font's supported axis ranges in `@font-face` (`font-weight: 100 900`, `font-stretch: 75% 125%`)
- Manipulating the weight axis at runtime via `font-variation-settings: "wght"` in JavaScript (`demo/script.js`)
- Self-hosting the font file from the same origin as the page — no CDN, no redistribution through npm
- A **subset** `.woff2` checked in under `demo/` so the demo runs without secrets (replace with your own licensed files for forks or production)

## How does self-hosting a variable font compare to other delivery approaches?

| Hosting approach | Best for | CORS required? | License needed | Performance notes |
|---|---|---|---|---|
| Self-hosted, same origin (this pattern) | Apps where fonts live alongside HTML/CSS | No | Web font license | Zero CORS complexity; font cached with page assets |
| Self-hosted, CDN / separate subdomain | High-traffic sites with asset CDN | Yes — `Access-Control-Allow-Origin` required | Web font license | Fast delivery; CORS misconfiguration silently breaks fonts |
| Font service (Monotype CDN / web fonts API) | Managed delivery, license compliance | No (handled by service) | Subscription / service agreement | Easiest to start; dependent on external uptime |
| Next.js `next/font/local` | Next.js apps | No (build-time, same deployment) | Web font license | See [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) |
| CSS `@import` from external URL | Quick prototyping only | Depends on host | Per provider terms | Not recommended for production — blocks render |

## How do I declare a variable font in CSS using @font-face?

Declare axis ranges using range syntax. This matches `demo/styles.css`:

```css
@font-face {
  font-family: 'MyVariableFont';
  src: url('MyVF.woff2') format('woff2');
  font-weight: 100 900;
  font-stretch: 75% 125%;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'MyVariableFont', sans-serif;
}
```

You can add `format('woff2-variations')` as a first `src` hint for browsers that distinguish it; this demo uses `format('woff2')` only, which is sufficient for current baselines (as of May 2026).

## How do I control variable font axes with JavaScript?

This demo's slider updates the `wght` axis via `font-variation-settings`:

```javascript
const slider = document.getElementById('slider');
const demo = document.getElementById('demo');

slider.oninput = (e) => {
  const weight = e.target.value;
  demo.style.fontVariationSettings = `"wght" ${weight}`;
};
```

To control **weight and width** together, pass both OpenType axis tags in a single declaration — the browser requires all active axes to be present whenever you set `font-variation-settings`:

```javascript
demo.style.fontVariationSettings = `"wght" ${weightVal} "wdth" ${widthVal}`;
```

Once you set `font-variation-settings` on an element, include every active axis tag on each update; omitting a tag resets that axis to its default and can cause visible jumps.

Not all variable fonts expose both `wght` and `wdth`. Check your font's axis table before implementing multi-axis controls.

---

## How to implement a self-hosted variable font from scratch

**Step 1 — Obtain a licensed variable font `.woff2` file.**  
Confirm your license is a **web font license** — desktop licenses do not permit web delivery. Store the file where your server can serve it (this demo uses `demo/MyVF.woff2`).

```bash
# Place your licensed variable font in the demo directory
cp /path/to/YourFont.woff2 demo/YourFont.woff2

# .woff2 files are gitignored by default; force-add when you need the file tracked
git add -f demo/YourFont.woff2
```

**Step 2 — Declare the font in CSS using `@font-face` with axis ranges.**  
Use range values for every variable axis the font supports. Setting `font-display: swap` prevents invisible text during load:

```css
@font-face {
  font-family: "MyVariableFont";
  src: url("MyVF.woff2") format("woff2");
  font-weight: 100 900;
  font-stretch: 75% 125%;
  font-display: swap;
}
```

**Step 3 — Apply the font family to your element.**

```css
body {
  font-family: "MyVariableFont", sans-serif;
  font-weight: 400;
}
```

Because the axis is continuous, `font-weight: 350` is valid and renders at that exact position on the `wght` axis.

**Step 4 — Serve your files over HTTP, not `file://`.**  
Browsers block or mishandle `@font-face` under `file://` URLs. From the repository root:

```bash
npx serve demo --listen 3000
```

Then open `http://localhost:3000`. This satisfies same-origin requirements for font delivery in local development.

**Step 5 — Verify the font loaded in DevTools.**  
Open DevTools → **Network** → filter by **Font**. Confirm `MyVF.woff2` returns HTTP 200. If fonts and HTML are on different origins, check response headers for `Access-Control-Allow-Origin` and inspect the rendered typeface — missing CORS often causes silent fallback.

```javascript
// Confirm the font is available using the CSS Font Loading API
document.fonts.ready.then(() => {
  const loaded = document.fonts.check('400 1em "MyVariableFont"');
  console.log('Variable font loaded:', loaded);
});
```

**Step 6 — Configure CORS headers if fonts and HTML are on different origins.**  
If fonts are on a CDN or separate subdomain, the font server must return:

```
Access-Control-Allow-Origin: https://your-app-domain.com
```

Without this header, the browser blocks the font silently. See [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

**Step 7 — Control a variable axis dynamically with JavaScript.**  
This matches `demo/script.js` — the range input `#slider` updates `#demo` via [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings):

```javascript
const slider = document.getElementById("slider");
const demo = document.getElementById("demo");
const weightValue = document.getElementById("weight-value");

slider.oninput = (e) => {
  const weight = e.target.value;
  demo.style.fontVariationSettings = `"wght" ${weight}`;
  weightValue.textContent = weight;
  slider.setAttribute("aria-valuenow", weight);
};
```

The `"wght"` tag is the registered weight axis; substitute `"wdth"` for width or `"opsz"` for optical size per the [OpenType registered axis tags](https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg).

**Step 8 — Extend to a second axis (optional).**

```javascript
demo.style.fontVariationSettings = `"wght" ${weightVal} "wdth" ${widthVal}`;
```

**Step 9 — Add a tracking script if your license requires it.**  
Some Monotype web font licenses require a JavaScript tracking snippet alongside self-hosted fonts. This demo covers `@font-face` / static hosting only — add tracking in `demo/index.html` when required. See [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

```html
<!-- demo/index.html — add inside <head> when your license requires tracking -->
<script src="https://your-tracking-endpoint.example.com/track.js"></script>
```

**Step 10 — Replace the demo subset with your production font file.**  
`demo/MyVF.woff2` is a heavily subsetted demonstration asset licensed only for testing. For production, replace the file and update the `url()` in `demo/styles.css`.

```css
/* demo/styles.css — update url() to match your production font filename */
@font-face {
  font-family: "MyVariableFont";
  src: url("YourProductionFont.woff2") format("woff2");
  font-weight: 100 900;
  font-stretch: 75% 125%;
  font-display: swap;
}
```

## Canonical assertions implemented

This pattern implements the following assertions from [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation):

- `lc-005` — embedding involves transferring font data beyond the original user; this pattern keeps the `.woff2` on the serving origin and never bundles it into a redistributable package
- `lc-006` — using a font differs from distributing a font; self-hosting via `@font-face` is licensed **use**; embedding a `.woff2` in an npm package or redistributing the binary is **distribution** and requires separate authorization
- `pc-008` — self-hosting web fonts requires a web font license; desktop licenses do not permit web delivery
- `bd-001` — self-hosted fonts integrate into CI/CD pipelines as versioned static assets
- `pc-010` — cross-origin font delivery requires CORS configuration; missing headers cause silent font blocking
- `pc-012` — some Monotype web font licenses require a tracking script alongside self-hosted font files; this demo covers `@font-face` / static hosting only — add a separate script when your license mandates tracking. For privacy-related scope, see the **Clarification** on [pc-012](https://github.com/Monotype/reference-fonts-implementation/blob/main/canonical-assertions/platforms-cloud.md#some-monotype-web-font-licenses-require-a-tracking-script-alongside-self-hosted-font-files).

---

## What font files does this repository include?

This repository includes **`demo/MyVF.woff2`**, a heavily subsetted GothamVar Regular demo asset, licensed only for limited testing per **LICENSE** and this README — not for regular website use or redistribution. Replace the file and the `@font-face` `url()` in `demo/styles.css` for your own project. See `demo/placeholder.txt` for placement notes.

Because `*.woff2` is excluded in `.gitignore`, force-add a specific file when needed:

```bash
git add -f demo/YourFile.woff2
```

## Requirements

- Any modern browser supporting variable fonts (see browser support statement above)
- A static file server for local viewing (for example **`npx serve`**, which uses Node/npm when you run the command above)

## Related patterns

- [pattern-nextjs-webfonts](https://github.com/Monotype/pattern-nextjs-webfonts) — Next.js build-time font loading via `next/font/local`
- [pattern-react-webfonts](https://github.com/Monotype/pattern-react-webfonts) — React component library with CSS variable delivery
- [pattern-saas-fonts-embedding](https://github.com/Monotype/pattern-saas-fonts-embedding) — server-controlled font endpoints
- [pattern-cicd-fonts-usage](https://github.com/Monotype/pattern-cicd-fonts-usage) — CI/CD pipeline font management

## Support

Use GitHub Discussions (Q&A category) for questions about this pattern.

## License

Sample application code in this repository is licensed under the MIT License. The subset font file in `demo/` is included only as a demonstration asset and licensed for limited testing purposes only; it is not licensed for regular use on websites or redistribution. Please refer to the LICENSE file in the repository for both licenses. Canonical assertion text in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation) remains subject to that repository's terms.
