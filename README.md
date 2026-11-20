# DIYHOME3 — DIY Home Upgrades (Amazon Associates)

Shop-first publication for DIY home upgrades. Every product value is verified
against the official Amazon listing; anything unverifiable stays blank and is
flagged for review.

**Live site:** https://kanlerxz87-cyber.github.io/DIYHOME3/

## Start here

- [`EXECUTIVE_SUMMARY.md`](EXECUTIVE_SUMMARY.md) — what was submitted, what was
  built, what needs your review.
- [`COORDINATION.md`](COORDINATION.md) — shared task board (all sessions read
  this first).
- [`data/products.json`](data/products.json) — machine-readable verified product
  data (intended ASIN and observed redirect kept separate).

## Site map

| Path | Purpose |
|---|---|
| `index.html` | Publication front page (products first) |
| `products/` | Shop: categories + one detail page per product |
| `guides/` | Question-shaped buying guides |
| `verify/` | Dashboard: source register, link register, campaign ledger, Flagged for Review |
| `about.html` / `disclosure.html` | Authorship, methodology, full disclosure |
| `feed.xml` / `sitemap.xml` / `robots.txt` | RSS, sitemap, crawler rules |

## Compliance

- Disclosure strip under the masthead on every page + footer disclosure.
- Every outbound Amazon link: `rel="sponsored nofollow"`, labeled Sponsored,
  tagged `?tag=shopnow047c-20`.
- Tracking ID: `shopnow047c-20` (Associates-workflow validation pending — see
  `verify/flagged.html` F-04).

## Analytics

Five privacy-preserving events (`page_view`, `outbound_click`, `guide_read`,
`newsletter_signup`, `site_search`). No cookies, no fingerprinting, no PII.
Contract: [`data/events.md`](data/events.md). Self-hosted endpoint:
`server/analytics-server.py` (stdlib only).

## Deploy

GitHub Pages via `.github/workflows/pages.yml` (static, no build step).
