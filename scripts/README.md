# Automation & the compliance gate

Pipeline (all stdlib Python, no credentials, no scraping):

```bash
python3 scripts/validate_register.py   # register shape, ASIN format, intended≠observed, gate
python3 scripts/generate_pages.py      # docs/*.html from data/*.csv
python3 scripts/build_feeds.py         # sitemap.xml, feed.xml (RSS), robots.txt
python3 scripts/check_site.py          # disclosure, sponsored rel, canonical, broken links
```

Rules the automation enforces:
- Intended ASIN/listing/date/source and observed redirect fields are separate
  columns and are never copied into each other (`validate_register.py`).
- `special_link_url` cannot exist until intent is confirmed with date + source.
  Special Links themselves are generated only inside the enrolled Associates
  workflow (one per product, destination + tracking report tested) — never
  hand-built here.
- Prices/ratings stay blank; a figure in the HTML fails `check_site.py`.
- Every page must carry the Associates disclosure strip + footer repetition,
  a canonical on the single host, and RSS discovery; every outbound Amazon
  link must be `rel="sponsored …"` with `data-outbound="product"` so the
  `outbound_click` event can count it.

What is deliberately **not** automated: product research scores, "trending"
detection, pricing/review/competition/commission analysis, and conversion
reporting. Those require the owner's Associates / PA-API access and authorised
reports; until then the campaign ledger stays empty and no such claim is
published (see Flagged F-08 in `docs/flagged.html`).
