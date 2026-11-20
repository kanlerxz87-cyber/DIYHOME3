# DIYHOME3 — DIY Home Upgrades

A small, honestly labelled Amazon Associates shop: products first, questions
before rankings, disclosures before links, and a public record of everything
that could not be verified.

- **Live site (after merge to `main`):** https://kanlerxz87-cyber.github.io/DIYHOME3/
- **Executive summary:** [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) · site version: `docs/executive-summary.html`
- **Coordination / task board:** [COORDINATION.md](COORDINATION.md)
- **Flagged for review (non-blocking):** `docs/flagged.html`
- **Tracking ID on file (owner-supplied, pending validation):** `shopnow047c-20`

## Data (machine-readable)
| File | Contents |
|---|---|
| `data/products.csv` | Product-intent confirmation record — intended ASIN/listing/date/source kept strictly separate from observed redirect targets |
| `data/sources.csv` | Official source register (S-01…S-11); every site claim traces here |
| `data/campaign-ledger.csv` | Campaign ledger — empty until an authorised Associates report exists |

## Build / verify (stdlib only, no credentials)
```bash
python3 scripts/validate_register.py
python3 scripts/generate_pages.py
python3 scripts/build_feeds.py
python3 scripts/check_site.py
python3 -m http.server 8000 --directory docs   # local preview
```

## Compliance stance
- "As an Amazon Associate I earn from qualifying purchases" — in a disclosure
  strip under the masthead on every page and repeated in every footer.
- Every outbound product link is labelled Sponsored, `rel="sponsored nofollow noopener"`.
- No Special Link is published until the owner confirms the intended ASIN/listing
  and one link per product is tested in the enrolled Associates workflow.
  The supplied short links are **not** claimed invalid — their compliance
  status is unresolved and flagged (F-04).
- No prices, ratings, trend/commission/conversion claims: if a value could not
  be confirmed from an official source, it is left blank and flagged.
