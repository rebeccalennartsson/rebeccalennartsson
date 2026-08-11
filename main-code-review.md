# Code Review — main

How this file works: ask me to complete any item and I will mark it - [x] once it is actually done; if I cannot finish it I leave it unchecked and tell you why; ask me to strike items to decline them (- [~]).

Scope: the current uncommitted diff — reverting the base URL from the `rebeccalennartsson.se` apex back to the `github.io` project-site URL so the site could be published without a redirect loop.

## Findings

- [ ] **1. Remote `main` and the deployed site disagree, and a clean checkout would re-break production** — `package.json:3`, `public/CNAME`. Commit `451005d` (already pushed) contains `public/CNAME` and the `.se` base URL; this revert is uncommitted. The live site is correct because `gh-pages` publishes from `build/`, which was built from the working tree — but anyone cloning `main` and running `yarn deploy` would republish the `CNAME`, GitHub would attach the custom domain, and the registrar's still-active 302 would produce the redirect loop that this revert exists to avoid. Committing the revert closes it. Left uncommitted deliberately — committing needs your say-so.

- [ ] **2. The base URL lives in 20 hand-maintained places** — `package.json:3` plus 17 occurrences in `public/index.html`, one in `public/sitemap.xml`, one in `public/robots.txt`, and the logo `href` in `src/Components/Menu.js:10`. CRA's `%PUBLIC_URL%` only substitutes the *path*, so canonical / `og:url` / `og:image` / the JSON-LD `@id`s all need the full origin and cannot use it. This diff had to rewrite every one by hand, and the previous commit is direct evidence of the failure mode: it shipped `CNAME` + `.se` URLs in a state that would have taken the site down. A small `prebuild` script stamping these from `package.json`'s `homepage` would make the switch-over a one-line change instead of a 20-site edit.

- [ ] **3. `.nojekyll` is never actually published** — `package.json:11` (`gh-pages -d build`). The `gh-pages` CLI skips dotfiles unless passed `-t` / `--dotfiles`, so `public/.nojekyll` reaches `build/` but not the `gh-pages` branch — confirmed absent from the published tree. Harmless today because nothing in the build starts with `_` or `.`, which the live 200s bear out, but the file's presence implies protection that is not there. Fix is `gh-pages -d build -t`.

- [ ] **4. `sitemap.xml` claims a `lastmod` that is now wrong** — `public/sitemap.xml:5`. The date is hardcoded to `2026-08-11` and does not track deploys, so it will drift from reality on every publish. `lastmod` is the one sitemap field Google actually acts on, and an inaccurate one is worse than an absent one. Either stamp it at build time or drop the element.
