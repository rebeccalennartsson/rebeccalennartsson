# Slop Review — main

How this file works: ask me to complete any item and I will mark it - [x] once it is actually done; if I cannot finish it I leave it unchecked and tell you why; ask me to strike items to decline them (- [~]).

Scope: the current uncommitted diff (base URL reverted to the `github.io` project-site URL), read as "does this fit the project, or is it agent-generated filler?"

## Findings

- [ ] **1. `sitemap.xml` carries two fields Google has publicly said it ignores** — `public/sitemap.xml:6-7`. `changefreq` and `priority` are cargo cult: Google stated years ago that it does not use either, and Bing treats `priority` as noise. For a **one-URL** sitemap `priority: 1.0` is doubly meaningless — there is nothing to prioritise it against. This is exactly the shape of thing that gets pasted in because sitemaps "usually have it". Keep `loc`, keep an accurate `lastmod`, drop the other two.

- [ ] **2. The `robots.txt` header comment duplicates `CLAUDE.md` § Deployment** — `public/robots.txt:1-7`. Seven lines of prose explaining that the file is inert, plus instructions for switching to the apex domain (add `CNAME` back, point DNS at GitHub, submit the sitemap manually). All of that is already in `CLAUDE.md`, at more length and where someone would actually look for it. Two copies of a migration runbook will diverge the moment one is edited. A one-line "inert on a project-site URL — see CLAUDE.md § Deployment" carries the warning without the duplication.
