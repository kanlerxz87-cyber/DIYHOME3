# `release_checks/f5df06de/` — retired baseline and independent audit

**Session:** `arena/f5df06de-diyhome3` · **Date:** 2026-11-20 · **Status:** baseline retired, audit complete

---

## What happened

This session branched from the empty initial commit `5456d41` and, believing it was
the only session working here, built a complete 46-page publication: product
register, 11 question-shaped guides, 3 clusters, 16 dashboard surfaces, a
compliance gate, an analytics collector and a 23-item flag register.

It then fetched `origin/main` to open a pull request and found **an integrated,
deployed 32-page publication built by five earlier sessions** — PRs #1, #5, #6, #8,
#10, #11 and #12, with tasks T01–T14 marked done and a live GitHub Pages
deployment confirmed against specific merge commits.

Both builds occupied the same paths: `index.html`, `products/`, `guides/`,
`sitemap.xml`, `feed.xml`, `robots.txt`, `404.html`, `README.md`,
`data/products.json`, `.github/workflows/verify.yml` and `COORDINATION.md`.

Merging this session's baseline over that would have destroyed a deployed,
independently audited publication. The brief requires exactly one site for search
engines to index, and forbids discarding another session's work. So the baseline
was **retired, not published**.

This follows the board's own precedent, twice over:

