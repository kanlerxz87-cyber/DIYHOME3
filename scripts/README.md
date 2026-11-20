# Scripts — integrated site machinery

The live publication is rendered from `source/content.py` by the baseline
integration (`scripts/build.py`) and gated by `scripts/check.py`
(routes, anchors, XML, disclosure-on-every-page, event-gate tests):

```bash
python3 scripts/build.py     # render the root Pages site
python3 scripts/check.py     # full rendered-site + endpoint checks
python3 verification/test_check_release.py   # independent release checker fixtures
```

Supplement added by session `arena-9e34c6b6` (final integration, PR #5):

```bash
python3 scripts/validate_register.py   # data/products.csv: ASIN shape (10 chars),
                                       # duplicate counting, intended-vs-observed
                                       # separation, Special-Link gate, blank price/rating
```

Rules enforced across the integrated system:
- Intended ASIN/listing/date/source and observed redirect targets are separate
  fields and are never copied into each other.
- No Special Link is published until intent is confirmed and one link per
  product is tested in the enrolled Associates workflow (destination +
  tracking report). `SPECIAL_LINKS` in `source/content.py` stays empty until then.
- Prices/ratings stay blank in the register CSV; any value there fails validation.
- Every rendered page carries the Associates disclosure twice (strip + footer);
  `scripts/check.py` fails otherwise.

This session's earlier standalone `docs/` rendering pipeline
(`generate_pages.py` / `build_feeds.py` / `check_site.py`) was retired during
final integration so the repository publishes **one** site (the root
publication), not two competing ones. Its checks were folded into the
validation above; its gated register data lives on in `data/products.csv`
and `data/sources.csv`.
