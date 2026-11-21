# Independent verification report — session `320a4dc7`

Date (UTC): 2026-11-21 · Branch: `arena/320a4dc7-diyhome3` · Base: `8c6035c`
(PR #22 merge, latest `main` at session start)

## Scope

Line-by-line re-verification of the live editorial release at
https://kanlerxz87-cyber.github.io/DIYHOME3/ against official sources, a
re-fetch of the three submitted short links and their observed Amazon
listings, the local build/link/disclosure/sponsored/feed/sitemap/analytics
gates, and a live Pages confirmation. This session edited `source/content.py`
(one factual correction), the generated `guides/air-fryer-capacity/index.html`,
this report, and `COORDINATION.md`. No product record, intent field, price,
rating, affiliate link or workflow was changed.

## 1. Submitted links and observed listings — re-fetched 2026-11-21

Each submitted short link was fetched and followed to its final `amazon.com/dp/`
page. The final URL, page title and browse-node path were recorded as
**observed only**. These are not product-intent confirmations and are not
published as prices, ratings or recommendations.

| Row | Submitted URL (text only) | Observed final listing (2026-11-21) | Observed title (abbrev.) | Observed category path | Intended ASIN |
|---|---|---|---|---|---|
| 1 | `https://link.amazon/B0hmGG4m2` | [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM) | Art3d Smoothing Tool Kit for Peel and Stick Wallpaper | Tools & Home Improvement › Paint, Wall Treatments & Supplies › Wallpaper & Wallpapering Supplies › Wallpaper Tools | *(blank — unverified)* |
| 2 | `https://link.amazon/B03QDuGdo` | [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) | Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black | Home & Kitchen › Kitchen & Dining › Storage & Organization › Racks & Holders › Paper Towel Holders | *(blank — unverified)* |
| 3 | `https://link.amazon/B03QDuGdo` | [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) | same as row 2 — exact duplicate submission | same as row 2 | *(blank — unverified)* |
| 4 | `https://link.amazon/B0hpD2JGQ` | [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD) | ORDORA Pots and Pans Organizer Under Cabinet 16.6", 8-Tier Adjustable Rack | Home & Kitchen › Kitchen & Dining › Storage & Organization › Racks & Holders › Pot Racks | *(blank — unverified)* |

All three short links still resolve to the same three ASINs recorded on
2026-11-20; no redirect drift was observed. The observed titles and category
paths match `data/products.csv` and `data/products.json`. The submitted tokens
are 9 characters, so none can be recorded as a confirmed 10-character ASIN
([Amazon Developer: ASIN is a 10-character alphanumeric unique identifier](https://developer.amazon.com/en-US/docs/alexa/alexa-shopping/implement-shopping-actions.html)).

Observed-only price snapshots on 2026-11-21 (not published anywhere on the
site): B08FKW9JRM `$5.08`; B0BSKQW2T2 `$6.79`; B08DY9HRWD `$17.74` (Prime
Member Price, sold by ORDORA Official). Time-sensitive; re-verify before any
use.

## 2. Official sources rechecked (2026-11-21)

| Claim on the site | Official source (fetched) | Result |
|---|---|---|
| Disclosure sentence required; Special Links must use tagged formats | [Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) (updated October 15, 2025) | Confirmed — §5 exact sentence “As an Amazon Associate I earn from qualifying purchases.”; §1 tagged formats |
| Qualifying Purchases: 24-hour session, 89-day cart window | [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) (updated April 14, 2026) | Confirmed — Commission Income Statement §1 |
| Link-level disclosure must be clear and conspicuous | [Why identify yourself as an Associate](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98) | Confirmed — “(paid link)”, “#ad”, “#CommissionsEarned” examples |
| Material connection disclosed clearly and conspicuously | [FTC Endorsement Guides FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | Confirmed |
| Paid/advertising links marked `rel="sponsored"` | [Qualify your outbound links to Google](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | Confirmed |
| GitHub Pages not for primarily commercial transactions | [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | Confirmed |
| Fixed standard rates: Kitchen 4.50%, Tools / Home / Home Improvement 3.00% | [Standard Commission Income Statement](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ) | Confirmed — Table 1 |
| Creators API prerequisites (enrollment, ≥10 qualifying sales in 30 days, registration, credentials) | [Welcome to Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) | Confirmed — Prerequisites 1–4 |
| Sitemap and feed conventions | [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap); [Get started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start) | Confirmed |
| Air-fryer food-safety claims (overcrowding, batches, no raw stuffed breaded chicken, thermometer) | [USDA FSIS: Air Fryers and Food Safety](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/air-fryers-and-food-safety) | Confirmed |
| Vortex 6QT basket is top-rack dishwasher safe | [Instant Pot Vortex 6QT product page](https://instantpot.com/products/instant-pot-vortex-6qt-air-fryer) | Confirmed — FAQ “Yes! The air fryer basket is top rack dishwasher safe.” |
| Art3d A17999 specs (Metal, 4.2 oz, 4 replacement blades) | [Art3d A17999 product page](https://www.art3d.com/designs/a17999---peel-and-stick-wallpaper-backsplash-application-tool-smoothing-kit/) | Confirmed — parameter table |
| GitHub privacy practices | [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) | Confirmed |

No cited official source was unreachable.

## 3. Dimension claim — independent concurrence with a concurrent correction

`guides/air-fryer-capacity/` said Instant Pot “lists basket dimensions
separately from volume”. The cited Vortex 6QT page lists the 6-quart volume
and the **unit’s overall dimensions** (Wide 12.36 × Height 12.83 × Length
14.92 in), not basket dimensions. This session’s branch (based on `8c6035c`)
corrected the sentence; on rebase onto `main` (`ec124f6`) the same correction
was already present from session `2a2c477f` (T20, commit `d8c8fd7`), with
wording that matches this session’s independent finding: “Instant Pot
publishes a 6-quart volume alongside overall dimensions … those are the
dimensions of the appliance, not a substitute for the usable basket area.”
This session kept that wording; no additional edit was needed. No other guide
claim was contradicted by its cited source.

## 4. Local gates (run 2026-11-21 on `arena/320a4dc7-diyhome3`)

- `python3 scripts/build.py` then `python3 scripts/build.py --check` — exit 0 (output in sync)
- `python3 scripts/check.py` — 2 tests OK (32 pages, disclosure ×2, canonical, sitemap/feed, event gate)
- `python3 verification/check_release.py .` — 32 HTML pages, 0 findings
- `python3 -m unittest discover -s verification` — 5 tests OK
- `python3 -m unittest scripts.test_affiliate_pipeline` — 6 tests OK
- `python3 scripts/validate_register.py` — 3 records validated; intended/observed separation preserved
- `python3 scripts/affiliate_pipeline.py audit-repo` — OK

## 5. Live confirmation (2026-11-21)

- GitHub Pages API: `status=built`, source `main` `/`, latest build commit
  `8c6035c1205e0713836051cfff99fa2d4bce26c2`.
- Fetched live: [front page](https://kanlerxz87-cyber.github.io/DIYHOME3/) and
  [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged-for-review/)
  retrieved and matching the tree at `8c6035c`.

## 6. Irregularities (unchanged; all published on Flagged for Review)

1. Intended ASINs unconfirmed; observed ≠ intended.
2. Duplicate submission (`B03QDuGdo` twice) — preserved as rows 2–3.
3. Air-fryer guide titles are working hypotheses with no matching submitted product.
4. Tracking ID `shopnow047c-20` unvalidated; no tagged link published.
5. Search Console property and production analytics not connected.
6. Listing/manufacturer spec discrepancies left blank, never merged.

## 7. Verdict

The release is live, internally consistent and consistent with the official
sources rechecked here. One editorial sentence was independently re-verified
and was already corrected on `main` by a concurrent session; this session
concurred and kept that wording. No product record, intent field or commercial
control changed. This report and the `COORDINATION.md` append are this
session’s changes.
