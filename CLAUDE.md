# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Create React App (react-scripts 5), yarn:

- `yarn start` — dev server on http://localhost:3000 (serves from `/`)
- `yarn build` — production build to `build/`
- `yarn deploy` — builds (via `predeploy`) and publishes `build/` to the `gh-pages` branch

There is no test setup. `@testing-library/*` and the default CRA test were removed deliberately (see **Dependencies**); do not add tests unless asked.

## Deployment and the custom domain

The site is served from **https://rebeccalennartsson.se**, a GitHub Pages site fed by the `gh-pages` branch. `homepage` in `package.json` is the apex domain, so the build assumes it is hosted at `/` — asset paths come out as `/static/...`.

Two files in `public/` exist only for GitHub Pages and must not be deleted:

- **`CNAME`** (contains `rebeccalennartsson.se`) — `gh-pages -d build` replaces the whole branch on every deploy, so without this file in the build output the custom domain gets detached and the site reverts to the `github.io` URL.
- **`.nojekyll`** — stops GitHub Pages running the published output through Jekyll.

Because the domain is the apex, `robots.txt` and `sitemap.xml` land at the domain root, which is the only place crawlers read `robots.txt` from. Changing `homepage` back to a project-site URL (`…github.io/rebeccalennartsson`) would silently break that, plus the `/` logo link in `Menu.js` and every absolute URL in `index.html`.

The DNS side is configured at the registrar, not in this repo. It needs A records for the apex pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and the matching `2606:50c0:800{0,1,2,3}::153` AAAA records), a `www` CNAME to `rebeccalennartsson.github.io`, and **no URL-forwarding/redirect rule** — a registrar redirect is what makes the domain bounce to the `github.io` address instead of serving the site. Repo Settings → Pages must have the custom domain set and "Enforce HTTPS" enabled.

## Architecture

A single-page, single-route marketing site for a Swedish singer, whose purpose is to be
found in local and AI search — read **SEO** below before changing markup, copy, or the
hosting setup. All user-facing copy is Swedish. There is no router, no backend, and no
data fetching.

**Content is data, not markup.** `src/Server/Config.js` exports one `Config` object that drives everything rendered: the `pages` array becomes both the page sections and the nav links, and `settings` controls the YouTube embeds, MP3 players, and contact form. Content and feature-flag changes belong in that file, not in components. Despite the `Server/` folder name, it is a static import — nothing is fetched.

`Config` reaches components through `src/Server/ConfigContext.js`. `App.js` (the only class component) puts it in state and provides it; every consumer reads it with `useContext(ConfigContext)`.

**The `disabled` flag is the feature-flag mechanism.** Every entry in `pages`, `settings.youtube`, `settings.mp3`, and `settings.contact` has `disabled`; consumers `.filter(x => !x.disabled)` (or early-return `null`) rather than deleting entries. Keep disabled content in place instead of removing it — that is how sections are turned off between bookings/seasons.

Component tree: `App` → `ConfigContext.Provider` → `Header` (just `Menu`) and `Main` (YouTube iframes → audio players → `Pages` sections → `Form`).

`Main.js` resolves local MP3s with `require(\`../audio/${src}\`)` when `local: true`, so audio files must live in `src/audio/` and be bundled by webpack — a runtime string alone will not work.

**Section anchors are derived from titles.** `Pages` sets `id={title.replaceAll(' ', '-')}` and `Menu`'s `Link` builds `href="#" + title.replaceAll(' ', '-')` unless an explicit `navigate` is passed (the contact link uses `navigate="form"`). Renaming a page title silently changes its anchor; both sides must agree.

The contact form (`ContactForm.js`) does not POST anywhere — its `onSubmit` calls `preventDefault()` and then assembles a `mailto:` URL from the field values, setting `window.location.href`. The recipient comes from `Config.settings.contact.email`. Keep the `preventDefault()`: without it the form also runs its default GET submit and reloads the page.

## SEO — read this before changing anything

**Being found is the entire point of this site.** It is not a portfolio piece or a brand
exercise; it is a lead source for a working singer. Nobody navigates here from memory —
people find Rebecca by searching *"sångerska Göteborg"*, *"sångerska bröllop Göteborg"*,
*"sång begravning Göteborg"*, or increasingly by asking an AI assistant to recommend a
singer in Gothenburg. If the site ranks and gets cited, it works. If it looks beautiful
and ranks nowhere, it has failed at its only job.

So treat the following as functional requirements, not polish. If you rebuild this site
on another stack, **carry all of it across** — most of it is invisible in the browser and
therefore very easy to drop by accident.

**Non-negotiables:**

1. **`lang="sv"`** on `<html>`. The content is Swedish; claiming English was the single
   worst SEO bug this site has had.
2. **Real HTML for non-JS crawlers.** The app is client-rendered, so a crawler that does
   not execute JavaScript sees only `<div id="root"></div>` — and most AI crawlers don't
   execute JavaScript. `public/index.html` therefore statically carries the title,
   description, canonical, geo meta, OG/Twitter tags, the JSON-LD `@graph`, and a
   `<noscript>` block mirroring the visible copy. **On a rebuild, either keep static tags
   or switch to a prerendered/SSG stack.** A client-only rewrite that drops these is a
   silent, total regression in AI discoverability.
