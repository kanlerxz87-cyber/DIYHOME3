# First-party aggregate analytics & campaign ledger

The self-hosted measurement service records **five strictly scoped event types**
matching `analytics/targets.json`, `assets/analytics.js`, `analytics/server.py`,
and the live [Measurement](https://kanlerxz87-cyber.github.io/DIYHOME3/measurement/)
desk page:

1. `page_view` — browser event (`POST /api/events`, payload `{"event", "target"}`)
2. `guide_view` — browser event (`POST /api/events`, payload `{"event", "target"}`)
3. `outbound_click` — browser event on validated, `rel="sponsored"` Special Links (`POST /api/events`, payload `{"event", "target"}`)
4. `feed_click` — browser event on the RSS feed button (`POST /api/events`, payload `{"event", "target"}`)
5. `reported_order` — **server/report-only** aggregate order import (`POST /api/reports`, payload `{"event": "reported_order", "target", "day", "count", "report_ref"}`), accepted exclusively with `Authorization: Bearer <ANALYTICS_IMPORT_TOKEN>` from authorized Amazon Associates reports and never accepted from browsers.

No cookies, IP addresses, User-Agent strings, referrers, device identifiers,
email addresses, or search query strings are collected or stored.

## Public GitHub Pages state

On `kanlerxz87-cyber.github.io`, `data-analytics="on"` is omitted by
`scripts/build.py` (`--profile pages`), and `assets/analytics.js` also exits
immediately on `*.github.io` hosts or when Global Privacy Control / Do Not Track
is enabled. No browser telemetry is emitted from the public GitHub Pages site.

## Self-hosted deployment (approved non-Pages HTTPS host)

1. Build the editorial profile for your approved HTTPS origin in a separate
   deployment checkout (never commit alternate-origin output to `main`):
   ```sh
   python3 scripts/build.py --profile editorial --url https://YOUR-APPROVED-HOST/
   ```
2. Run the stdlib Python collector (`analytics/server.py`) behind an HTTPS
   reverse proxy with access logs disabled on `/api/*`:
   ```sh
   ANALYTICS_ORIGIN=https://YOUR-APPROVED-HOST \
   ANALYTICS_DB=/private/path/counts.sqlite3 \
   ANALYTICS_IMPORT_TOKEN="$SECRET_MANAGER_TOKEN" \
   python3 analytics/server.py
   ```
   Alternatively, `analytics/worker.js` provides a Cloudflare Worker stub
   enforcing the same 5-event schema, `ANALYTICS_ORIGIN` check, target-slug
   allowlist, and bearer-gated `reported_order` import contract.
3. Verify routes, disclosures, XML feeds, and collector behavior before deploy:
   ```sh
   python3 scripts/check.py
   ```

## Campaign ledger (`analytics/ledger.csv`)

`analytics/ledger.csv` ships empty (header row only:
`timestamp_utc,source_url,report_reference,channel,eligible_sessions,clicks,reported_orders`).
Populate rows privately **only** from authorized first-party reports (Amazon
Associates Central reports and verified Google Search Console exports) with a
dated provenance reference. Blank cells mean *no report loaded*, never zero, and
no conversion score or revenue forecast is computed.
