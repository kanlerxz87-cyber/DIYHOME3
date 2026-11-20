# Analytics endpoint (self-hosted)

The site records exactly five events — `page_view`, `product_view`, `guide_view`,
`outbound_click`, `search_submit` — defined in `docs/analytics.html`.
Payload: `{event, path, product_id, ts}` only. No cookies, IPs, fingerprints or query text.

## Current state
`window.DIY_ANALYTICS_ENDPOINT` is `""` in `docs/assets/app.js`, so events are
counted in the visitor's browser (`localStorage`, key `diyhome3_event_counts_v1`)
and displayed on the Analytics page. Nothing leaves the browser.

## Going live (owner step, ~10 minutes)
1. Deploy `analytics/worker.js` as a Cloudflare Worker (or any HTTPS endpoint
   that accepts a JSON POST and appends a line). Bind a KV namespace as `EVENTS`.
2. Set `window.DIY_ANALYTICS_ENDPOINT="<worker-url>";` in `docs/assets/app.js`.
3. Re-run `python3 scripts/check_site.py`, commit, merge.

Reported orders are **not** collected here — they enter `data/campaign-ledger.csv`
only from authorised Associates reports, with a dated provenance note.