- session `9e34c6b6` (PR #5): *"the remediated root site is the single live
  publication (one indexable site); this session's competing `docs/` rendering was
  retired"*
- session `e10111d6` (PR #8): *"The separately built 24-page prototype is retired,
  not published, and not an alternate site"* — which then contributed
  `release_checks/e10111d6/` as an independent audit instead

This directory is that same contribution: an independent audit, plus the retired
baseline kept reproducible so its evidence can be checked.

---

## What survives, and why it is worth keeping

### 1. An independent audit of the live publication — `tools/audit.mjs`

The gate this session wrote to police its own output was repointed at a site it
did not generate. **24 checks across 32 published pages: zero findings.**

```
Disclosure       3 checks   all passing
Links            5 checks   all passing
Copy             5 checks   all passing
Assets           2 checks   all passing
Rendering        2 checks   all passing
Findability      6 checks   all passing
Data             1 checks   all passing
```

Independently corroborated:

- the Operating Agreement §5 sentence appears **above the fold on all 32 pages**
  and is repeated in every footer;
- all **26 product links carry `rel="sponsored"`** — zero unmarked. 39 links in
  total are marked sponsored, the extra 13 being browse-node citations the site
  conservatively marks as well;
- **no tagged affiliate CTA is published anywhere** — the 26 product links are
  canonical untagged `/dp/` URLs, so the site is editorial-only, exactly as its own
  flags state. This confirms the remediation `release_checks/e10111d6/` requested
  was actually carried out;
- the §2(i) price disclaimer appears on every page that displays a price;
- no Amazon product imagery is hotlinked (IP License §2(h));
- no third-party subresource or tracker on any page;
- no first-person experience claim, no superlative, no fabricated search-volume
  figure, no revenue forecast presented as a figure;
- the feed is RSS 2.0 with an `atom:link rel="self"`, carries the disclosure, and
  has an item for every declared guide;
- every internal link and in-page anchor resolves; no missing assets.

Run it with `node release_checks/f5df06de/tools/audit.mjs`. It is **read-only** and
exits non-zero on a finding, so it is safe to wire into CI. It excludes this
directory from its own scan.

### 2. Six defects the audit found in *itself*

This is the more useful result. Running the gate against a differently-structured
site broke it in six ways, all confirmed against source before being reported:

| Reported finding | Actual cause | Fix |
| --- | --- | --- |
| `affiliate-program.amazon.com` and `/b?node=` links "missing `rel=sponsored`" | Host list was too broad, so 22 **citations** were counted as paid placements. `affiliate-program.amazon.com` is documentation and `/b?node=` is a browse node; marking either sponsored would misdescribe it to Google | Classification is now path-aware: only `/dp/`, `/gp/product/` and short-link hosts count as product links. 26 product, 22 documentation, correctly separated |
| Tagged CTAs found | Matched `?tag=` inside `scripts/affiliate_pipeline.py`, tooling whose *job* is to construct tagged links | Scoped to published artefacts (`.html`, `.xml`) only |
| "Revenue forecast presented as a figure" | The page says "**do not publish** … conversion scores or revenue forecasts" — a prohibition the allowlist did not recognise | Allowlist widened to `do not publish`, `must not`, `not offered`, `not claimed`, … |
| Third-party subresources on `404.html` | They were absolute URLs to the site's **own** origin. A 404 must use absolute URLs, because it is served at arbitrary depth where relative paths break | Same-origin URLs are now resolved as internal |
| `about.html` and `disclosure.html` orphaned | They are linked, but via absolute same-origin URLs the resolver skipped | Absolute same-origin links resolve as internal |
| 10 orphan pages | All are deliberate `data-page="archive"` legacy handoff routes, retained for old URLs and intentionally unlinked | Archive routes excluded, and the exclusion is counted and printed |

A gate that has only ever been run against the output it was written for cannot
distinguish "compliant" from "broken detector". Every copy rule here is now backed
by a **positive control** (check C5) that feeds it a known violation and fails if
the detector does not fire. That is the single most transferable idea in this
directory.

### 3. A tested first-party analytics collector — `collector/`

Zero-dependency Node, **27 assertions passing**. It verifies the properties that
actually matter rather than the ones that are easy to assert — including, on disk
after a flush: **no IP address, no user agent, no cookie or identifier, no email
address, no query string, and no per-event log**. Only aggregate integers survive a
request.

The live site uses a different collector (`analytics/worker.js`,
`server/analytics-server.py`) with a different event vocabulary. This one is offered
as an alternative, not a replacement, and is **not wired into anything**. See the
request in `COORDINATION.md`.

One real bug was found and fixed while testing it: the server originally destroyed
the socket on an oversized body, which reached the client as a network error
instead of the intended `413`. It now drains the body and responds properly.

### 4. The retired baseline itself

Reproducible and self-contained. Regenerate with:

```bash
cd release_checks/f5df06de
node tools/build.mjs        # 46 pages into ./build (gitignored)
node tools/verify.mjs       # 223 checks, all passing
node tools/linkcheck.mjs    # 0 broken links, 0 orphans
node collector/test.mjs     # 27 assertions, all passing
```

Its registers are the part with residual value, because they were built
independently of `data/products.csv` and `data/sources.csv` and **agree with them**:

- `site/data/products.mjs` — 3 products, 4 submissions, intent and observation in
  separate objects with no merge path
- `site/data/sources.mjs` — 15 sources, each with document date, retrieval method,
  verbatim quotation and what it was relied on for
- `site/data/flags.mjs` — 23 flags with evidence, impact and required action
- `data/*.json` — machine-readable registers and the empty campaign ledger

**Do not publish `build/`.** It is a second site at colliding paths.

---

## Findings that differ from the main board

Three flags here are not on the published Flagged for Review page and may be worth
adding. All are non-blocking.

| ID | Finding |
| --- | --- |
| **F-08** | *Self-audit of the research method.* Amazon's IP License §4 (Agent Terms) requires an autonomous agent to identify itself with `Agent/[agent name]` in the user-agent string and not to conceal that its access is automated. Both this session's and earlier sessions' research fetched Amazon listings through automated tooling. No board entry records whether that requirement was met. The values are good-faith observations with an unresolved collection-method question attached, and should be re-verified by a human in a normal browser before use in promotional copy. |
| **F-09** | *No Amazon imagery, with the licensing reason stated.* IP License §2(h) permits storing a **link** to a product image for at most 24 hours, after which content must be refreshed via PA-API, Creators API or a Data Feed. A static GitHub Pages site cannot refresh anything, so any embedded or linked Amazon image would be held far beyond the limit. The audit confirms the live site hotlinks none. Worth recording as the *reason*, so a future session does not "improve" the site by adding product photos. |
| **F-21** | *The five events were never enumerated.* The brief says "record the five defined events" without naming them. The live site implements `page_view`, `guide_view`, `outbound_click`, `feed_click` and a bearer-gated `reported_order` (confirmed by reading `analytics/worker.js`, `assets/analytics.js`, `analytics/targets.json` and `data/events.md`). This baseline independently chose `page_view`, `disclosure_view`, `outbound_click`, `affiliate_click` and `reader_capture`. **Two sessions reading the same instruction produced two disjoint sets sharing only one name.** That is the clearest possible evidence the set needs an owner's decision, and it should be fixed before the collector goes live: event names cannot be changed later without losing comparability with everything already collected. |

Also worth noting: this baseline's commission research **independently reproduced**
the conflict the board already records. Four sources gave five different numbers
for the same categories, and Amazon's *onsite* schedule (Kitchen 1.25%) differs
from its standard off-site schedule — so quoting a rate without naming the
schedule is meaningless even when the number is correct.

---

## Boundaries respected

- **No file outside this directory was modified**, except an append-only entry in
  the shared `COORDINATION.md` board, which is the mechanism the board prescribes.
- The merge of `origin/main` resolved every conflict **in `main`'s favour**
  (`-X theirs`). Their `index.html`, `products/`, `guides/`, `sitemap.xml`,
  `feed.xml`, `robots.txt`, `README.md`, `data/products.json`,
  `.github/workflows/verify.yml`, `.gitignore` and `COORDINATION.md` are theirs.
- Their published page count is unchanged at **32**.
- Their own suites were re-run on the merged tree and all pass:
  `scripts/build.py --check` clean, `scripts/check.py` 2 tests OK,
  `python3 -m unittest discover -s verification` 5 tests OK,
  `verification/check_release.py` **32 pages, 0 findings**.
- `verification/` and `release_checks/e10111d6/` were not touched.
- No competing pull-request content was merged into this scope.
