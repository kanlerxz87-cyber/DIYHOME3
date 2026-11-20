# COORDINATION.md — Shared Task Board

## Active Session
- **Session Branch**: `arena/c7cc15c6-diyhome3`
- **Base Commit**: `5456d411991b8c384eedf4d6e198aed49786a89e` (`main`)
- **Tracking ID**: `shopnow047c-20`

## Task Board

| ID | Task | Status | Owning Session | Files | Notes |
|---|---|---|---|---|---|
| T-01 | Repository review & `COORDINATION.md` setup | `done` | `arena/c7cc15c6-diyhome3` | `COORDINATION.md` | Initialized task board |
| T-02 | Product-intent confirmation & link audit | `needs review` | `arena/c7cc15c6-diyhome3` | `data/products.json`, `flagged.html` | 4 submitted links (1 duplicate: `B03QDuGdo`). Sandbox has no outbound access to `link.amazon` or `amazon.com`; fields left blank and flagged as unverified. |
| T-03 | Publication front page, disclosure strips & navigation | `done` | `arena/c7cc15c6-diyhome3` | `index.html`, `assets/styles.css`, `assets/app.js` | Disclosure above the fold & in footer; `rel="sponsored"` on outbound links |
| T-04 | Dashboard, campaign ledger & 5-event analytics | `done` | `arena/c7cc15c6-diyhome3` | `dashboard.html`, `assets/app.js` | Privacy-preserving local click counter & campaign ledger |
| T-05 | Question-shaped buyer guides & Executive Summary | `done` | `arena/c7cc15c6-diyhome3` | `guides.html`, `executive-summary.html` | Working titles framed as editorial hypotheses |
| T-06 | SEO, RSS feed, sitemap & GitHub Pages deploy | `in progress` | `arena/c7cc15c6-diyhome3` | `sitemap.xml`, `feed.xml`, `robots.txt`, `.nojekyll` | PR to `main`, merge, and verify Pages |

## Verification & Irregularities Log
- **Irregularity 1 (Duplicate Link)**: `https://link.amazon/B03QDuGdo` was submitted twice in the prompt. Logged as a duplicate entry for manual review.
- **Irregularity 2 (Unverified External Links)**: Outbound network access in this sandbox is restricted to GitHub, npm, and PyPI. `link.amazon` short links and `amazon.com` listings could not be fetched or resolved. Per verification rules, all unconfirmed fields (intended ASIN, official listing URL, price, title, observed redirect target) are left blank and flagged as `unverified` on `flagged.html`. Short-link compliance status is marked `unresolved` (not claimed invalid).
