# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Create React App (react-scripts 5), yarn:

- `yarn start` — dev server on http://localhost:3000 (serves from `/`)
- `yarn build` — production build to `build/`
- `yarn deploy` — builds (via `predeploy`) and publishes `build/` to the `gh-pages` branch

There is no test setup. `@testing-library/*` and the default CRA test were removed deliberately (see **Dependencies**); do not add tests unless asked.

## Deployment

The site is served from **https://rebeccalennartsson.se**, a GitHub Pages site fed by the `gh-pages` branch via `yarn deploy`. `homepage` in `package.json` is that apex, so assets build from `/`. The old `https://rebeccalennartsson.github.io/rebeccalennartsson/` address 301-redirects to it.

DNS is at Loopia (`ns1/ns2.loopia.se`): four A records on `@` → `185.199.108.153`–`.111.153`, and `www` CNAME → `rebeccalennartsson.github.io` (GitHub 301s `www` to the apex). "Enforce HTTPS" is on in repo Settings → Pages. Do not turn Loopia's URL forwarding back on — "masked" forwarding serves an empty frame page to crawlers, and plain forwarding loops against GitHub's own redirect.

`public/CNAME` (containing `rebeccalennartsson.se`) must stay, because `gh-pages -d build` replaces the whole branch on every deploy and would otherwise detach the domain.

`public/.nojekyll` stops GitHub Pages running the published output through Jekyll. Keep it.

## Architecture

A single-page, single-route marketing site for a Swedish singer, whose purpose is to be
found in local and AI search — read **SEO** below before changing markup, copy, or the
hosting setup. All user-facing copy is Swedish. There is no router, no backend, and no
data fetching.

**Content is data, not markup.** `src/Server/Config.js` exports one `Config` object that drives everything rendered: the `pages` array becomes both the page sections and the nav links, and `settings` controls the YouTube embeds, MP3 players, and contact form. Content and feature-flag changes belong in that file, not in components. Despite the `Server/` folder name, it is a static import — nothing is fetched.

`Config` reaches components through `src/Server/ConfigContext.js`. `App.js` (the only class component) puts it in state and provides it; every consumer reads it with `useContext(ConfigContext)`.

**The `disabled` flag is the feature-flag mechanism.** Every entry in `pages`, `settings.youtube`, `settings.mp3`, and `settings.contact` has `disabled`; consumers `.filter(x => !x.disabled)` (or early-return `null`) rather than deleting entries. Keep disabled content in place instead of removing it — that is how sections are turned off between bookings/seasons.

Component tree: `App` → `ConfigContext.Provider` → `Header` (`Menu` + the hero tagline) and `Main`. `Main` composes the order explicitly: the first enabled page (`OM`) → YouTube iframes → audio players → the remaining pages → `Form`. That ordering is deliberate — see the SEO/UX note in `Main.js`; don't "tidy" the media back above the intro.

`Main.js` resolves local MP3s with `require(\`../audio/${src}\`)` when `local: true`, so audio files must live in `src/audio/` and be bundled by webpack — a runtime string alone will not work.

**Section anchors are derived from titles.** `PageSection` sets `id={title.replaceAll(' ', '-')}`, and `Menu` derives the same value through its `sectionIdFor` helper for both the link `href` and the `IntersectionObserver` that drives `aria-current` — unless an explicit `navigate` is passed (the contact link uses `navigate="form"`). Renaming a page title changes its anchor in all three places at once, which is the point; hardcoding an id anywhere breaks the current-section highlight silently.

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
   execute JavaScript. `public/index.html` statically carries the title, description,
   canonical, geo meta, OG/Twitter tags and the JSON-LD `@graph`, and
   `scripts/prerender.js` (`postbuild`) renders `<App />` into `#root` using the Babel
   that ships with react-scripts. `index.js` uses `createRoot`, not `hydrateRoot`, so the
   bundle simply replaces that markup. AI fetchers (ChatGPT included) also drop
   `<noscript>`, scripts and meta, so **the prerendered markup is the only copy they
   read** — before it existed they saw a title and nothing else. **On a rebuild, keep
   static tags and a prerendered/SSG body.** A client-only rewrite is a silent, total
   regression in AI discoverability.

   To check what AI assistants see, fetch the live URL with an AI fetch tool (Claude
   Code's `WebFetch` works) and ask for the body text verbatim. `curl` with a ChatGPT
   user agent is no substitute — it returns 200 and the raw HTML either way.
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
   and `url`) pointing at the live base URL — currently
   `https://rebeccalennartsson.se/`. These cannot be relative,
   and they all have to move together if the base URL changes.
7. **`robots.txt` + `sitemap.xml`** exist at the domain root, and `robots.txt` explicitly
   allows the AI/answer-engine crawlers and points at the sitemap. Bump the sitemap
   `lastmod` when the copy changes.
8. **Mobile performance is a ranking factor and most visitors are on phones.** The hero
   photo is the LCP element; it is a CSS background, so it is preloaded from
   `public/images/` via `<link rel="preload">` with `media` attributes, and the URLs are
   declared as `--hero-*` custom properties in `index.html` so they stay unhashed and
   match the preload hints. Don't move these back into the webpack pipeline without
   replacing the preload.
9. **`og-image.jpg` is 1200×630.** Link previews are how the site spreads through wedding
   planning — a square image gets cropped or downgraded to a small card.

**The one maintenance trap:** `public/index.html` and `src/Server/Config.js` both contain
overlapping claims. The page body is prerendered from `Config.js`, but the JSON-LD
`description` fields (and the meta/OG descriptions) are hand-written — when you change a
page's text, update them to match. Nothing enforces this, and drift means crawlers and
humans see different claims.

**Known off-site gaps** (need Rebecca's input, not code):

- **Indexing:** the `.se` property needs to be verified in Google Search Console and Bing
  Webmaster Tools (ChatGPT search leans on Bing's index), with the sitemap submitted.
- **A Google Business Profile is probably the highest-value remaining action** for
  "sångerska Göteborg" — it is what puts her in the local/Maps results that sit above
  organic ones. Nothing in this repo can substitute for it.
- **`sameAs` links**: Instagram is on the `Person` node; Facebook / YouTube are still
  missing. These are the strongest signal for tying the site to a real, verifiable person.
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
