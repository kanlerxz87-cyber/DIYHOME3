# Executive summary — DIY HOME upgrades

**Date:** 2026-11-20 · **Site:** https://kanlerxz87-cyber.github.io/DIYHOME3/ ·
**Tracking ID on file (owner-supplied, pending validation):** `shopnow047c-20`

## What was built
- A publication-style shop (GitHub Pages, `docs/`): front page leading with the
  three submitted products by category (kitchen storage ×2, wallpaper tools ×1),
  category subpages, six question-shaped guides, RSS feed, sitemap, one canonical host.
- Disclosure above the fold on every page (Associates statement in a strip under
  the masthead, repeated in the footer); every outbound product link labelled
  Sponsored with `rel="sponsored nofollow noopener"`.
- A product-intent confirmation record (`data/products.csv`, rendered at
  `docs/register.html`) keeping **intended** ASIN/listing/date/source strictly
  separate from **observed** redirect targets. They are never merged.
- Measurement before more content: five defined events (`page_view`,
  `product_view`, `guide_view`, `outbound_click`, `search_submit`), a
  privacy-preserving local counter now, and a self-hosted endpoint stub
  (`analytics/worker.js`) for the owner to deploy. Campaign ledger
  (`data/campaign-ledger.csv`) is defined and empty — rows only from authorised
  Associates reports, with dated provenance. No conversion score or forecast anywhere.
- Automation with a gate (`scripts/`): register validation, page/feed generation,
  and a build check that fails on a missing disclosure, an un-sponsored outbound
  link, a published price/rating, or a broken internal link. Special Links are
  generated only in the enrolled Associates workflow — one per product, tested —
  never hand-built.

## Verified from official sources (see `data/sources.csv` / `docs/sources.html`)
- Associates statement wording + Special-Link/tag rules — Amazon Associates
  Operating Agreement & Program Policies (S-01, S-02).
- FTC clear-and-conspicuous affiliate disclosure (S-03, S-04).
- ASIN = 10-character identifier — Amazon Developer (S-05). **Every submitted
  token is 9 characters, so no intended ASIN is recorded.**
- `rel="sponsored"` for paid/affiliate links — Google Search Central (S-06).
- Observed (2026-11-20) listing titles/categories — Amazon.com (S-09…S-11).
  Recorded as observations only; prices/ratings left blank site-wide.

## Flagged for review (non-blocking; published at `docs/flagged.html`)
F-01 9-char tokens ≠ ASINs · F-02 intended ≠ observed (not merged) · F-03 duplicate
submission (P-02) · F-04 short-link compliance unresolved (not claimed invalid) ·
F-05 tracking ID unverified without Associates Central access · F-06 prices/ratings
blank · F-07 air-fryer guide titles vs DIY products · F-08 Search Console/API/endpoint
need owner accounts · F-09 no product images (Program Content) yet.

## Owner's five-minute unlock
1. In Associates Central, confirm each product's intended ASIN + official listing
   and fill the register's intended fields (or send them for entry).
2. Generate **one** Special Link per product for `shopnow047c-20`, click-test
   destination, check the tracking report — then cards switch to tracked CTAs.
3. Verify the Search Console property; deploy `analytics/worker.js` and set its
   URL (see `analytics/README.md`) when ready.
