# Rebecca Lennartsson – Sångerska i Göteborg

Website for Rebecca Lennartsson, a singer in Gothenburg booked for weddings, funerals,
christenings and events. Live at **https://rebeccalennartsson.se**.

The site exists to be found — in Google and when people ask an AI assistant for a singer
in Göteborg. Read the **SEO** section of [`CLAUDE.md`](CLAUDE.md) before changing markup,
copy or hosting.

## Commands

Create React App (react-scripts 5) with yarn:

- `yarn start` — dev server on http://localhost:3000
- `yarn build` — production build to `build/`, then prerenders the page into
  `build/index.html` (`scripts/prerender.js`)
- `yarn deploy` — builds and publishes `build/` to the `gh-pages` branch, which is what
  the live site serves

There are no tests.

## Changing content

All text, sections and media live in [`src/Server/Config.js`](src/Server/Config.js). To
hide a section, set `disabled: true` rather than deleting it.

The structured data and descriptions in `public/index.html` (JSON-LD `description`
fields, meta/OG descriptions) are written by hand. When the copy changes, update them to
match, and bump `lastmod` in `public/sitemap.xml`.

## Publishing a change

1. `yarn deploy` — the live site updates within a minute or two.
2. Commit and push to `main` — `git push` alone does not change the website.

## Hosting

- **GitHub Pages**, from the `gh-pages` branch, with custom domain `rebeccalennartsson.se`
  and Enforce HTTPS on (repo Settings → Pages). `public/CNAME` must stay — every deploy
  replaces the whole branch.
- **DNS at Loopia**: four A records on `@` → `185.199.108.153`, `.109.153`, `.110.153`,
  `.111.153`; `www` CNAME → `rebeccalennartsson.github.io`; plus the Google Search Console
  verification TXT record on `@`. Keep that TXT record, and don't turn Loopia's
  forwarding back on.
- **Google Search Console** is verified for the domain, with `sitemap.xml` submitted.
