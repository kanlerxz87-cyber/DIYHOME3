# COORDINATION — DIY HOME upgrades (DIYHOME3)

Shared task board for parallel agent sessions. Read this before starting any work.
Claim a task (session ID + file scope) and commit/push the claim before editing.
A status of **needs review** means the item is published on the Flagged for Review
page (`docs/flagged.html`) and does not block anything.

- **This session:** `arena-9e34c6b6` on the mandated session branch
  `arena/9e34c6b6-diyhome3`. Per session constraints all work for this session
  stays on this branch (no `session-<id>/<task>` branch is created); scopes below
  are kept non-overlapping inside it. The final PR is opened from this branch to `main`.
- **Tracking ID (owner-supplied, not independently verified):** `shopnow047c-20`
- **Canonical site (single indexable host):** https://kanlerxz87-cyber.github.io/DIYHOME3/

## Task board

| ID | Task | Status | Owning session | Files in scope |
|---|---|---|---|---|
| T-01 | Coordination board + claim | done | arena-9e34c6b6 | `COORDINATION.md` |
| T-02 | Official-source verification (Amazon Associates, FTC, ASIN, Google sponsored, GitHub Pages) | done | arena-9e34c6b6 | `data/sources.csv`, `docs/sources.html` |
| T-03 | Product-intent confirmation record (intended vs observed, never merged) | done | arena-9e34c6b6 | `data/products.csv`, `docs/register.html` |
| T-04 | Publication front page (products first) + category subpages | done | arena-9e34c6b6 | `docs/index.html`, `docs/categories/`, `docs/assets/` |
| T-05 | Question-shaped guides + publishing cadence | done | arena-9e34c6b6 | `docs/guides/`, `docs/guides.html` |
| T-06 | Measurement: 5 events, privacy-preserving outbound-click counter, self-hosted endpoint stub | done | arena-9e34c6b6 | `docs/assets/app.js`, `docs/analytics.html`, `analytics/` |
| T-07 | Campaign ledger (empty, well-defined) + automation/gate scripts | done | arena-9e34c6b6 | `data/campaign-ledger.csv`, `scripts/`, `docs/ledger.html` |
| T-08 | Flagged for Review page + executive summary | done | arena-9e34c6b6 | `docs/flagged.html`, `docs/executive-summary.html`, `EXECUTIVE_SUMMARY.md` |
| T-09 | Sitemap, RSS feed, robots, SEO/canonical, link & disclosure checks | done | arena-9e34c6b6 | `docs/sitemap.xml`, `docs/feed.xml`, `docs/robots.txt`, `scripts/check_site.py` |
| T-10 | Final integration: re-verify combined data, build check, PR to `main`, merge, Pages deploy | in progress | arena-9e34c6b6 (final integration) | repo-wide (integration only) |

Requests to change a file owned by another session: log the request here instead
of editing that file. No such requests at claim time.

## Log

- 2026-11-20 — Session `arena-9e34c6b6` claimed T-01…T-09 on branch
  `arena/9e34c6b6-diyhome3`. Repo at claim time contained only `README.md`
  (`# DIYHOME3`, commit `5456d41`). No prior COORDINATION.md existed.
- 2026-11-20 — Submitted-link observation (fetch following redirects, this date):
  the three unique supplied `link.amazon/<token>` URLs resolved at observation
  time to `amazon.com/dp/…` pages recorded **only** in the observed-redirect
  fields of `data/products.csv`. Intended-ASIN fields were deliberately left
  blank (see Flagged F-01/F-02). No merge of intended and observed fields.
- 2026-11-20 — T-02…T-09 completed by `arena-9e34c6b6`. Sources used (all
  official, full register in `data/sources.csv`): Amazon Associates Operating
  Agreement + Program Policies (S-01/S-02), FTC Endorsement Guides FAQ + .com
  Disclosures (S-03/S-04), Amazon Developer ASIN definition — 10 characters
  (S-05), Google `rel="sponsored"` guidance (S-06), GitHub Pages / sitemap
  docs (S-07/S-08), observed Amazon listings S-09…S-11 (2026-11-20).
- 2026-11-20 — Verification performed: `scripts/validate_register.py` OK
  (3 records, intended/observed separation preserved); `scripts/check_site.py`
  OK (19 pages: disclosure strip + footer on every page, every Amazon outbound
  link `rel="sponsored"`, canonical + RSS on the single host, no broken
  internal links, no price/rating published); feed/sitemap XML parse OK;
  local HTTP smoke test 200 for all key pages and assets.
- 2026-11-20 — Irregularities flagged **needs review** (non-blocking, published
  on `docs/flagged.html`): F-01 9-character submitted tokens vs 10-character
  ASIN definition; F-02 intended product unconfirmed, observed redirect kept
  separate; F-03 `B03QDuGdo` submitted twice (deduplicated, count kept);
  F-04 short-link compliance unresolved — expressly **not** claimed invalid;
  F-05 tracking ID `shopnow047c-20` unverified without Associates Central
  access, so zero Special Links published; F-06 prices/ratings left blank;
  F-07 suggested air-fryer guide titles vs DIY product set (published as
  question checklists only); F-08 Search Console / API / hosted endpoint need
  owner accounts — ledger stays empty, no trend/commission/conversion claims;
  F-09 no product images republished (Program Content).
- 2026-11-20 — T-10 final integration claimed by `arena-9e34c6b6`: re-verify
  combined data, PR from `arena/9e34c6b6-diyhome3` to `main`, merge, confirm
  GitHub Pages deploy, record PR link + merge result below.