3. **The local keyword must appear in real, visible content** — not just meta tags. The
   hero tagline (`Config.settings.hero`) renders "Sångerska i Göteborg" above the fold,
   the `OM` section names the city and the surrounding towns, and each service section
   mentions Göteborg. Keep the geography in the copy.
4. **JSON-LD `@graph`**: `WebSite` + `Person` + `ProfessionalService`, with `areaServed`
   listing the cities and regions and `makesOffer` listing bröllop / begravning / dop /
   event. This is what makes her a recognisable *entity* rather than a page of text, and
   it is the main thing assistants quote back. Validate after editing — a JSON syntax
   error silently voids all of it.
5. **One `<h1>`** (the `Menu` logo, her name) and `<h2>` per section. Every section used
   to be an `<h1>`, which flattens the hierarchy.
6. **Absolute URLs everywhere** (canonical, `og:url`, `og:image`, every JSON-LD `@id`
   and `url`) pointing at `https://rebeccalennartsson.se/`. These cannot be relative.
7. **`robots.txt` + `sitemap.xml` at the domain root**, which only works because of the
   custom domain (see **Deployment**). `robots.txt` explicitly allows the search and
   AI/answer-engine crawlers.
8. **Mobile performance is a ranking factor and most visitors are on phones.** The hero
   photo is the LCP element; it is a CSS background, so it is preloaded from
   `public/images/` via `<link rel="preload">` with `media` attributes, and the URLs are
   declared as `--hero-*` custom properties in `index.html` so they stay unhashed and
   match the preload hints. Don't move these back into the webpack pipeline without
   replacing the preload.
9. **`og-image.jpg` is 1200×630.** Link previews are how the site spreads through wedding
   planning — a square image gets cropped or downgraded to a small card.

**The one maintenance trap:** `public/index.html` and `src/Server/Config.js` both contain
the same copy. When you change a page's text in `Config.js`, update the `<noscript>` block
and the JSON-LD `description` fields to match. Nothing enforces this, and drift means
crawlers and humans see different claims.

**Known off-site gaps** (need Rebecca's input, not code):

- **A Google Business Profile is probably the highest-value remaining action** for
  "sångerska Göteborg" — it is what puts her in the local/Maps results that sit above
  organic ones. Nothing in this repo can substitute for it.
- **`sameAs` links** to her Instagram / Facebook / YouTube are missing from the `Person`
  node. These are the strongest signal for tying the site to a real, verifiable person.
  Add them as soon as the URLs are known.
- **No `telephone`, `priceRange`, reviews, or FAQ content.** All would strengthen the
  structured data; none may be invented. Get real values before adding them.

## Styling and responsive behavior

Sass with shared design tokens in `src/Variables.scss` (imported by `App.scss` and `Menu.scss`) — palette, fluid `clamp()` type scale, radii, `$accent` (gold), `$tapTarget`, `$navHeight`, and `$mediaQueryBrake: 821px`.

**The CSS is mobile-first**: base rules target phones and `@media (min-width: $mediaQueryBrake)` layers on the desktop treatment. Don't add `max-width` queries — it inverts the cascade the rest of the file assumes.

The 821px breakpoint exists in two places: as `$mediaQueryBrake` in Sass, and as the `MEDIA_QUERY_BRAKE` constant in `Menu.js`, which switches between the desktop nav and the mobile hamburger/drop-down via a `resize` listener. Keep the two in sync. They agree at the boundary: CSS applies desktop from `min-width: 821px` and JS treats `>= 821` as desktop.

The nav logo (`.menu h1`) must keep `flex: 1 1 auto` and `min-width: 0`. Without them it cannot shrink, and on a ~390px phone it pushes the hamburger button off the right edge — leaving no way to navigate. It wraps to two lines on narrow screens by design.

`Menu.js` locks `document.body.style.overflow` while the mobile overlay is open. That effect must stay keyed on `isPhone` as well as `isOpen`: widening past the breakpoint with the overlay open unmounts it, and if the lock is not released the page cannot be scrolled at all.

Fonts are self-hosted in `src/fonts/` with `@font-face` rules in `src/fonts.scss` — three woff2 files (weights 100/300/400), which are the only weights the stylesheets use. `font-weight: 200` is not available; declaring it silently renders as 100.

The hero tagline (`.hero-intro`) sits over the photo, and the landscape image is light exactly where the text lands. The gradient scrim behind it is load-bearing for legibility, not decoration — removing it makes the tagline unreadable on desktop.

## Dependencies

Kept deliberately small — `react`, `react-dom`, `react-scripts`, plus `sass` and `gh-pages` as devDependencies. Previously removed, with the reasoning, so they don't get reintroduced by habit:

- **`react-helmet-async`** — redundant once `index.html` carries the real tags (see **SEO**).
- **`web-vitals`** — `reportWebVitals()` was called with no callback, so it was a no-op that still emitted a lazy chunk.
- **`typeface-roboto`** — deprecated, and it bundled all 24 of its files (~480 kB) to use three weights. Replaced by `src/fonts/`.
- **`@testing-library/{jest-dom,react,user-event}`** — only consumed by the default CRA test, which asserted a "learn react" link that never existed here.

The deployed payload is dominated by `src/audio/tillsammans_igen.mp3` at **7.3 MB** — the rest of the build is ~1.2 MB. It is `preload="metadata"`, so it is not fetched until play, but re-encoding it lower would shrink the deploy substantially.
