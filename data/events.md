# Analytics events — contract

Privacy-preserving by design: **no cookies, no fingerprinting, no PII, no IP
storage**. The client (`assets/analytics.js`) sends a JSON beacon to the
self-hosted endpoint and also keeps local counters in `localStorage` so the
site works on static hosting (GitHub Pages) with no server.

## The five events

| Event | Fired when | Payload fields |
|---|---|---|
| `page_view` | Every page load | `path`, `title`, `ts` |
| `outbound_click` | Click on a Sponsored Amazon link | `path`, `asin`, `href`, `ts` |
| `guide_read` | Guide page scrolled ≥75% and ≥30s dwell | `path`, `seconds`, `ts` |
| `newsletter_signup` | Reader-capture form submitted | `path`, `ts` (no email stored client-side) |
| `site_search` | Site search submitted | `path`, `query` (≤120 chars), `ts` |

## Endpoint contract (self-hosted)

```
POST /api/events
Content-Type: application/json
{ "event": "outbound_click", "path": "/products/...", "referrer": "",
  "ts": "2026-11-20T00:00:00Z", "data": { "asin": "B08FKW9JRM", "href": "..." } }
→ 204 No Content
```

Reference server: `server/analytics-server.py` (stdlib only, appends JSONL to
`data/events.jsonl`). Run it behind your own domain and point `ENDPOINT` in
`assets/analytics.js` at it. On GitHub Pages the beacon will 404 harmlessly —
local counters still work.

## What is NOT collected

Email addresses, names, IP addresses, user agents, cookies, or any
cross-session identifier. `newsletter_signup` records only that a signup
happened; the email itself goes to the form handler you configure (see
`about.html` reader-capture note).
