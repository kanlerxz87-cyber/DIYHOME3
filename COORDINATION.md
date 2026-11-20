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
