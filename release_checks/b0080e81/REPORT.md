# Independent re-verification report — session `b0080e81`

Date: 2026-11-21 (UTC). Scope: `release_checks/b0080e81/` + append-only `COORDINATION.md` entry only.
No published page, `source/`, `data/`, `scripts/`, `verification/`, or another session's scope was edited.
Parallel PR #18 (`arena/d47e5378-diyhome3`) touches only `COORDINATION.md` + `release_checks/d47e5378/REPORT.md` — no overlap.

## Official sources re-fetched 2026-11-21 (line-by-line)

| Source | URL | Result |
|---|---|---|
| S01 Operating Agreement §5 | https://affiliate-program.amazon.com/help/operating/agreement | Confirmed. Page header "Updated: October 15, 2025". §5 requires verbatim: "As an Amazon Associate I earn from qualifying purchases." §1 defines Special Links as links that "properly use the special 'tagged' link formats we provide". Site carries the exact sentence twice per page (strip + footer) — matches. |
| S02 Program Policies | https://affiliate-program.amazon.com/help/operating/policies | Confirmed. Header "Updated: April 14, 2026" — matches source register. Commission Income Statement present. |
| S03 FTC Endorsement Guides FAQ | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking | Confirmed live; affiliate/network-marketing disclosure section present; Guides revised 2023. |
| S07 GitHub Pages limits | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | Confirmed: Pages "is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions". Editorial-only stance on Pages remains correct. |
| S15 Standard Commission Income Rates | https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ | Confirmed: "Physical Books, Kitchen, Automotive \| 4.50%"; "Toys, Furniture, Home, Home Improvement, ..., Tools, ... \| 3.00%"; "All Other Categories \| 4.00%". Matches register. |
| S16 Creators API | https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction | Confirmed prerequisites: enrolled in Associates for target marketplace + "at least 10 qualifying sales within the past 30 days". No API data is used by this site — consistent. |

## Product submissions (unchanged, still correctly gated)

- `data/products.json` / `data/products.csv`: 4 submissions, 3 unique products; `B03QDuGdo` submitted twice (rows 2–3, deduplicated, `duplicate_of: 2`).
- All submitted tokens are 9 characters; ASINs are 10 characters (S05) — intended ASIN fields remain blank/UNVERIFIED. Observed redirect targets (B08FKW9JRM, B0BSKQW2T2, B08DY9HRWD) are kept in separate observed fields and were NOT merged into intent fields. `SPECIAL_LINKS` remains empty; no `tag=` URL is published. Short links are not declared invalid — compliance status unresolved, as recorded.
- `shopnow047c-20` remains a requested tracking ID, not a verified tag.
- Direct `curl` to `link.amazon` is blocked from this sandbox (host not in outbound allowlist), so redirect targets were not re-observed today; the 2026-11-20 observations stand as recorded and are labelled as such. No value was changed.

## Live site

- Fetched https://kanlerxz87-cyber.github.io/DIYHOME3/ — front page matches repo `index.html` (publication front page, shop-first, guides, RSS band).
- Fetched sitemap.xml — 10 URLs (home, shop, guides index, 7 guides). Matches repo.
- Pages API: status `built`, source branch `main`, path `/`, public, HTTPS enforced.

## Local verification suites (all run 2026-11-21)

```
python3 scripts/build.py --check        -> clean (exit 0)
python3 scripts/check.py                -> Ran 2 tests, OK
python3 -m unittest discover -s scripts -> Ran 6 tests, OK
python3 scripts/validate_register.py    -> OK: 3 records validated; intended/observed separation preserved
python3 verification/check_release.py . -> 32 HTML page(s) checked; 0 finding(s)
python3 -m unittest discover -s verification -> Ran 5 tests, OK
python3 -m unittest discover -s release_checks/e10111d6 -> Ran 5 tests, OK
node release_checks/f5df06de/tools/build.mjs   -> retired baseline built to /tmp (outside repo)
node release_checks/f5df06de/tools/verify.mjs  -> All checks passed (223-check gate)
node release_checks/f5df06de/tools/audit.mjs   -> 24 checks, 0 findings
node release_checks/f5df06de/tools/linkcheck.mjs -> No broken internal links
node release_checks/f5df06de/collector/test.mjs -> 27 passed, 0 failed
```

Note: `verify.mjs` requires the retired baseline pre-built to `$TMPDIR/diyhome3-retired-baseline`; without it the tool errors with ENOENT. This is a tooling prerequisite, not a site defect.

## Irregularities / flags (unchanged, non-blocking)

1. Intended ASINs unconfirmed; Special Link attribution untested — owner action required (Flagged for Review F-01/F-02).
2. Search Console ownership/submission and production analytics not connected — no performance claims made.
3. Per-product commission rate cells for B0BSKQW2T2 / B08DY9HRWD remain blank (Kitchen 4.50% vs Home 3.00% ambiguity); B08FKW9JRM is determinate at 3.00% but left to the integration session's policy.
4. No defect found in any published file; no integration request logged.

## Conclusion

The published editorial release is intact and consistent with official sources as of 2026-11-21. Commerce remains correctly disabled pending owner confirmation of product intent and enrolled-workflow link testing. Nothing in this report blocks merge.
