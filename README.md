# DIY HOME · The considered home

Reader-first home-upgrade publication, evidence register, and gated affiliate infrastructure.

**Canonical public site:** https://kanlerxz87-cyber.github.io/DIYHOME3/

## Executive summary · 20 November 2026

- 24 pre-rendered pages: publication front page, category edits, three product-discovery pages, seven question-shaped guides, editorial/privacy pages, and a workspace.
- Four submitted URLs preserved, including the duplicate. Three unique short links were fetched from Amazon. Their **observed** destinations concern wallpaper tools, a paper-towel holder, and a cookware organizer. These observations do **not** establish intended product identity.
- Intended ASIN, official listing URL, confirmation date, and confirmation source remain `null` in separate fields. Prices, ratings, review counts, demand, competition, commission potential, and campaign results are not invented.
- Owner-selected tracking ID: `shopnow047c-20`. Enrollment, attribution, Special Link workflow tests, and supplied short-link compliance are unconfirmed. No purchase CTA is enabled.
- Repeated affiliate disclosure, sponsored product links, one canonical origin, generated sitemap/RSS, and Article metadata are shipped. No ranking/indexing guarantee.
- A real optional Python/SQLite aggregate endpoint is implemented and tested. **The public Pages site has no connected collector.** GitHub Pages cannot run Python. No real orders, eligible sessions, Search Console queries, live model, or product API is connected.
- Deterministic, source-bound editorial briefs and an attested first-party report importer are implemented. This is **not** represented as a working autonomous AI business, trend detector, or revenue optimizer.

See [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged.html) for all unresolved items and [Official Sources](https://kanlerxz87-cyber.github.io/DIYHOME3/sources.html) for scoped research notes.

## Run and test

Python 3.11+, no third-party Python dependencies:

```sh
python scripts/build.py
python -m unittest discover -s tests -v
python -m http.server 8000 --bind 0.0.0.0 --directory dist
```

Generated `dist/` is ignored. Pages Actions builds and uploads it after tests. The repository root is not published. One data set generates all category/detail pages, sitemap, and feed. Add guides in `site/data/guides.json`; publication changes are source-reviewed in PRs. The weekly Friday Action rebuilds and checks; it does not automatically write new articles.

## Data and provenance

- `site/data/products.json`: intent fields separate from full observed redirect URL and normalized observed listing URL.
- `site/data/submissions.json`: all four original submissions, duplicate relationship explicit.
- `site/data/sources.json`: official links, retrieval date, method, and precise scope.
- `site/data/campaigns.json`: initially empty, not fake zero metrics.
- `site/data/campaign-schema.json`: timestamp, source, channel, eligible sessions, clicks, reported orders, provenance URL, import date.

Source pages were retrieved with the session's page-fetching tool on 2026-11-20, not by a bulk scraper. Dynamic Amazon data was deliberately not copied into price/review claims. No product photographs or customer-review text were republished. SVG category art is original; the kitchen hero is AI-generated and labeled on the site.

### Product-link activation gate

`validate.product_errors` is called **before** each build. If `special_link` is set, it requires confirmed intended ASIN, official URL, confirmation date/source, destination and report confirmations with provenance, and a policy-review date. It also requires the exact confirmed `/dp/ASIN` and selected tag. These structural checks are not a substitute for actually performing the enrolled workflow. Never mark booleans true to bypass unavailable evidence.

The full API/content-license policy review remains outstanding. No product API, price caching, or automated Amazon scraping is enabled. Source-link checks verify references and structure locally; they do not claim to re-fetch every external URL on each build.

### Editorial briefs

```sh
python scripts/pipeline.py briefs
```

Returns source-bound questions, required evidence, and prohibited unsupported claims. There is no model key, live model, or unattended editorial approval. Product research/ranking and campaign optimization remain gated until authorized evidence is available.

### Authorized report import

```sh
python scripts/pipeline.py import-report --file /private/report.json --authorized-first-party
python scripts/build.py
```

The input must match `campaign-schema.json`, contain timezone-aware dates and nonnegative integer counts, and have an Associates report provenance URL. The importer rejects extra fields, records a SHA-256 provenance trail, and avoids exact duplicate imports. The flag is an **operator attestation**, not cryptographic authentication of Amazon data. Do not put raw reports, credentials, personal data, or screenshots with private information in this public repository. Aggregated report publication still needs privacy review. Site table rendering supports imported records; no importer derives Amazon orders from web clicks.

## Optional analytics backend

Five implementation-defined events (the request supplied no names): `page_view`, `guide_view`, `product_view`, `outbound_click`, `feed_click`.

```sh
# Run this on a separately provisioned, persistent HTTPS backend, not GitHub Pages.
export ALLOWED_ORIGINS=https://kanlerxz87-cyber.github.io
export ANALYTICS_DB=/private/persistent/events.sqlite
export ADMIN_TOKEN='<generate a strong private token outside this repository>'
PORT=8000 python server/analytics.py

# Build the public site with the actual HTTPS ingest URL after provisioning.
ANALYTICS_ENDPOINT=https://your-collector.example/api/events python scripts/build.py
```

No backend hosting account/credentials were available; these commands document deployment rather than claim it occurred. The public CI intentionally builds with collection disabled. To connect it, configure a reviewed HTTPS endpoint in `site/data/config.json` or the build environment. Do not place `ADMIN_TOKEN` in any frontend asset or public GitHub variable.

The service implements:
- Strict allowed origins, CORS preflight, bounded JSON input, known event/page/record allowlists, a global 600-request/minute guard, DNT/GPC suppression, and 90-day pruning on writes.
- Only `day,event,page,record,count` stored in SQLite; no cookies, IPs, user agents, query strings, full referrers, email, fingerprint, or persistent identifiers.
- `POST /api/events`, `GET /api/health`, and Bearer-protected `GET /api/stats`.
- Disabled request logging. Your reverse proxy/host may still log network requests. Review its retention and privacy settings, add TLS, request timeouts, network abuse protection, backups, and service supervision before production.
- Counts are best-effort aggregate events—not unique people, eligible Amazon sessions, bot-free traffic, or orders. Cross-origin browser requests must match the configured exact origin. The origin is scheme + hostname, **not** the project path.

Local integrated preview:

```sh
BUILD_DIR=.runtime/preview ANALYTICS_ENDPOINT=/api/events python scripts/build.py
SITE_ROOT=.runtime/preview PREVIEW_SAME_ORIGIN=1 PORT=8000 python server/analytics.py
```

`PREVIEW_SAME_ORIGIN` is for preview only. Public production ingestion requires explicit `ALLOWED_ORIGINS`.

## Quality scope and limitations

Automated tests check local destination/fragment integrity, disclosure repetition, sponsored attributes, canonical URLs, JSON-LD, table source links, feed/sitemap guide inclusion, link gate failure cases, event collection/rejection/privacy behavior, and report-import validation. This is not legal advice, a security certification, a claim of independent product tests, or full account-policy compliance.

Initial editorial plan: one reviewed guide on Tuesdays; evidence/link review on Fridays. RSS ships now instead of an unconnected email form. Search Console verification, real query-based topic selection, live authorized product research, and production analytics hosting remain clearly flagged rather than simulated.
