# Independent integrated-release audit · 2026-11-20

Session `arena-e10111d6`, PR #8. This is an audit of the **existing integrated root publication**, not another site, product endorsement, or blanket compliance certification.

## Executive outcome

The integrated publication contains 32 tracked HTML routes, including preserved legacy handoffs, seven current question-shaped guides, category navigation, an executive summary, a product register, and Flagged for Review. All four input rows survive; three unique observed destinations are kept separate from blank intended-product confirmations. No paid purchase links, price/rating snapshots, or production-analytics claim was activated by this audit.

The initial empty-repository prototype built by this session was retired when a fresh remote check revealed the integrated publication already on `main`. Its tests are not reported as tests of this release. Shared source/output/workflow files and prior verification evidence were retained, not replaced.

## Reproducible checks

```sh
python scripts/build.py --check
python scripts/check.py
python scripts/validate_register.py
python verification/test_check_release.py
python verification/check_release.py . --dashboard executive-summary/ --dashboard product-register/ --dashboard flagged-for-review/ --dashboard measurement/ --dashboard sources/ $(printf -- '--guide %s ' guides/*/)
python release_checks/e10111d6/check.py
python -m unittest discover -s release_checks/e10111d6 -v
```

Observed results: build output up to date; 2 integrated publication/HTTP collector tests passed; 3 register records validated; 5 existing independent checker fixtures passed; 32-page independent release check found zero findings; added table/source/identity checks passed with 5 fixtures. The five collector event types in the integrated implementation are `page_view`, `guide_view`, `outbound_click`, `feed_click`, and **report-only** `reported_order`. A click is never treated as an order. The prototype's differing event names are not part of this release.

Additional one-session Chromium checks passed at 1440px desktop and 390px mobile: shop/guide/register navigation, native keyboard-operated editorial desk menu, all 32 local page responses, no horizontal page overflow, disclosure above the mobile fold, image loading, and no JavaScript exceptions. Canonical-host asset requests were routed to the local integrated server for the browser test; this was not a live-network browser crawl. Browser dependencies, screenshots, local databases and test fixtures are not committed.

The added checker only establishes that each data-table row has an HTTPS link on an explicit official-domain allowlist. It does **not** establish that every row's prose follows from that link. Official-source reading scope is recorded separately below.

## Official-source rechecks

All entries below were retrieved with the session's `fetch_page` tool on 2026-11-20. Dynamic values were not imported. “Observed” does not mean intended identity, authorized data access, product testing, or account attribution.

| Scope | Official source | Result / limitation |
|---|---|---|
| Submitted wallpaper short link | https://link.amazon/B0hmGG4m2 → https://www.amazon.com/dp/B08FKW9JRM | Final URL and title observed: Art3d wallpaper smoothing tool kit. Intended product remains unconfirmed. |
| Submitted towel-holder short link | https://link.amazon/B03QDuGdo → https://www.amazon.com/dp/B0BSKQW2T2 | Final URL and title observed: under-cabinet paper towel holder. Duplicate is a submitted-input finding, not a manufacturer claim. |
| Submitted cookware short link | https://link.amazon/B0hpD2JGQ → https://www.amazon.com/dp/B08DY9HRWD | Final URL and title observed: ORDORA cookware organizer. No load rating or current price inferred. |
| ASIN identification | https://sell.amazon.com/blog/what-is-an-asin | Amazon describes a unique ten-character alphanumeric identifier and the `/dp/` URL method. This does not resolve input intent. |
| Affiliate disclosure / Special Links | https://affiliate-program.amazon.com/help/operating/agreement | Sections 1 and 5 read: tagged Special Links and prominent Associates statement. No account enrollment verified. |
| Associate and link-level disclosures | https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98 | Clear/conspicuous disclosure near links; site-wide statement. Placement checked separately in browser/local artifact. |
| Program policy boundaries | https://affiliate-program.amazon.com/help/operating/policies | Index and qualifying-purchase definitions read. Full current API/IP-license compliance and authorization remain unverified. |
| Material connections | https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers | Disclosure should be hard to miss and near endorsement; do not invent experience with untried products. |
| Hosting boundary | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | Pages is not permitted as free hosting for an online business/site primarily facilitating commercial transactions. Existing editorial-only/no-commerce gate retained. |
| Paid-link attributes | https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links | Google documents `rel="sponsored"` for paid links. Structural markup tests passed; not a ranking guarantee. |
| Search discovery | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview | Sitemap assists discovery; no evidence of indexing, ownership verification, or search volume. |
| Appliance safety claims in integrated guides | https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/air-fryers-and-food-safety | Confirmed source statements about avoiding overcrowding, batches, thermometer checks, separation/sanitation, and not air-frying raw stuffed breaded chicken breast products. No new cooking instructions added. |
| Model-specific examples in integrated guides | https://instantpot.com/products/instant-pot-vortex-6qt-air-fryer | Chunks 1–4 read. Manufacturer image alt text lists basket dimensions separately from volume; FAQ says basket is top-rack dishwasher safe. Not generalized to another model and no independent performance testing claimed. |
| Tool-kit example in integrated guide | https://www.art3d.com/designs/a17999---peel-and-stick-wallpaper-backsplash-application-tool-smoothing-kit/ | Page names red/blue squeegees and craft knife. Mixed templated tile parameter text is not used for product specifications. Exact submitted-product intent remains open. |

## Public checks and open gates

The public front page, [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged-for-review/), and [product register](https://kanlerxz87-cyber.github.io/DIYHOME3/product-register/) were fetched after integration. Their reader content, blank intent fields, duplicate relationship and operational gates were visible. Public RSS/sitemap and exact deployment commit are confirmed in the appended coordination publish record.

Unresolved items remain on the existing public Flagged for Review page: intended identity, enrolled Special Link destination/report tests, approved commercial hosting, authorized product/review/commission data, Search Console ownership/queries, and persistent production analytics. No live AI model or autonomous optimization is certified. These are not hidden behind synthetic traffic or revenue scores.
