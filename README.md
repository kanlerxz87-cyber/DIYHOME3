# DIY Home Upgrades

[Editorial site](https://kanlerxz87-cyber.github.io/DIYHOME3/) · [Executive summary](https://kanlerxz87-cyber.github.io/DIYHOME3/executive-summary/) · [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged-for-review/) · [RSS](https://kanlerxz87-cyber.github.io/DIYHOME3/feed.xml)

The public release is a static editorial publication with a browsable shop, not a live affiliate storefront. GitHub Pages prohibits sites primarily directed at facilitating commercial transactions; see [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Shop pages are organised by category (`/shop/walls-finishes/`, `/shop/kitchen-organization/`, `/shop/storage-shelving/`); each lists the item, its observed ASIN, the date that observation was rechecked, what to compare, and the buying-link status. The three category images and kitchen photo are AI-generated illustrations, not product photography. No paid product links, commercial forecasts, prices, ratings, reviews or demand rankings are published. No private account, tracking, or indexing status is inferred from public pages. The three observed listings were re-fetched on 2026-11-21 and still resolve to the same ASINs; prices and stock are still not republished.

`EXECUTIVE_SUMMARY.md` is the owner-facing summary: decision, the four submitted links, what was verified against which official page, and the open items.

## Build and verification

Python 3.10+; standard library only.

```sh
python3 scripts/build.py
python3 scripts/build.py --check
python3 scripts/check.py
python3 analytics/server.py
```

GitHub Pages is configured to publish the root of `main`. Do not build an alternate host profile into a tree that will be committed to `main`. The generated output is committed for Pages; `source/content.py` is the source of truth. The verifier checks internal links and anchors, canonical URLs, sitemap/RSS membership, disclosures, paid-link markup and the event collector. External product evidence was inspected separately; links and observations can change after review. On this project-scoped `github.io` URL, Google uses `robots.txt` at the host root (`/robots.txt`), not the project folder; use canonical tags, crawlable links and Search Console sitemap submission for project discovery.

## Publish and measure

1. Look at measured questions in the verified Search Console property every other Thursday (starting Dec 3, 2026). `scripts/plan.py --report /private/Queries.csv --start YYYY-MM-DD --end YYYY-MM-DD` prepares a shortlist ranked by **observed impressions**, not profitability. The scheduled workflow shows whether the evidence review is due; without a report it does not choose a topic. Compare like periods, keep the original report private, and do not feed raw query strings or Amazon Program Content into external AI systems. AI may help outline articles from vetted editorial questions; there is no model service auto-writing, ranking products or publishing on this release.
2. Add a reviewed guide to `GUIDES` with its own `published_on` date (ISO `YYYY-MM-DD`) and sources for each section. The generator adds it to the guide index, XML sitemap and RSS. Vet titles, disclosure and claims; never publish invented hands-on tests. New guide clusters should be added in `render()` if they change the launch taxonomy.
3. Register and verify the canonical URL-prefix property with Google, submit `sitemap.xml`, and measure impressions and clicks by query and landing page. Ownership and submission were not possible with repository access alone. Do not count impressions as eligible sessions.
4. Preserve all submitted links; populate intended ASIN, official listing URL, date and confirmation source independently of observed redirect. Generate a link in the enrolled Amazon workflow using the selected `shopnow047c-20` tag. Confirm destination and authorized report attribution with one product link before scale-up; do not make a self-purchase. Verify the Associates, FTC, API eligibility/usage, freshness and image rights requirements before any content import. Keep `SPECIAL_LINKS` empty until these checks are done. The non-Pages build gate requires matching intent records for each submission and a dated destination, report and policy sign-off for the explicit Special Link URL. The gate checks evidence structure, not account ownership or actual report content.
5. Keep the dated campaign ledger private when populated. `analytics/ledger.csv` is an empty schema with timestamp, source, report reference, channel, eligible sessions, clicks and reported orders. Only add values obtained from authorized first-party reports; do not join visits to purchases or silently substitute zero for missing data. Do not commit reports, database files, secrets or tracking exports.

## Self-hosted analytics (not deployed on Pages)

On an eligible approved host, in a **separate deployment copy** run:

```sh
python3 scripts/build.py --profile editorial --url https://YOUR-APPROVED-HOST/
ANALYTICS_ORIGIN=https://YOUR-APPROVED-HOST ANALYTICS_DB=/private/path/counts.sqlite3 python3 analytics/server.py
```

Serve through an HTTPS reverse proxy with request/access logs disabled for analytics routes, request-size limits, rate limiting and connection timeouts. Review privacy/consent rules and use appropriate controls before enabling production collection. `ANALYTICS_IMPORT_TOKEN` should be injected by the host's secret manager, never by editing committed files. `GET /healthz` is a basic liveness probe. Browser events are best-effort, not deduplicated sessions, and save only aggregate day/event/target totals. Analytics is disabled for `github.io` and not fired for DNT/GPC. Outbound links navigate directly to Amazon without an intermediary.

`POST /api/events` accepts only a known `event` and `target`. `POST /api/reports` accepts `event: reported_order`, `target` (approved product slug), UTC `day`, nonnegative integer `count`, and opaque `report_ref`, with bearer authentication. Duplicate report/day/target imports return 409; import disjoint windows only and reconcile report corrections privately before importing. The four browser events and report import are tested with synthetic data; no Amazon order is simulated or asserted publicly.
