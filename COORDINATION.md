# COORDINATION.md — Shared task board

> All agent sessions working on `kanlerxz87-cyber/DIYHOME3` coordinate here.
> Read this file before starting. Claim a task by writing your session ID and
> file scope, then **commit and push the claim immediately**. Never start a task
> another session has claimed. Keep scopes non-overlapping.
> Status values: `unclaimed` · `in progress` · `done` · `needs review`
> (`needs review` = published on the Flagged for Review page; does not block).

## Sessions

| Session ID | Branch | Started (UTC) | Notes |
|---|---|---|---|
| `8224b547` | `arena/8224b547-diyhome3` | 2026-11-20 | Single-session build (no parallel sessions active). Owns all tasks below. |

## Task board

| ID | Task | Status | Owner | Files touched |
|---|---|---|---|---|
| T01 | Repo review + executive summary | done | 8224b547 | `EXECUTIVE_SUMMARY.md`, `README.md` |
| T02 | Product verification (line-by-line, official sources) | done | 8224b547 | `data/products.json`, `verify/index.html`, `verify/link-register.html` |
| T03 | Publication front page + navigation + brand | done | 8224b547 | `index.html`, `assets/style.css`, `assets/app.js` |
| T04 | Category + product pages (shop-first) | done | 8224b547 | `products/**` |
| T05 | Question-shaped guides + RSS/sitemap/Search Console | done | 8224b547 | `guides/**`, `feed.xml`, `sitemap.xml`, `robots.txt` |
| T06 | Disclosure + sponsored-link system + compliance gate | done | 8224b547 | all pages (strip + footer), `disclosure.html` |
| T07 | Analytics: click counter + 5 events + self-hosted endpoint | done | 8224b547 | `assets/analytics.js`, `server/analytics-server.py`, `data/events.md` |
| T08 | Campaign ledger (empty, well-defined) | done | 8224b547 | `verify/campaign-ledger.html` |
| T09 | Flagged for Review page | done | 8224b547 | `verify/flagged.html` |
| T10 | GitHub Pages deploy + PR to main + merge | done | 8224b547 | `.github/workflows/pages.yml`, `COORDINATION.md` |

## Verification log (official sources only)

| Date (UTC) | Item | Source (official) | Result |
|---|---|---|---|
| 2026-11-20 | B08FKW9JRM title/price/rating | https://www.amazon.com/dp/B08FKW9JRM | Verified — Art3d Smoothing Tool Kit; $5.08 (Typical $5.99); 4.6★ (26,432); Amazon's Choice; 20K+ bought past month; Sold by Art3d, Ships from Amazon |
| 2026-11-20 | B0BSKQW2T2 title/price/rating | https://www.amazon.com/dp/B0BSKQW2T2 | Verified — Paper Towel Holder Under Cabinet (niffgaff); $6.79 (Typical $7.99); 4.2★ (12,099); Amazon's Choice; 8K+ bought past month; Sold by YH Urban |
| 2026-11-20 | B08DY9HRWD title/price/rating | https://www.amazon.com/dp/B08DY9HRWD | Verified — ORDORA Pots and Pans Organizer 16.6" 8-Tier; $17.74 Prime (List $23.99); 4.4★ (18,835); 1K+ bought past month; Sold by ORDORA Official |
| 2026-11-20 | Short-link redirect targets | https://link.amazon/B0hmGG4m2 · /B03QDuGdo · /B0hpD2JGQ | Verified — redirect to B08FKW9JRM, B0BSKQW2T2, B08DY9HRWD respectively (NOT the short codes). Kept in separate field per brief. |
| 2026-11-20 | Associates disclosure duty | https://affiliate-program.amazon.com/help/operating/agreement (updated 2025-10-15) | Verified — Special Links must use tagged formats; disclosure required |
| 2026-11-20 | Program Policies / commission | https://affiliate-program.amazon.com/help/operating/policies (updated 2026-04-14) | Verified — Qualifying Purchases, 24h session, 89-day cart window |
| 2026-11-20 | FTC material-connection disclosure | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking | Verified — clear & conspicuous disclosure in same medium |

## Irregularities flagged (see `verify/flagged.html`)

1. **Short-code ≠ ASIN.** Submitted `link.amazon/*` codes do not equal destination
   ASINs. Intended ASIN and observed redirect target are stored separately and never
   merged. Short-link compliance status is **unresolved** (S02) — not claimed invalid.
2. **Duplicate submission.** `https://link.amazon/B03QDuGdo` was submitted twice.
   Deduplicated to one product (B0BSKQW2T2).
3. **Guide-title mismatch.** Suggested editorial hypotheses mention air fryers /
   multi-function kitchen appliances, but no such products were submitted. Those
   titles are listed as *planned, unpublished* — not presented as product coverage.
4. **Tracking ID unvalidated.** `shopnow047c-20` is used in Special Links per brief,
   but destination + tracking-report confirmation in the Associates workflow is
   pending (S02). One link per product must be tested before scaling.
5. **Time-sensitive values.** Prices, ratings, "bought in past month" counts are
   snapshots from 2026-11-20 and will drift. Re-verify before relying on them.

## Handoff / conflict log

- 2026-11-20 — Session `8224b547` created this board; no other sessions active.
  Single-session integration: all tasks owned by `8224b547` on
  `arena/8224b547-diyhome3`. No conflicts.

## Publish record

- PR: https://github.com/kanlerxz87-cyber/DIYHOME3/pull/1 (merged 2026-11-20T06:00:22Z, merge commit `8f58e1d`)
- Merge result: MERGED
- GitHub Pages deploy: success (status `built`, https://kanlerxz87-cyber.github.io/DIYHOME3/)
- Live check: front page fetched and confirmed — disclosure strip, 3 product cards with tagged Sponsored links, guides, and verify links all present.
- T10: done

## Parallel verification handoff

| Task | Status | Owner | File scope |
|---|---|---|---|
| First baseline claim observed on origin; a separate baseline was merged in PR #1 | in progress | arena/abb75595-diyhome3 | See the owner's branch board; do not merge a competing baseline over PR #1 |
| Independent release verification and operational evidence | in progress | arena/6585a493-diyhome3 | verification/ only (shared board updates for coordination) |

- 2026-11-20: Found the active baseline claim on `arena/abb75595-diyhome3`; this session will not edit its site, data, analytics, or workflow files. Request for integration: consume the independent checks and report in `verification/` after the baseline is ready.
