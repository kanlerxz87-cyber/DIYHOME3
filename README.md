# DIYHOME3

An Amazon Associates property covering **reversible, low-cost home upgrades** — built as a
publication for readers and as a dashboard for the operator, from the same verified data.

**Live site:** <https://kanlerxz87-cyber.github.io/DIYHOME3/>

> **As an Amazon Associate I earn from qualifying purchases.**
> Affiliate attribution is **not currently active**: no published link carries a tracking tag,
> because the tagged Special Links have not yet been validated in Associates Central.
> This is stated openly rather than left implicit — see [F-01](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged/index.html#F-01).

---

## What this is

Four product links were supplied. Three were unique — two were byte-identical. All three resolved
to real Amazon listings, and every attribute was read off the listing and recorded with its source.

| Supplied link | Token | Chars | Valid ASIN format | Resolved to | Listing |
| --- | --- | --- | --- | --- | --- |
| `link.amazon/B0hmGG4m2` | `B0hmGG4m2` | 9 | **No** | `B08FKW9JRM` | Art3d Smoothing Tool Kit for Peel and Stick Wallpaper |
| `link.amazon/B03QDuGdo` | `B03QDuGdo` | 9 | **No** | `B0BSKQW2T2` | Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling |
| `link.amazon/B03QDuGdo` | _duplicate_ | 9 | **No** | `B0BSKQW2T2` | _same as above_ |
| `link.amazon/B0hpD2JGQ` | `B0hpD2JGQ` | 9 | **No** | `B08DY9HRWD` | Pots and Pans Organizer Under Cabinet 16.6", 8-Tier |

Observed 2026-11-20, signed out, no Associates credentials, no `tag` parameter in any redirect.
Full detail: the [product register](https://kanlerxz87-cyber.github.io/DIYHOME3/products/index.html)
and the [product-intent record](https://kanlerxz87-cyber.github.io/DIYHOME3/dashboard/link-intent.html).

## The rule this repository follows

> Every table row that asserts a fact has a source link to an official site. If a value cannot be
> confirmed from an official source, the cell is left blank and flagged as unverified. Nothing is
> inferred and nothing is filled in.

That rule is enforced by code, not by discipline. `tools/verify.mjs` runs it against the **built
output** and fails the build on a violation.

## Layout

```
site/data/          the source of truth. products, guides, flags, sources
site/pages/         page builders — editorial and dashboard
site/layout.mjs     the page shell: masthead, disclosure strip, nav, footer, block renderer
tools/build.mjs     registry -> HTML + sitemap.xml + feed.xml + robots.txt + data/*.json
tools/verify.mjs    the compliance and data gate
tools/linkcheck.mjs internal link and asset crawl
assets/             stylesheet, two scripts, original SVG artwork
analytics/server/   zero-dependency first-party collector, plus its test
data/               machine-readable registers and the (empty) campaign ledger
```

One registry generates everything. Correct a fact once and it corrects the page, the register, the
sitemap, the feed and the dashboard together — which is what makes the compliance gate travel with
the content instead of sitting beside it.

## Build and check

```bash
node tools/build.mjs        # 46 pages + sitemap + feed + robots + data/*.json
node tools/verify.mjs       # compliance and data gate — exits non-zero on any failure
node tools/linkcheck.mjs    # crawl for broken internal links and missing assets
node analytics/server/test.mjs   # 24 assertions against the collector, including privacy properties
```

No dependencies. No install step. Node 18 or newer.

## Compliance

| Obligation | Source | State |
| --- | --- | --- |
| §5 Associate disclosure above the fold on every page | [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) | Satisfied, shell-enforced |
| Same sentence repeated in every footer | project requirement | Satisfied, shell-enforced |
| Every shopping-host link marked `rel="sponsored"` | [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | Satisfied, single emitter, CI-enforced |
| Price displays stamped and disclaimed | IP License §2(i) | Satisfied, verbatim |
| Program Content text disclaimer | IP License §2(k) | Satisfied, verbatim |
| No stored or cached product imagery | IP License §2(h) | Satisfied — no Amazon image is used at all |
| Links use Amazon's tagged Special Link format | Operating Agreement §1 | **Not satisfied — gated**, F-15 |
| No first-person experience claims | [FTC 16 CFR §255.1(a)](https://www.ftc.gov/system/files/ftc_gov/pdf/p204500_endorsement_guides_in_2023.pdf) | Satisfied, CI-enforced |
| No cookies, no third-party scripts, no personal data | GDPR / UK GDPR / Swiss FADP | Satisfied |

Full detail, including the nine obligations that need a human:
[compliance hub](https://kanlerxz87-cyber.github.io/DIYHOME3/compliance/index.html) ·
[compliance gate](https://kanlerxz87-cyber.github.io/DIYHOME3/dashboard/compliance-gate.html).

## Things this site deliberately does not do

- **No commission rate.** Four sources gave five different numbers and none was Amazon. The cells are blank and the calculator has no default.
- **No revenue forecast, no conversion score.** Prohibited by the brief, and unsupported by Operating Agreement §4.
- **No product imagery.** Amazon's IP License permits holding an image link for only 24 hours; a static site cannot refresh anything.
- **No review text quoted, no star histogram invented.**
- **No search-volume or keyword figures.** No authorised source was available, so every title is an editorial hypothesis and says so.
- **No invented author.** The byline is a desk, labelled as automated drafting pending named human review.
- **No ranking or superlative.** The comparison page compares criteria, not products.
- **No placeholder zeros in the campaign ledger.** A zero and a blank look identical once a table has been filled in for a while.

## Coordination

Multiple agent sessions may work here concurrently. **[COORDINATION.md](COORDINATION.md)** is the
shared task board — read it before starting anything, and claim a task by writing your session ID
and file scope there before editing.

## Flagged for review

23 items, each with evidence, impact, required action and source links:
**[Flagged for Review](https://kanlerxz87-cyber.github.io/DIYHOME3/flagged/index.html)**.

Nothing on that page blocked the build or the merge. They are published so they can be actioned
after the site is live.
