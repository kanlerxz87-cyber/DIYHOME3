# Executive summary — DIY Home Upgrades

**Live site:** https://kanlerxz87-cyber.github.io/DIYHOME3/ · **Last verified:** 2026-11-21 (UTC)

**Decision:** the public GitHub Pages release stays editorial. The shop is complete and readable, but
buying buttons stay off until two things only the account owner can supply are in place: confirmed
product intent in Associates Central, and hosting that permits an e-commerce site. GitHub states that
Pages is *"not intended for or allowed to be used as a free web-hosting service to run your online
business, e-commerce site"* — [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## The four submitted links

| Submitted | Observed listing | Intended ASIN | Status |
|---|---|---|---|
| `https://link.amazon/B0hmGG4m2` | [B08FKW9JRM — wallpaper smoothing tool kit](https://www.amazon.com/dp/B08FKW9JRM) | *(blank)* | Unverified intent |
| `https://link.amazon/B03QDuGdo` | [B0BSKQW2T2 — under-cabinet paper towel holder](https://www.amazon.com/dp/B0BSKQW2T2) | *(blank)* | Unverified intent |
| `https://link.amazon/B03QDuGdo` | [B0BSKQW2T2 — same listing](https://www.amazon.com/dp/B0BSKQW2T2) | *(blank)* | Duplicate of row 2 |
| `https://link.amazon/B0hpD2JGQ` | [B08DY9HRWD — ORDORA pots and pans organizer](https://www.amazon.com/dp/B08DY9HRWD) | *(blank)* | Unverified intent |

All three listing pages were re-fetched on **2026-11-21** and still resolve to the same ASINs with the
same items. Prices, ratings, stock and "bought in past month" figures are deliberately **not**
republished: they change continuously, and Amazon requires an approved data source and refresh for
price display. The requested tracking ID is `shopnow047c-20`; that is a request, not proof of
enrollment or attribution.

## What is published

| Surface | What a reader gets |
|---|---|
| Home (`/`) | Publication front page: three categories, latest guides, RSS |
| Shop (`/shop/`) | Category cards plus an at-a-glance table: item, category, job, guide, buying-link status, source |
| Category pages (`/shop/walls-finishes/`, `/shop/kitchen-organization/`, `/shop/storage-shelving/`) | Item, observed ASIN, recheck date, what to compare, guide, source |
| Guides (`/guides/…`, 7 pages) | Question-shaped buying guides, each section citing an official source |
| Editorial desk (`/executive-summary/`, `/product-register/`, `/flagged-for-review/`, `/measurement/`, `/sources/`) | Every finding, every open item, every source, in tables |

Disclosure — *"As an Amazon Associate I earn from qualifying purchases."* — sits under the masthead
and repeats in the footer on all 35 pages. Every outbound Amazon, Instant Pot or Art3d link carries
`rel="sponsored noopener noreferrer"`.

## Verified against official sources on 2026-11-21

| Claim | What the official page says | Source |
|---|---|---|
| Commission rates | Kitchen 4.50%; Home, Home Improvement, Tools 3.00%; all other 4.00% | [Standard Commission Income Statement](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ) |
| API prerequisites | Enrollment + ≥10 qualifying sales in past 30 days + registration + credentials | [Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) |
| Link compliance | Special Links must use the tagged formats Amazon provides | [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) (updated 2025-10-15) |
| Qualifying purchases | 24-hour session; 89-day add-to-cart window | [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) (updated 2026-04-14) |
| Air-fryer safety | Don't overcrowd; batch; use a thermometer; no raw stuffed breaded chicken breast | [USDA FSIS](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/air-fryers-and-food-safety) |
| Vortex 6QT | Basket is top-rack dishwasher safe; 6 qt; 12.36 W × 12.83 H × 14.92 L in | [Instant Pot](https://instantpot.com/products/instant-pot-vortex-6qt-air-fryer) |
| Art3d A17999 | Red squeegee, blue squeegee, craft knife + 4 blades; 4.2 oz; metal | [Art3d](https://www.art3d.com/designs/a17999---peel-and-stick-wallpaper-backsplash-application-tool-smoothing-kit/) |

One published claim was wrong and is now corrected: the capacity guide said Instant Pot
"lists basket dimensions separately from volume". The product page publishes a volume and the
appliance's overall dimensions, not usable basket area. The sentence now says exactly that.

## Open items (published on Flagged for Review)

1. **Intended ASIN unconfirmed** for all four submissions — only the owner can confirm.
2. **Special Links untested** — the supplied short links are *not* declared invalid; their compliance status is unresolved. Generate one link per product in the enrolled workflow, check destination and tracking report before scaling.
3. **Hosting** — move off Pages before enabling paid links.
4. **Search Console** — property ownership was not verified; submit `sitemap.xml` after verification.
5. **Measurement** — the five-event collector is tested locally but not deployed; the campaign ledger is an empty schema and must stay that way until authorized reports exist.
6. **Listing drift** — treat all Amazon values as dated observations.

## What to do next

The fastest path to a monetised site is: confirm enrollment and tracking ID in Associates Central →
generate one Special Link per product → check the destination and the tracking report → deploy the same
tree to eligible hosting, where `SPECIAL_LINKS` can be enabled and the build gate will refuse any link
that lacks intent, destination, report and policy sign-off.

See also: [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged-for-review/) ·
[Product register](https://kanlerxz87-cyber.github.io/DIYHOME3/product-register/) ·
[Source library](https://kanlerxz87-cyber.github.io/DIYHOME3/sources/) ·
[RSS](https://kanlerxz87-cyber.github.io/DIYHOME3/feed.xml)
