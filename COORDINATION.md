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
| First baseline claim observed on origin; a separate baseline was merged in PR #1 | done | arena/abb75595-diyhome3 | See the owner's branch board; do not merge a competing baseline over PR #1 |
| Independent release verification and operational evidence | done | arena/6585a493-diyhome3 | verification/ only (shared board updates for coordination) |

- 2026-11-20: Found the active baseline claim on `arena/abb75595-diyhome3`; this session will not edit its site, data, analytics, or workflow files. Request for integration: consume the independent checks and report in `verification/` after the baseline is ready.
- 2026-11-20: Independent redirect checks reached official Amazon listings B08FKW9JRM, B0BSKQW2T2 (duplicate input), and B08DY9HRWD. See `verification/evidence.md` for linked evidence and distinct unconfirmed intent/attribution fields. These observations must not enable affiliate CTAs.
- 2026-11-20: Rebase on `main` after [PR #1](https://github.com/kanlerxz87-cyber/DIYHOME3/pull/1) produced an add/add board conflict. Preserved the complete merged board, then appended this session's handoff and verification entries; no site files edited. [Pages run](https://github.com/kanlerxz87-cyber/DIYHOME3/actions/runs/44684752829) succeeded for `8f58e1dc`; independent fetches confirmed the home, flagged page, RSS and sitemap were public.
- 2026-11-20: Independent scope complete: checker fixture tests passed (5), with 56 findings against the 17-page merged baseline. See `verification/baseline-release.md` and [the PR #1 handoff](https://github.com/kanlerxz87-cyber/DIYHOME3/pull/1#issuecomment-7031835862). **Request to owning session:** correct enabled unvalidated tagged CTAs, unconfirmed intended identifiers, public price/rating snapshots, product-anchor markup and feed autodiscovery in the existing baseline; log account-only gates on Flagged for Review. Do not treat this evidence report as approval to release affiliate offers.
- 2026-11-20: Rebase over the [publish-record follow-up](https://github.com/kanlerxz87-cyber/DIYHOME3/pull/3) conflicted in the shared board. Preserved the owner's publish record and kept this review in its own section.

## Follow-up integration — `arena/abb75595-diyhome3`

- This branch recorded its baseline claim before the independent baseline appeared on `main`. On rebase, preserved the merged coordination board and verification handoff. The active task is the follow-up compliance remediation, not a second parallel deployment. It addresses the findings in `verification/baseline-release.md`, retains historical public routes and the existing Pages deployment, and leaves `verification/` intact.
- 2026-11-20: Read the README baseline and confirmed existing public Pages root deployment from `main`. Checked all three unique supplied URLs against Amazon; observed `B08FKW9JRM`, `B0BSKQW2T2` (twice submitted), `B08DY9HRWD`, normalized to final listing paths. No intent, Special Link compliance, price, reviews or reporting values inferred. These observations do not match the separate air-fryer editorial hypotheses.
- 2026-11-20: Verified Amazon Associates Agreement, Policies, disclosure guidance and Amazon help glossary; FTC Endorsement Guides FAQ; GitHub Pages limits; Google sitemap/outbound-link/Search Console docs; USDA FSIS guidance; Instant Pot and Art3d manufacturer pages. Official links are in `source/content.py` and the site's Source library. Non-blocking flags: enrollment, intent, attribution, commercial host, authorized product/search/report data and persistent analytics.
- 2026-11-20: Built editorial routes, feed, sitemap and aggregate collector. Local verification passed for generated output, internal paths/fragments, affiliate gating and all five event types. Production analytics and commercial publishing are off on Pages.
- 2026-11-20: Second rebase conflict touched shared output files as well as the board. Preserved original deployment configuration and independent evidence; reconciled the two layouts into one publication with legacy routes retained and former commerce values withdrawn. The previous publish record remains historical, not approval for launch.
- 2026-11-20: Follow-up remediation completed on the integration branch. Preserved published `/products/`, `/verify/`, and legacy guide URLs as disclosure-bearing handoffs to the corresponding current pages. Replaced stale product JSON with the four-row observations register, retired the prototype analytics contract, and retained the independent verification suite. The suite passed against 32 rendered pages with zero findings and all five fixture tests; build, link and aggregate endpoint tests also passed. No competing PR contents were merged into this task.

## Final integration completed — session `arena-9e34c6b6` (PR #5)

- 2026-11-20: After this session's PR #5 was opened, `main` advanced again
  (PR #6, session `abb75595`) with a remediated root publication that retains
  the existing Pages routes. Merging it produced modify/delete + add/add
  conflicts. Resolution, as final integration: **the remediated root site is
  the single live publication** (one indexable site); this session's competing
  `docs/` rendering was retired (its register data and validation survive in
  `data/products.csv`, `data/sources.csv`, `scripts/validate_register.py`,
  `analytics/worker.js`). All prior boards and the `verification/` evidence
  were preserved verbatim above; no other session's evidence was edited.
- Verification on the combined tree: `scripts/check.py` (rendered routes,
  disclosure ×2 per page, XML, event gate), `scripts/validate_register.py`,
  and `verification/test_check_release.py` — results recorded in PR #5.
- PR: https://github.com/kanlerxz87-cyber/DIYHOME3/pull/5 (merge + Pages
  deploy confirmation appended after completion).
### Follow-up publication record — done

- [PR #6](https://github.com/kanlerxz87-cyber/DIYHOME3/pull/6) merged to `main` at `406cbcca2835d1340e642a7702177fbe1e410c3e` on 2026-11-20 at 06:04:58 UTC. Required publication verification passed before the merge.
- The [GitHub Pages run](https://github.com/kanlerxz87-cyber/DIYHOME3/actions/runs/44685284495) succeeded and the [Pages build record](https://api.github.com/repos/kanlerxz87-cyber/DIYHOME3/pages/builds/1386229284) reports `built` for that exact commit. Independently fetched the updated [front page](https://kanlerxz87-cyber.github.io/DIYHOME3/), [Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged-for-review/), [RSS](https://kanlerxz87-cyber.github.io/DIYHOME3/feed.xml) and [sitemap](https://kanlerxz87-cyber.github.io/DIYHOME3/sitemap.xml) from the public host.
- **Needs review, not published as verified:** product intent, enrolled tracking/report attribution, Search Console ownership, and an approved persistent host for commerce and analytics. No production orders, commission forecasts or query rankings were asserted.
- **PR #5 publish record (session `arena-9e34c6b6`):** PR https://github.com/kanlerxz87-cyber/DIYHOME3/pull/5 MERGED 2026-11-20T06:07:06Z (merge commit `212bc0868e09b70dc5c702f684d8d18ec4e2430b`). Post-merge runs for that commit: Verify publication success; Deploy GitHub Pages success; Pages API status `built` (https://kanlerxz87-cyber.github.io/DIYHOME3/). Live product register independently fetched post-merge: intended ASIN/listing/date/source blank, observed targets separate — as gated. T-10: done.

## Reconciled release audit — session `arena-e10111d6`

| Task | Status | Owner | File scope |
|---|---|---|---|
| Independent post-integration evidence / browser / release verification | done | arena-e10111d6 | `release_checks/e10111d6/`, dedicated `.github/workflows/release-audit.yml`; append-only coordination updates; ignore session-local tooling |

- 2026-11-20: This session began from the empty initial commit at 05:58 UTC and pushed its claim before discovering any other board. A fresh `origin/main` fetch later revealed PRs #1/#5/#6/#7/#9 and the already integrated root publication. The separately built 24-page prototype is **retired**, not published, and not an alternate site. Its synthetic test data never entered the campaign ledger.
- 2026-11-20: Rebase attempt stopped on an add/add board conflict; aborted it without changing shared content. Merged `origin/main` into the fixed Arena branch instead to retain pushed history. Conflicts in README, generator, Pages workflow, ignore file and board resolved by retaining the integrated main version; only ignore rules for this session's private tooling were appended. All existing root pages, legacy routes, `source/`, `analytics/`, data, and independent `verification/` are preserved. No shared publication output will be overwritten.
- 2026-11-20: Updated scope to `release_checks/e10111d6/` for an independent audit. PR #8 will carry only this audit and coordination/ignore updates relative to main, not a competing baseline. The initial prototype's 25 passing tests apply only to that retired prototype; the integrated release is being verified separately. GitHub Pages configuration update returned HTTP 403 for the integration token, so the existing successful Pages workflow/configuration remains unchanged.
- 2026-11-20: A subsequent plain `git pull --rebase` attempted to flatten the integration merge and hit the older board claim. Aborted without retaining that conflict; `git pull --rebase=merges` preserved the complete integration and pushed normally (no force push). Remote main's shared source/output files remain unchanged.
- 2026-11-20: Integrated-release verification completed: `build.py --check`, 2 integrated site/collector tests, 3 CSV register records, 5 existing independent checker fixtures, 32-page independent audit with zero findings, and 5 added official-table-source checker fixtures. Chromium desktop/mobile checks passed across all 32 routes (navigation, native keyboard desk, disclosure above mobile fold, no page overflow, loaded images, no JS exceptions). Full scope/official source rechecks are in `release_checks/e10111d6/README.md`. Public front/register/flags independently fetched; open account/hosting gates match the existing public flags. No novel unresolved item was introduced.

- 2026-11-20: Claimed the non-overlapping new workflow `.github/workflows/release-audit.yml` to run this session’s isolated checks/fixtures on pushes and PRs; existing workflows remain untouched. Audit scope is complete. PR #8: https://github.com/kanlerxz87-cyber/DIYHOME3/pull/8. Merge/deployment result will be appended after success.

### PR #8 publish record — complete

- PR https://github.com/kanlerxz87-cyber/DIYHOME3/pull/8 **MERGED** on 2026-11-20 at 06:12:10 UTC; merge commit `7822a857353061653aae4fd3002d0f5d8c0c315a`.
- PR CI checks `verify` and `evidence-boundaries` passed before the explicit merge. Post-merge Verify publication, Independent source and identity audit, Deploy GitHub Pages, and the native Pages build/deploy all succeeded for that exact merge commit.
- [Pages deployment run](https://github.com/kanlerxz87-cyber/DIYHOME3/actions/runs/44686137585) succeeded. Pages build API reports `built`, exact commit above, no error, updated 2026-11-20T06:12:26Z. Canonical public URL: https://kanlerxz87-cyber.github.io/DIYHOME3/.
- Public front page, Flagged for Review, product register, and sitemap fetched successfully. Initial feed fetch returned an older cached version; a release-query cache-busted fetch (`feed.xml?release=7822a8573530`) confirmed all **seven current guide entries** with disclosure text. No stale feed conclusion was accepted without rechecking.
- Final release remains editorial-only. Account confirmation, paid-link activation, approved business hosting, real authorized reports, Search Console ownership, live model/product data and persistent production analytics are not claimed complete. All existing public gates remain in place; this audit did not replace the site or activate commerce.

## Post-integration audit & affiliate platform automation — session `8af71978` (`arena/8af71978-diyhome3`)

| ID | Task | Status | Owner | Files touched |
|---|---|---|---|---|
| T11 | Reconcile analytics docs & Worker stub with live 5-event schema (remove retired `docs/*` dead paths) | done | `8af71978` | `analytics/README.md`, `analytics/worker.js` |
| T12 | Source-register & Flagged-for-Review line-by-line audit (fix `data/sources.csv` `S-07` root-Pages path; record verified manufacturer/listing spec contradictions & official commission schedule; align working-title guide hypotheses) | done | `8af71978` | `data/sources.csv`, `source/content.py`, `scripts/build.py`, rendered HTML/XML outputs |
| T13 | Affiliate automation & compliance-gate pipeline CLI + unit tests + dedicated CI workflow (`verification/` and `release_checks/` untouched) | done | `8af71978` | `scripts/affiliate_pipeline.py`, `scripts/test_affiliate_pipeline.py`, `scripts/README.md`, `.github/workflows/affiliate-pipeline.yml` |
| T14 | Full verification, PR to `main`, merge, live GitHub Pages check, and publish log | done | `8af71978` | `COORDINATION.md` |

- 2026-11-20: Merged `origin/main` (`6f32ff3`) into `arena/8af71978-diyhome3`, preserving all prior session boards, `verification/`, and `release_checks/e10111d6/` verbatim.
- 2026-11-20: Remediated post-merge drift in `analytics/README.md` and `analytics/worker.js` (removed non-existent `docs/analytics.html`, `docs/assets/app.js`, `scripts/check_site.py`, `data/campaign-ledger.csv`, and retired event names; aligned Worker stub to `page_view`, `guide_view`, `outbound_click`, `feed_click`, bearer-gated `reported_order`, `ANALYTICS_ORIGIN`, and `analytics/targets.json`) and corrected `data/sources.csv` `S-07` (`/` root Pages deployment).
- 2026-11-20: Added verified official references `S15` ([Amazon Standard Commission Income Rates](https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ): `Kitchen 4.50%`, `Tools / Home / Home Improvement 3.00%`) and `S16` ([Amazon Creators API documentation](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction): enrollment + ≥10 qualifying sales in 30 days prerequisite), documented cross-source manufacturer/listing discrepancies (`art3d.com` `A17999` vs `amazon.com/dp/B08FKW9JRM`; `B08DY9HRWD` `11"` vs `12"` + `B0BYYTQMTR`; `B0BSKQW2T2` omitted fields) on Flagged for Review, aligned the 4 countertop-appliance buyer-question working-title hypotheses, and shipped `scripts/affiliate_pipeline.py` + 6 unit tests + `.github/workflows/affiliate-pipeline.yml`. All 9 repository check/test suites passed locally (`0` findings).
- **PR #11 publish record (session `8af71978`):** PR https://github.com/kanlerxz87-cyber/DIYHOME3/pull/11 **MERGED** 2026-11-20T06:28:14Z (merge commit `1d3af276ba30e1970c2b8b62e723593c010b2ef0`). All PR & post-merge CI workflows (`Verify publication`, `Independent source and identity audit`, `Affiliate compliance pipeline`, `Deploy GitHub Pages`, `pages-build-deployment`) succeeded; GitHub Pages build `1386275271` reported `built` for commit `1d3af276ba30e1970c2b8b62e723593c010b2ef0` (`error: null`). Independently fetched live front page, Flagged for Review, and RSS feed (`https://kanlerxz87-cyber.github.io/DIYHOME3/`). T14: done.

## Retired baseline & independent audit — session `f5df06de` (`arena/f5df06de-diyhome3`)

| ID | Task | Status | Owner | File scope |
|---|---|---|---|---|
| T15 | Independent compliance audit of the integrated publication (read-only, 24 checks) | done | `f5df06de` | `release_checks/f5df06de/tools/audit.mjs` |
| T16 | Retire this session's competing 46-page baseline out of the published tree | done | `f5df06de` | `release_checks/f5df06de/` only |
| T17 | Tested first-party analytics collector offered as an alternative (not wired in) | needs review | `f5df06de` | `release_checks/f5df06de/collector/` |
| T18 | Three flags absent from the published Flagged for Review page | needs review | `f5df06de` | `release_checks/f5df06de/README.md` |

**Scope: `release_checks/f5df06de/` only.** No file outside it was modified, apart
from this append-only board entry. `verification/` and `release_checks/e10111d6/`
were not touched.

### What happened, and the conflict

- 2026-11-20: This session branched from the empty initial commit `5456d41` and,
  finding no board and no other branch, built a complete 46-page publication —
  product register, 11 question-shaped guides, 3 clusters, 16 dashboard surfaces, a
  223-check compliance gate, an analytics collector and a 23-item flag register.
- 2026-11-20: Fetched `origin/main` to open a PR and found the integrated,
  **deployed** 32-page publication built by five earlier sessions (PRs #1, #5, #6,
  #8, #10, #11, #12; T01–T14 done; Pages `built` against specific merge commits).
- 2026-11-20: **Merge conflict, resolved as instructed — stop, do not discard
  others' work, log it.** 14 paths collided add/add: `index.html`, `products/**`,
  `guides/index.html`, `sitemap.xml`, `feed.xml`, `robots.txt`, `404.html`,
  `README.md`, `data/products.json`, `.github/workflows/verify.yml`, `.gitignore`,
  `COORDINATION.md`. Merged `origin/main` with **every conflict resolved in main's
  favour** (`-X theirs`), then relocated this session's entire baseline into
  `release_checks/f5df06de/` and deleted its generated pages from the published
  tree. The baseline is **retired, not published**, and is not an alternate site.
  Published page count is unchanged at **32**. No force push was used.
- This follows the board's existing precedent: session `9e34c6b6` retired a
  competing `docs/` rendering, and session `e10111d6` retired a 24-page prototype
  and contributed `release_checks/e10111d6/` instead.

### Independent audit result — 0 findings

`node release_checks/f5df06de/tools/audit.mjs` — read-only, 24 checks across the 32
published pages, exits non-zero on any finding:

```
Disclosure 3 · Links 5 · Copy 5 · Assets 2 · Rendering 2 · Findability 6 · Data 1
✓ No findings. The integrated publication satisfies every check in this gate.
```

Independently corroborated: the Operating Agreement §5 sentence is above the fold on
**all 32 pages** and repeated in every footer; all **26 product links carry
`rel="sponsored"`** (zero unmarked; 39 links marked sponsored in total, the extra 13
being browse-node citations); **no tagged affiliate CTA is published anywhere**, so
the site is editorial-only exactly as its own flags state — confirming the
remediation `release_checks/e10111d6/` requested was carried out; the §2(i) price
disclaimer appears wherever a price is shown; no Amazon imagery is hotlinked
(§2(h)); no third-party subresource or tracker; no first-person experience claim,
superlative, fabricated search-volume figure or revenue forecast; feed is RSS 2.0
with `atom:link rel="self"`, carries the disclosure, and covers every declared
guide; every internal link and anchor resolves; no missing assets.

Their own suites were re-run on the merged tree and all pass, so nothing was broken:
`scripts/build.py --check` clean · `scripts/check.py` 2 tests OK ·
`python3 -m unittest discover -s verification` 5 tests OK ·
`verification/check_release.py` **32 pages, 0 findings**.

### Six defects the audit found in *itself*

Running the gate against a site it did not generate broke it six ways. All were
confirmed against source before being reported, and all were fixed. This is the main
transferable result: **a gate only ever run against its own output cannot
distinguish "compliant" from "broken detector".**

| Reported | Actual cause | Fix |
|---|---|---|
| Doc links "missing `rel=sponsored`" | 22 citations counted as paid placements; `affiliate-program.amazon.com` is documentation and `/b?node=` is a browse node | Path-aware classification: only `/dp/`, `/gp/product/` and short-link hosts are products |
| Tagged CTAs found | Matched `?tag=` inside `scripts/affiliate_pipeline.py`, whose job is to build tagged links | Scoped to published artefacts (`.html`, `.xml`) |
| "Revenue forecast as a figure" | Page says "**do not publish** … conversion scores or revenue forecasts" | Allowlist widened to `do not publish`, `must not`, `not offered`, `not claimed` |
| Third-party subresources on `404.html` | They were absolute URLs to the site's **own** origin — which a 404 must use, being served at arbitrary depth | Same-origin URLs resolve as internal |
| `about.html` / `disclosure.html` orphaned | Linked via absolute same-origin URLs the resolver skipped | Same-origin absolute links resolve as internal |
| 10 orphan pages | All are deliberate `data-page="archive"` legacy handoffs, intentionally unlinked | Archive routes excluded, and the exclusion is counted and printed |

Every copy rule now has a **positive control** (check C5) feeding it a known
violation and failing if the detector does not fire.

### Request to the owning session (T18) — three flags not on the published page

All non-blocking; details and sources in `release_checks/f5df06de/README.md`.

1. **F-08 — Agent Terms self-audit.** IP License §4 requires an autonomous agent to
   identify itself with `Agent/[agent name]` in its user-agent string and not to
   conceal that its access is automated. Every session here, including this one,
   fetched Amazon listings through automated tooling; no board entry records whether
   that requirement was met. The register values are good-faith observations with an
   unresolved collection-method question attached, and should be re-verified by a
   human in a normal browser before use in promotional copy.
2. **F-09 — the licensing reason for having no product imagery.** §2(h) permits
   storing a *link* to a product image for at most 24 hours, then requires refresh
   via PA-API, Creators API or a Data Feed. A static Pages site cannot refresh
   anything. Worth recording as the reason, so a future session does not "improve"
   the site by adding product photos. The audit confirms none are hotlinked today.
3. **F-21 — the five events were never enumerated, and two sessions diverged.** The
   brief says "record the five defined events" without naming them. The live site
   implements `page_view`, `guide_view`, `outbound_click`, `feed_click`,
   `reported_order`. This baseline independently chose `page_view`,
   `disclosure_view`, `outbound_click`, `affiliate_click`, `reader_capture`. **Two
   disjoint sets sharing one name.** Needs an owner's decision before any collector
   goes live, since renaming later loses comparability with everything collected.

Also: this baseline's commission research **independently reproduced** the conflict
already on the board — four sources, five different numbers for the same categories,
and Amazon's *onsite* schedule (Kitchen 1.25%) differing from its standard off-site
schedule, so a rate quoted without naming its schedule is meaningless even when the
number is right.

### Offered, not imposed (T17)

`release_checks/f5df06de/collector/` is a zero-dependency Node collector with **27
passing assertions**, including on-disk privacy properties verified after a flush:
**no IP address, no user agent, no cookie or identifier, no email address, no query
string, no per-event log** — only aggregate integers survive a request. It is an
alternative to `analytics/worker.js`, is **not wired into anything**, and adopts the
live site's event names if promoted. One real bug was found and fixed while testing
it: the server destroyed the socket on an oversized body, which reached the client
as a network error instead of the intended `413`.

The retired baseline stays reproducible for checking its evidence:

```bash
cd release_checks/f5df06de && node tools/build.mjs && node tools/verify.mjs \
  && node tools/linkcheck.mjs && node collector/test.mjs
# 46 pages · 223 checks passing · 0 broken links · 27 assertions passing
```

**`build/` is gitignored and must never be published** — it is a second site at
colliding paths.

### PR #13 publish record — session `f5df06de` — complete

- **PR:** https://github.com/kanlerxz87-cyber/DIYHOME3/pull/13
- **Merge result:** MERGED 2026-11-20T06:53:53Z by `kanlerxz87-cyber`
- **Merge commit:** `90646d9048fe268471ff88326fdcefb8f3aa663a`
- **PR CI before merge:** `verify` pass · `evidence-boundaries` pass · `compliance-gate` pass
- **Post-merge workflows for that exact commit:** `Verify publication` success ·
  `Independent source and identity audit` success · `Deploy GitHub Pages` success ·
  `Affiliate compliance pipeline` success
- **Pages build record:** `status=built`, `commit=90646d9048fe268471ff88326fdcefb8f3aa663a`,
  `error=null`, updated 2026-11-20T06:54:07Z
- **Public URL:** https://kanlerxz87-cyber.github.io/DIYHOME3/
- **Live fetch:** front page and `/shop/` fetched from the public host and confirmed to
  be serving the integrated publication (`DIY Home Upgrades | Small changes, better
  spaces`), not this session's retired baseline. `/shop/` renders "Category
  illustrations, not product photos. Buying links are withheld until validated.",
  consistent with the audit's finding of zero tagged CTAs in the published tree.
- **Published page count after merge:** 32, unchanged.
- **Disclosure placement evidence chain:** verified by `tools/audit.mjs` against the
  working tree at the deployed commit — §5 sentence above the fold on all 32 pages and
  repeated in every footer. Note for accuracy: the live pages were fetched through a
  markdown extractor that does not surface the disclosure banner element, so the live
  confirmation is of deployment and content, while disclosure *placement* is evidenced
  against the exact deployed commit rather than by a live visual scrape.

T15: done · T16: done · T17: needs review · T18: needs review

No force push was used at any point. The rebase onto this session's own remote branch
used `--rebase=merges`, preserving the integration merge, as session `e10111d6`
recorded doing.

### Follow-up fix — retired build output renamed so it cannot pollute the integrated checker

Running `verification/check_release.py .` after building this session's retired
baseline reported **78 HTML pages and 316 findings** instead of 32 and 0. Cause:
that checker walks the filesystem from the repository root and skips only path parts
that start with `.` or equal `node_modules` / `verification`. This session's
`release_checks/f5df06de/build/` held 46 generated pages, so they were audited as
though published. `release_checks/e10111d6/` never triggered this because it contains
no HTML.

**CI was never affected** — `build/` was gitignored and not committed, and every
workflow passed on both merge commits. This was a local-working-tree landmine only:
anyone who followed the reproduction instructions in this session's README and then
ran the integrated checker would have seen 316 phantom findings.

**Fix, without editing a file another session owns:** the output directory is renamed
`.build/`. Because the integrated checker skips any path part beginning with `.`, the
retired pages are now invisible to it. Verified after the change:

```
verification/check_release.py .   ->  32 HTML page(s) checked; 0 finding(s)
```

and the retired baseline still reproduces cleanly from `.build/`:
46 pages · 223 checks passing · 0 broken links · 27 collector assertions passing.

**Note for future sessions:** any scope that generates HTML under `release_checks/`
should name its output directory with a leading dot, or the integrated release
checker will audit it as part of the publication.

### Correction — the `.build/` rename was an incomplete fix; output now leaves the repository

The previous entry renamed the retired baseline's output to `.build/` and reported the
integrated checker clean. That was true for `verification/check_release.py` and
**false for `scripts/check.py`**, which this session then ran and found failing:

```
FAIL: test_site — AssertionError: 3 != 2 :
      release_checks/f5df06de/.build/404.html
```

The two checkers exclude different things:

| Checker | Walk | Excludes |
|---|---|---|
| `verification/check_release.py` | filesystem from repo root | path parts starting with `.`, or `node_modules` / `verification` |
| `scripts/check.py` | `rglob("*.html")` | **only** `verification` |

Dot-prefixing therefore hid the retired pages from one checker and not the other.

**CI was green throughout**, because the directory was gitignored and never committed.
The breakage existed only in a local working tree. That combination is worth naming: a
suite that passes in CI while the local tree is broken trains people to distrust local
failures, and this session nearly shipped exactly that.

**Fix, structural rather than another naming rule:** the retired baseline now generates
nothing inside the repository. Output goes to `$TMPDIR/diyhome3-retired-baseline`
(override with `--out`), cleared before each build. `.build/` and its `.gitignore` are
removed from the tree.

Verified with the baseline **built**, every integrated checker passing:

```
scripts/check.py                              ->  Ran 2 tests, OK
verification/check_release.py                 ->  32 HTML page(s) checked; 0 finding(s)
python3 -m unittest discover -s verification  ->  OK
python3 -m unittest discover -s scripts       ->  OK
python3 -m unittest discover -s release_checks/e10111d6  ->  OK
scripts/build.py --check                      ->  clean
release_checks/f5df06de/tools/audit.mjs       ->  24 checks, 0 findings
release_checks/f5df06de/tools/verify.mjs      ->  223 checks, all passing
release_checks/f5df06de/collector/test.mjs    ->  27 assertions, 0 failed
```

**Supersedes the note in the previous entry.** The correct guidance for future sessions
is not "name your output directory with a leading dot" but: **do not generate HTML
anywhere under the repository in a non-published scope** — `scripts/check.py` will find
it regardless of dot-prefixing.

### Correction from session `f5df06de` — the commission rate WAS resolvable; F-05 was wrong

This session's flag **F-05** reported the commission rate as unresolvable from official
sources and left every rate cell blank. **That conclusion was wrong and is corrected
here.**

The Program Policies page refers the reader to "the Appendix" for Standard Commission
Income. Paging through that document reached the IP License instead, so this session
concluded no official table was reachable. In fact the standard **off-site** schedule
is published as its own help topic:

**<https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ>** — fetched
directly and successfully on 2026-11-20, all three chunks, signed out.

> Table 1 – Fixed Standard Commission Income Rates for Specific Product Categories:
> "Physical Books, **Kitchen**, Automotive | **4.50%**" · "Toys, Furniture, **Home**,
> **Home Improvement**, Lawn & Garden, Pets Products, Headphones, Beauty, Musical
> Instruments, Business & Industrial Supplies, Outdoors, **Tools**, Sports, Baby
> Products, Amazon Coins | **3.00%**" · "All Other Categories | **4.00%**"

The page states no revision date; its footer reads © 1996-2025 Amazon.com, Inc.
Recorded as source **S16** in `release_checks/f5df06de/site/data/sources.mjs`, and F-05
is downgraded from high to medium with its evidence, impact and action rewritten.

Two consequences worth recording for anyone who reads the earlier entries:

1. **A third-party figure this session dismissed was correct.** `amawp.com` claimed
   Kitchen 4.50% and Tools / Home / Home Improvement 3.00% — an exact match to the
   official table. `earnifyhub.com` claimed Kitchen 5% and Home Improvement 8%, which
   is wrong. The rule "leave it blank rather than guess" was still the right call,
   because a third-party match is not a source; but "unresolvable from official
   sources" was not, and the flag said so in terms.
2. **The per-product rate is still not filled in**, for a narrower and more precise
   reason than before. Amazon assigns commission by its own product category, which is
   not necessarily the browse node rendered on the listing. For `B08FKW9JRM`
   (Tools & Home Improvement) every candidate row is 3.00%, so that rate is effectively
   determinate. For `B0BSKQW2T2` and `B08DY9HRWD` (Home & Kitchen) the candidate rows
   disagree — Kitchen 4.50% against Home 3.00% — so those two cells stay blank until
   the assignment is read from Associates Central or an earnings report line.

**This corroborates the live publication.** Its Flagged for Review page already cites
the same URL as source `S15` with the same figures. This session reached it
independently, from a different starting assumption, and got the same answer — which is
the strongest form of confirmation available here.

Also confirmed rather than merely suspected: Amazon's **onsite** schedule (S04) lists
Kitchen at **1.25%** and Tools at **1.75%**, against **4.50%** and **3.00%** off-site.
Two official schedules exist and differ materially, so a rate quoted without naming its
schedule is meaningless even when the number is correct.

Gates re-run after the correction: `tools/verify.mjs` 223 checks all passing ·
`tools/audit.mjs` 24 checks, 0 findings · `tools/linkcheck.mjs` 0 broken links ·
`collector/test.mjs` 27 assertions passing. Integrated checkers unaffected:
`scripts/check.py` OK · `verification/check_release.py` 32 pages, 0 findings.

## Release recheck — session d47e5378

| Task | Status | Owner | Files |
|---|---|---|---|
| Independent current release and deployment recheck | done | d47e5378 | `release_checks/d47e5378/**`, `COORDINATION.md` |

- 2026-11-21: Claiming an independent verification scope; existing publication, data, and other sessions' scopes remain untouched. Findings will be recorded here and in the scoped report.

- 2026-11-21: Recheck complete; `release_checks/d47e5378/REPORT.md` records scope, source links and limitations. Local build consistency, publication checks and tests passed (32 HTML pages, zero release-check findings). GitHub reports the live baseline deploy succeeded; front page and flagged page were retrieved. Amazon's agreement and GitHub Pages limits were rechecked. Affiliate attribution, verified product intent, Search Console and live analytics remain unresolved and are already published on Flagged for Review. No listing re-verification is implied by this recheck.
- Status: done. Initial pull of this newly created branch failed because its remote ref did not yet exist; pulled `main` before the first push instead. No conflict.
- Release recheck PR: https://github.com/kanlerxz87-cyber/DIYHOME3/pull/18 — merged 2026-11-21, merge commit `577577e18838433111422c503a49af4d06266e11`; [Pages build and deployment](https://github.com/kanlerxz87-cyber/DIYHOME3/actions/runs/44961399352) succeeded. GitHub emitted a non-blocking Node.js 20 deprecation warning for its upload-artifact action.

## Independent verification — session `99686052` (`arena/99686052-diyhome3`)

| Task | Status | Owner | Files |
|---|---|---|---|
| Line-by-line verification of the live editorial release against official sources; build/link/disclosure/sponsored/feed/sitemap/analytics gates; live Pages confirmation | done | 99686052 | `release_checks/99686052/**`, `COORDINATION.md` (append only) |

- 2026-11-21: Claiming an independent verification scope on `arena/99686052-diyhome3`. Existing publication, data, scripts, and other sessions' scopes (including `release_checks/d47e5378/**` on open PR #18) remain untouched. If a site defect is found, it will be logged here as a request instead of edited directly. Findings will be recorded in `release_checks/99686052/REPORT.md`.
- 2026-11-21: Verification complete — see `release_checks/99686052/REPORT.md`. All 7 official sources re-fetched and confirmed (Operating Agreement 2025-10-15, Policies 2026-04-14, FTC Endorsement Guides FAQ, Google `rel="sponsored"`, GitHub Pages limits, Standard Commission rates Kitchen 4.50% / Tools-Home 3.00%, Creators API prerequisites). All 32 pages: disclosure above fold + footer, 0 tagged CTAs, 0 unsponsored product links, 0 published prices/ratings. Gates: `build.py --check` 0, `check.py` 2 OK, `check_release.py` 32 pages 0 findings, verification 5 OK, affiliate pipeline 6 OK, `audit-repo` OK, ledger OK. Live Pages `built` from `main`; homepage, flagged, product-register, measurement, feed fetched live and matching. No site defect found, so no site file was edited. Amazon listing observations were not re-fetched this session (prior dated observations preserved as observed-only). Irregularities unchanged and already published on Flagged for Review.

- 2026-11-21: Follow-up PR #21 conflicted with session `99686052` board additions after its PR merged. Preserved both entries in a merge of `main` into this branch; no session work discarded.
## Reader-facing storefront & final integration — session `2a2c477f` (`arena/2a2c477f-diyhome3`)

| ID | Task | Status | Owner | File scope |
|---|---|---|---|---|
| T20 | Category storefront pages, product-forward tables, dated listing re-observation, executive summary refresh, final integration + publish | done | `2a2c477f` | `source/content.py`, `scripts/build.py`, `data/products.json`, `EXECUTIVE_SUMMARY.md`, `README.md`, rendered pages (`index.html`, `shop/**`, `guides/**`, `product-register/`, `flagged-for-review/`, `executive-summary/`, `sources/`, `sitemap.xml`, `feed.xml`), `COORDINATION.md` |

- 2026-11-21: Claiming T20 on `arena/2a2c477f-diyhome3`. No overlap with open verification scopes `b0080e81` (T19) and `99686052`, which own `release_checks/<id>/**` plus append-only board text; this session will not edit `release_checks/` and those sessions will not edit rendered pages. Other branches (`c7cc15c6`) are stale and are not read or merged.
- 2026-11-21: Verified in this session from live official pages (fetch, signed out): Associates Operating Agreement (updated 2025-10-15), Program Policies (updated 2026-04-14), Standard Commission Income Statement (Kitchen 4.50%; Home/Home Improvement/Tools 3.00% — unchanged), Creators API prerequisites (enrollment + ≥10 qualifying sales in 30 days + registration + credentials), GitHub Pages limits ("not intended for or allowed... online business, e-commerce site"), GitHub sitemap documentation, USDA FSIS air-fryer guidance, Art3d A17999 product parameters, Instant Pot Vortex 6QT product page, and the three observed Amazon listings (still resolving to B08FKW9JRM, B0BSKQW2T2, B08DY9HRWD on 2026-11-21).
- 2026-11-21: One published-claim defect found and corrected: the capacity guide stated Instant Pot "lists basket dimensions separately from volume". The live product page publishes a 6-quart volume plus overall dimensions (12.36 W × 12.83 H × 14.92 L in), not usable basket dimensions. Reworded to what the page actually says and logged on Flagged for Review.

## Current session — `8229e62c` (2026-11-21)

| ID | Task | Status | Owner | Files touched |
|---|---|---|---|---|
| T19 | Acceptance audit of the current integrated site; clarify the actual automation/AI boundary in the executive summary | done | `8229e62c` | `scripts/build.py`, generated `executive-summary/index.html`, `COORDINATION.md` |

Claim was committed and pushed before work on the Arena-assigned branch `arena/8229e62c-diyhome3`. Earlier T01–T18 entries are historical completed work; no active overlapping claim was present. During `git pull --rebase origin main`, a COORDINATION-only conflict occurred because newer independent verification sessions had added reports since this branch's base. Resolved by preserving their entries and the current claim; no publication/data files conflicted.

- 2026-11-21: The executive summary now distinguishes implemented deterministic gates and the query-report shortlist planner from capabilities not present: AI research/writing, automated Amazon catalog data collection, competition/conversion optimization, and autonomous publishing. It explicitly says there is no live Amazon API/model integration or account approval in this repository. Added project source links and existing official Amazon references S03 (Program Policies/IP License) and S16 (Creators API documentation). No product records, intent, prices, or affiliate CTAs were changed.
- Verification: `scripts/build.py --check`; `scripts/check.py`; `scripts/validate_register.py`; `scripts/affiliate_pipeline.py audit-repo`; `verification/check_release.py` (32 HTML pages, 0 findings); unit suites under `scripts/`, `verification/`, and `release_checks/e10111d6/` all passed. The independent `release_checks/d47e5378/REPORT.md` records a successful live Pages baseline check but explicitly does not re-verify listings or private account state.
- Source boundary: the Amazon policy/API statements rely on the dated official-source checks already recorded for S03/S16 in this board and `data/sources.csv` (2026-11-20); this session did not re-fetch those Amazon pages or independently re-verify product listings.
- Irregularities remain flagged: intended ASINs and Special Link attribution are unconfirmed; the supplied short links' compliance remains unresolved (not declared invalid); Search Console and production analytics are not connected. See the live Flagged for Review page.

## T21 · Publish the three unshipped flags (F-08, F-09, F-21) — session `7a3ef993`

| ID | Task | Status | Owner | File scope |
|---|---|---|---|---|
| T21 | Ship F-08, F-09 and F-21 on the published Flagged for Review page (closes the T18 request from session `f5df06de`), record the F-21 event-name decision and the T17 disposition, and add regression tests so the flags cannot silently disappear | in progress | `7a3ef993` | `source/content.py`, regenerated publication output (`flagged-for-review/index.html` and any other page `scripts/build.py` emits), `scripts/check.py`, `COORDINATION.md` (append-only) |

- 2026-11-21: Claim made and pushed before any edit. Branched from `14c9851`, fast-forwarded to `origin/main` `577577e` (PR #18) before starting.
- **Scope boundaries:** `release_checks/**` and `verification/**` are not touched. Sessions `b0080e81` (PR #19) and `99686052` (PR #20) both hold `release_checks/<id>/REPORT.md` + `COORDINATION.md`; there is no file overlap, so no request to another owner is needed. Board entries are append-only.
- Pre-edit local verification (all before touching a file):
  - `flagged-for-review/index.html` and `verify/flagged.html` each contain **0** occurrences of `F-08`, `F-09`, `F-21` — the published flag table has exactly **7** rows (`Intended products`, `Special Links`, `Commercial hosting`, `Price, reviews and commission`, `Listing & manufacturer discrepancies`, `SG-29 · Search Console`, `Production analytics`). T18's premise confirmed.
  - F-09's factual premise confirmed: every `<img src>` in the published tree resolves to local `assets/` (or this site's own origin on `404.html`). **No** Amazon-hosted image is embedded or hotlinked. The `amazon.com` URLs present are text citations (`/dp/`, `/b?node=`, `affiliate-program.amazon.com` docs).
  - F-21 confirmed and **corrected**: live set from `analytics/server.py:11` and `analytics/targets.json` is `{page_view, guide_view, outbound_click, feed_click, reported_order}`; retired baseline `release_checks/f5df06de/site/pages/dashboard.mjs:19-26` is `{page_view, disclosure_view, outbound_click, affiliate_click, reader_capture}`. The intersection is **two** names (`page_view`, `outbound_click`), not one. The board's F-21 wording ("two disjoint sets sharing only one name") overstates the divergence and is corrected below.
  - F-08's premise confirmed: no repository code sets a User-Agent for the Amazon fetches, and no board entry resolves the Agent Terms question.
- **Session limitation, stated up front:** this sandbox has outbound network access to `github.com`, `api.github.com`, `registry.npmjs.org` and `pypi.org` only. `curl` to `affiliate-program.amazon.com`, `www.amazon.com` and `kanlerxz87-cyber.github.io` returned `000` (no connection). This session therefore **did not re-verify any Amazon or FTC page** and makes no new claim about any external value. The flags added cite sources already in the register (`S03`) as fetched and recorded by earlier sessions; the publication of F-08/F-09/F-21 rests on locally verifiable repository facts plus those pre-existing citations.
- 2026-11-21: Merge of `main` (PR #22, session `8229e62c`) into `arena/2a2c477f-diyhome3`: kept both the automation-scope rows and the T20 storefront rows in the executive summary, and kept both board sections. No other session's work discarded.
- Publish record: [PR #22](https://github.com/kanlerxz87-cyber/DIYHOME3/pull/22) merged 2026-11-21T23:24:50Z as `8c6035c1205e0713836051cfff99fa2d4bce26c2`. PR checks `verify`, `evidence-boundaries`, and `compliance-gate` passed. [GitHub Pages deploy](https://github.com/kanlerxz87-cyber/DIYHOME3/actions/runs/44961675512) succeeded; Pages API reports `built` for the merge commit. Live executive summary was re-fetched with a cache-busting query and showed the new automation boundary rows.
- 2026-11-21: The publish-record follow-up PR conflicted with concurrent T20 storefront changes in `COORDINATION.md`; preserved both this publish record and the integration session's board updates.
## Fresh line-by-line re-verification — session `b0080e81` (`arena/b0080e81-diyhome3`)

| ID | Task | Status | Owner | File scope |
|---|---|---|---|---|
| T19 | Re-verify all official sources, live Pages site, and local check suites on 2026-11-21; record dated report | done | `b0080e81` | `release_checks/b0080e81/` + this append-only board entry |

- 2026-11-21: Claimed T19. Scope is non-overlapping with PR #18 (`arena/d47e5378-diyhome3`, files `COORDINATION.md` + `release_checks/d47e5378/REPORT.md`): this session writes only `release_checks/b0080e81/` and appends to this board. No published page, `source/`, `data/`, `scripts/`, `verification/`, or other session's `release_checks/` scope will be edited. If a defect is found in a published file, it will be logged here as a request for the integration session rather than edited directly.

- 2026-11-21 (session `b0080e81`): T19 done. Re-fetched S01 (§5 verbatim disclosure + §1 Special Links; Agreement updated 2025-10-15), S02 (Policies updated 2026-04-14), S03 (FTC FAQ live), S07 (Pages not for commercial transactions — editorial-only stance correct), S15 (Kitchen 4.50%, Home/Home Improvement/Tools 3.00%), S16 (Creators API: enrollment + ≥10 qualifying sales/30 days). Live front page + sitemap (10 URLs) match repo; Pages API `built` on `main`. All local suites pass: build --check clean, check.py 2 OK, scripts 6 OK, validate_register OK, verification 32 pages 0 findings + 5 OK, e10111d6 5 OK, f5df06de verify/audit/linkcheck/collector all pass. Product intent fields remain blank/UNVERIFIED (9-char tokens ≠ 10-char ASINs); observed fields kept separate; `SPECIAL_LINKS` empty. `link.amazon` not re-observed (sandbox host allowlist) — 2026-11-20 observations stand, labelled. No published-file defect found; no integration request. Full report: `release_checks/b0080e81/REPORT.md`.

### T20 publish record — session `2a2c477f` — complete

- **PR:** https://github.com/kanlerxz87-cyber/DIYHOME3/pull/24 — MERGED 2026-11-21T23:26:14Z, merge commit `fd130caca7060483d84bfe6ece8c42f23a74ac1e`.
- **PR CI before merge:** `verify` pass · `compliance-gate` pass · `evidence-boundaries` pass.
- **Rebase/merge notes:** the claim and the storefront commit each hit a `COORDINATION.md` conflict (PR #18/#21 board additions, then PR #22's ledger). Both were resolved by keeping every session's text; the executive summary keeps PR #22's Automation and AI/Amazon rows alongside T20's Reader-shop row and four-link table. No other session's work was discarded. The branch was force-pushed once with `--force-with-lease` after rebasing its own unmerged history.
- **Pages:** build for `ec124f69416132480f51c64b11905b855c4a2293` reached status `built`; latest-build API confirms the commit. Live pages re-fetched with a cache-busting query and confirmed:
  - `/shop/` shows the three category cards and the at-a-glance table with `Withheld pending validation` in every Buying-link cell.
  - `/shop/storage-shelving/` shows the item, `B08DY9HRWD`, `2026-11-21`, the guide and the source.
  - `/executive-summary/` shows the Reader shop, Automation and AI/Amazon rows plus the four-submitted-links table.
  - `/flagged-for-review/` carries the correction, listing-drift, F-08, F-09 and F-21 rows.
  - `/sitemap.xml` lists 13 URLs including the three new category pages (a cached copy served 10; requesting the same URL with a query string returned 13, so this was CDN caching, not a missing entry).
- **Checks at merge:** `build.py --check` clean · `check.py` 2 OK · `check_release.py` 35 pages / 0 findings · verification 5 OK · `validate_register.py` OK · `audit-repo` OK · pipeline tests OK · `release_checks/e10111d6/check.py` PASS on 35 pages.
- **Verification performed this session:** all three observed listings fetched (same ASINs, same items); Operating Agreement, Program Policies, Standard Commission Income Statement, Creators API prerequisites, GitHub Pages limits, USDA FSIS, Instant Pot Vortex 6QT and Art3d A17999 re-read and quoted. One published claim was wrong and is corrected.
- **Not verified, and flagged instead:** Associates enrollment, the tag's ownership/attribution, Special Link destination and report, Search Console ownership, any production analytics, and any price/rating/stock value.
- T20: done.
## Independent verification — session `320a4dc7` (`arena/320a4dc7-diyhome3`)

| Task | Status | Owner | Files |
|---|---|---|---|
| Line-by-line re-verification of the live release against official sources; re-fetch the three submitted short links and observed listings; local gates; one factual correction | done | `320a4dc7` | `release_checks/320a4dc7/**`, `source/content.py`, generated `guides/air-fryer-capacity/index.html`, `COORDINATION.md` (append only) |

- 2026-11-21: Claimed this scope on `arena/320a4dc7-diyhome3`, rebased onto `main` at `8c6035c` (PR #22). Earlier T01–T19 entries are historical completed work; no active overlapping claim was present. Other sessions' scopes (`release_checks/d47e5378/**`, `release_checks/99686052/**`, `release_checks/e10111d6/**`, `release_checks/f5df06de/**`) were not edited.
- 2026-11-21: Re-fetched all three submitted short links and followed them to their final `amazon.com/dp/` pages. `B0hmGG4m2` → `B08FKW9JRM` (Art3d smoothing tool kit), `B03QDuGdo` → `B0BSKQW2T2` (paper towel holder), `B0hpD2JGQ` → `B08DY9HRWD` (ORDORA cookware rack). Titles and browse-node paths match the register; no redirect drift from 2026-11-20. Observed-only price snapshots: `$5.08`, `$6.79`, `$17.74` (not published).
- 2026-11-21: Rechecked 13 official sources (Operating Agreement §5 exact sentence and 2025-10-15 update; Program Policies 2026-04-14 and 24h/89-day terms; link-level disclosure help topic; FTC Endorsement Guides; Google `rel="sponsored"`; GitHub Pages limits; Standard Commission rates Kitchen 4.50% / Tools-Home 3.00%; Creators API prerequisites; sitemap/Search Console; USDA FSIS air-fryer guidance; Instant Pot Vortex 6QT; Art3d A17999; GitHub privacy statement). No cited source was unreachable and no site claim contradicted its source, except the one corrected below.
- 2026-11-21: **Correction.** `guides/air-fryer-capacity/` said Instant Pot “lists basket dimensions separately from volume”. The cited Vortex 6QT page lists the 6-quart volume and the unit’s overall dimensions, not basket dimensions. Corrected in `source/content.py` to “lists the 6-quart volume separately from the unit’s overall dimensions” and regenerated the guide page. No product record, intent field, price, rating, affiliate link or workflow changed.
- Gates on the corrected tree: `scripts/build.py --check` clean; `scripts/check.py` 2 OK; `verification/check_release.py .` 32 pages, 0 findings; `unittest discover -s verification` 5 OK; `unittest scripts.test_affiliate_pipeline` 6 OK; `scripts/validate_register.py` 3 records OK; `scripts/affiliate_pipeline.py audit-repo` OK.
- Live: GitHub Pages API `status=built`, source `main` `/`, latest build commit `8c6035c1205e0713836051cfff99fa2d4bce26c2`; live front page and Flagged for Review fetched and matching. Full evidence in `release_checks/320a4dc7/REPORT.md`.
- Irregularities unchanged and already published on Flagged for Review: intended ASINs unconfirmed; duplicate submission; air-fryer titles are working hypotheses; tracking ID unvalidated; Search Console and production analytics not connected; listing/manufacturer spec discrepancies left blank.

### Publish record — session `320a4dc7`

- Pending.
