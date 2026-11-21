# Independent verification report — session `99686052`

Date (UTC): 2026-11-21 · Branch: `arena/99686052-diyhome3` · Base: `14c9851` (PR #17 merge)

## Scope

Line-by-line verification of the live editorial release at
https://kanlerxz87-cyber.github.io/DIYHOME3/ against official sources, plus
local build/link/disclosure/sponsored/feed/sitemap/analytics gates and a live
Pages confirmation. This session edited only `release_checks/99686052/**` and
appended to `COORDINATION.md`. Site files, data, scripts, and other sessions'
scopes (including `release_checks/d47e5378/**` on open PR #18) were not edited.

## Method

1. Ran the repo's own gates locally (see §3).
2. Scanned all 32 published HTML pages for disclosure placement, tagged CTAs,
   sponsored markup, and published prices/ratings (see §2).
3. Fetched the live homepage, Flagged for Review, Product register, Measurement,
   and RSS feed from the public host.
4. Fetched the official policy sources listed in §1 and compared each claim the
   site makes against the source text.
5. Did **not** re-fetch Amazon product listings in this session. The observed
   redirect targets below are prior sessions' dated observations (2026-11-20),
   preserved as *observed only* — not re-verified here and not treated as
   product-intent confirmation.

## 1. Official sources rechecked (2026-11-21)

| Claim on the site | Official source (fetched) | Result |
|---|---|---|
| Special Links must use the tagged formats Amazon provides; disclosure sentence required | [Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) (Updated: October 15, 2025) | Confirmed — §1 defines Special Links as links that "properly use the special 'tagged' link formats we provide" |
| Qualifying Purchases: 24-hour session, 89-day cart window | [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) (Updated: April 14, 2026) | Confirmed — Commission Income Statement §1(b)–(c) |
| Material connection must be disclosed clearly and conspicuously | [FTC's Endorsement Guides: What People Are Asking](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | Confirmed — "that connection should be disclosed clearly and conspicuously" |
| Paid/advertising links marked `rel="sponsored"` | [Qualify your outbound links to Google](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | Confirmed — `rel="sponsored"` for "advertisements or paid placements" |
| GitHub Pages is not for sites primarily directed at facilitating commercial transactions | [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | Confirmed — "not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions" |
| Fixed standard rates: Kitchen 4.50%, Tools / Home / Home Improvement 3.00% | [Associates Program Standard Commission Income Statement](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ) | Confirmed — Table 1 lists Kitchen at 4.50% and Tools/Home/Home Improvement at 3.00% |
| Creators API requires Associates enrollment, ≥10 qualifying sales in past 30 days, registration, credentials | [Welcome to Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) | Confirmed — Prerequisites 1–4 |

No source was unreachable. No site claim contradicted its source.

## 2. Line-by-line checks (all 32 published HTML pages)

| Check | Result |
|---|---|
| Disclosure sentence "As an Amazon Associate I earn from qualifying purchases." present above `<main>` (above the fold) | 32/32 pass |
| Disclosure repeated in footer (2 occurrences per page) | 32/32 pass |
| Tagged affiliate CTAs (`?tag=shopnow047c-20`) in published HTML/XML | 0 found — correct: `SPECIAL_LINKS` is empty and the Pages profile fails closed if populated |
| Amazon `/dp/` links lacking `rel="sponsored"` | 0 found (26 product links, all marked sponsored) |
| Published prices (`$x.xx`) or star ratings | 0 found — correct: no authorized feeds/reports, so none are published |
| Canonical URL on every page except `404.html` | 31/31 pass |
| RSS autodiscovery `<link rel="alternate" type="application/rss+xml">` | Present on all pages |
| Sitemap membership | 10 URLs (home, shop, guides index, 7 guides) — matches the 7 guides in `feed.xml` |
| Feed | RSS 2.0 with `atom:link rel="self"`, disclosure in channel description and every item |
| `robots.txt` | `Allow: /` + Sitemap URL — correct |
| Product-intent record (`data/products.json`, Product register page) | All 4 submissions preserved; `intended_asin`, `official_listing_url`, `confirmed_on`, `confirmation_source` blank on every row; observed targets stored separately; duplicate row 3 flagged as duplicate of row 2 |
| Campaign ledger (`analytics/ledger.csv`, Measurement page) | Header-only (empty, well-defined); blank means no report, not zero; no conversion score or revenue forecast anywhere |
| Five events | `page_view`, `guide_view`, `outbound_click`, `feed_click`, `reported_order` — implemented in `assets/analytics.js` + `analytics/server.py`, disabled on `github.io`, honoring DNT/GPC |

### Product rows (observed only — not re-verified this session)

| Row | Submitted URL (text only) | Observed redirect (2026-11-20) | Intended ASIN | Status |
|---|---|---|---|---|
| 1 | `https://link.amazon/B0hmGG4m2` | `B08FKW9JRM` (wallpaper smoothing kit) | *(blank — unverified)* | Unverified intent |
| 2 | `https://link.amazon/B03QDuGdo` | `B0BSKQW2T2` (paper towel holder) | *(blank — unverified)* | Unverified intent |
| 3 | `https://link.amazon/B03QDuGdo` | `B0BSKQW2T2` | *(blank — unverified)* | Unverified intent; duplicate of #2 |
| 4 | `https://link.amazon/B0hpD2JGQ` | `B08DY9HRWD` (cookware rack) | *(blank — unverified)* | Unverified intent |

Short-code ≠ ASIN: each submitted token is 9 characters, so none can be recorded
as a confirmed 10-character ASIN. The short links are **not** declared invalid;
their exact compliance status is unresolved (S02), exactly as the site states.

## 3. Local gates (run 2026-11-21 on `arena/99686052-diyhome3`)

- `python3 scripts/build.py --check` — exit 0 (generated output in sync)
- `python3 scripts/check.py` — 2 tests OK
- `python3 verification/check_release.py .` — 32 HTML pages, 0 findings
- `python3 -m unittest discover -s verification` — 5 tests OK
- `python3 -m unittest scripts.test_affiliate_pipeline` — 6 tests OK
- `python3 scripts/affiliate_pipeline.py audit-repo` — OK
- `python3 scripts/affiliate_pipeline.py validate-ledger analytics/ledger.csv` — OK

## 4. Live confirmation (2026-11-21)

- Pages API: `status=built`, source `main` `/`, public, HTTPS enforced.
- Fetched live: homepage (publication front page, 3 project cards, 3 air-fryer
  working-hypothesis guides, RSS band), `/flagged-for-review/` (7 flags with
  official-source links), `/product-register/` (4 rows, intent columns blank),
  `/measurement/` (5 events + empty ledger), `/feed.xml` (7 items).
- Live content matches the local tree at `14c9851`.

## 5. On the "AI-powered platform" brief

The automation the brief asks for exists as a deterministic, policy-gated
pipeline — `scripts/affiliate_pipeline.py` (intake/dedup, commission lookup,
Special Link construction behind hard evidence gates, compliance audit, ledger
validation) + `scripts/build.py` (site generation from `source/content.py`) +
the self-hosted analytics collector. It deliberately does **not** auto-write,
auto-rank, or auto-publish via a model service: the README states there is "no
model service auto-writing, ranking products or publishing on this release",
and the build gate fails closed on any unverified commercial link. That is the
compliant reading of the brief's own gates (one tested Special Link per product
before scaling; no conversion score or revenue forecast; disclosures and API
policy checks in the publishing workflow). No change was made to this design.

## 6. Irregularities (all already on the live Flagged for Review page)

1. Intended ASINs unconfirmed; observed ≠ intended (see §2 table).
2. Duplicate submission (`B03QDuGdo` twice) — preserved as rows 2–3.
3. Guide-title mismatch: air-fryer hypotheses have no matching submitted
   products — listed as working hypotheses, not product coverage.
4. Tracking ID `shopnow047c-20` unvalidated — no tagged link published.
5. Search Console property and production analytics not connected — no
   performance claims made.
6. Listing/manufacturer spec discrepancies (Art3d vs Amazon; ORDORA 11 in vs
   12 in) — left blank, never merged.

None block the editorial site. All block unsupported claims, affiliate
publishing, or production measurement, exactly as published.

## 7. Verdict

The release is live, compliant, and internally consistent. No site defect was
found, so no site file was edited. This report and the `COORDINATION.md`
append are the only changes on this branch.
