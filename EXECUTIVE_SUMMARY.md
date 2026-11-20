# Executive Summary — DIY Home Upgrades (Amazon Associates)

**Site:** DIY Home Upgrades — a shop-first publication for DIY home upgrades.
**Tracking ID:** `shopnow047c-20` (per brief; Associates-workflow validation pending).
**Verification date:** 2026-11-20. Every product value below was observed on the
official Amazon listing page on that date. Prices and ratings are snapshots.

## What was submitted

Four short links were submitted; one was a duplicate. After deduplication there
are **three distinct products**:

| # | Submitted short link | Destination ASIN (observed) | Product | Price observed | Rating |
|---|---|---|---|---|---|
| 1 | https://link.amazon/B0hmGG4m2 | B08FKW9JRM | Art3d Smoothing Tool Kit for Peel and Stick Wallpaper | $5.08 (Typical $5.99) | 4.6★ · 26,432 ratings · Amazon's Choice |
| 2 | https://link.amazon/B03QDuGdo | B0BSKQW2T2 | niffgaff Paper Towel Holder Under Cabinet, Matte Black | $6.79 (Typical $7.99) | 4.2★ · 12,099 ratings · Amazon's Choice |
| 3 | https://link.amazon/B0hpD2JGQ | B08DY9HRWD | ORDORA Pots and Pans Organizer 16.6", 8-Tier | $17.74 Prime (List $23.99) | 4.4★ · 18,835 ratings |

Source for every row: `https://www.amazon.com/dp/<ASIN>` (see `verify/index.html`).

## Critical finding — short codes are not ASINs

The codes in the submitted `link.amazon/*` URLs (`B0hmGG4m2`, `B03QDuGdo`,
`B0hpD2JGQ`) **do not match** the destination ASINs (`B08FKW9JRM`, `B0BSKQW2T2`,
`B08DY9HRWD`). The site therefore stores the intended ASIN and the observed
redirect target in **separate fields** and never merges them. The compliance
status of the supplied short links is **unresolved** — this summary does not
claim they are invalid. All outbound links on the site use validated Special
Links (`https://www.amazon.com/dp/<ASIN>?tag=shopnow047c-20`).

## What was built

- **Publication front page** (`index.html`) — products first, dashboard surfaces
  reachable from the footer and one navigation group.
- **Shop pages** — two categories (Wallpaper tools; Kitchen organization) and
  one detail page per product, each with a verified-spec table and a source link.
- **Question-shaped guides** — three guides matched to the actual products.
  Air-fryer / multi-function-appliance titles from the brief are listed as
  *planned, unpublished* because no such products were submitted.
- **Trust machinery** — disclosure strip under the masthead on every page plus
  footer disclosure; every outbound link marked Sponsored
  (`rel="sponsored nofollow"`); product-intent confirmation register; empty
  campaign ledger (no conversion score or revenue forecast); Flagged for Review
  page for unverified items.
- **Measurement** — privacy-preserving analytics with five events
  (`page_view`, `outbound_click`, `guide_read`, `newsletter_signup`,
  `site_search`); no cookies, no fingerprinting, no PII. A self-hosted endpoint
  contract + reference server is included (`server/analytics-server.py`).
- **Findability** — `sitemap.xml`, `robots.txt`, RSS feed (`feed.xml`), semantic
  HTML, JSON-LD, and a Search Console verification placeholder.

## Compliance posture

- Disclosure wording follows the Amazon Associates Operating Agreement
  (updated 2025-10-15) and FTC Endorsement Guides (16 CFR Part 255):
  *"As an Amazon Associate I earn from qualifying purchases."*
- Special Links use the tagged format required by the Operating Agreement.
- One-link-per-product Associates test (destination + tracking report) is
  **pending** before scaling — see Flagged for Review.
- No prices, ratings, or claims are inferred. Anything not confirmable from an
  official source is left blank and flagged.

## What needs your review (does not block launch)

1. Confirm `shopnow047c-20` in Associates Central and test one Special Link per
   product (destination + tracking report).
2. Re-check prices/ratings — they drift daily.
3. Fill the blank spec fields (model number, origin, first-available date) from
   the listing pages or leave them flagged.
4. Decide whether to source air-fryer / multi-function-appliance products before
   publishing those guide titles.
5. Add your Search Console verification token and analytics endpoint URL.

## Sources (official)

- https://www.amazon.com/dp/B08FKW9JRM
- https://www.amazon.com/dp/B0BSKQW2T2
- https://www.amazon.com/dp/B08DY9HRWD
- https://affiliate-program.amazon.com/help/operating/agreement
- https://affiliate-program.amazon.com/help/operating/policies
- https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
