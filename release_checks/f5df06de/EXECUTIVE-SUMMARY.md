# Executive Summary — DIYHOME3

**Prepared:** 2026-11-20 · **By:** DIYHOME3 Editorial Desk (automated research and drafting; pending named human review)
**Live site:** <https://kanlerxz87-cyber.github.io/DIYHOME3/> · **Rendered version:** [`/executive-summary.html`](https://kanlerxz87-cyber.github.io/DIYHOME3/executive-summary.html)

---

## 1. The headline

A complete, live, compliant Amazon Associates property was built around three verified products — with its
monetisation **deliberately switched off** until a human validates the links.

Four links were supplied. Three were unique; two were byte-identical. All three resolved to real Amazon
listings, and every attribute was read off the page and recorded with its source. But **not one of the
resolved URLs carried a tracking tag**, and the tracking ID `shopnow047c-20` does not appear anywhere in
the observed redirect chain. As published, every click this site sends to Amazon earns nothing.

That is a one-field fix per product once someone has generated and validated a tagged Special Link in
Associates Central. It cannot be automated, because it needs an authenticated session and a tracking
report to confirm against. Rather than fake it, the site ships untagged with the gate visible on every
product page.

---

## 2. The verified product set

All values observed 2026-11-20 06:00 UTC from amazon.com, signed out, with no Associates credentials.
Delivery location rendered as Herndon 20170. All three prices were **Black Friday deal prices**.

| Supplied | Observed ASIN | Listing | Brand store | Sold by | Stars | Ratings | Price | Anchor |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L1 | [`B08FKW9JRM`](https://www.amazon.com/dp/B08FKW9JRM) | Art3d Smoothing Tool Kit for Peel and Stick Wallpaper | Art3d | Art3d® | 4.6 | 26,432 | $5.08 | Typical price $5.99 |
| L2, L3 | [`B0BSKQW2T2`](https://www.amazon.com/dp/B0BSKQW2T2) | Paper Towel Holder Under Cabinet, Self-Adhesive or Drilling, Matte Black | niffgaff | YH Urban | 4.2 | 12,099 | $6.79 | Typical price $7.99 |
| L4 | [`B08DY9HRWD`](https://www.amazon.com/dp/B08DY9HRWD) | Pots and Pans Organizer Under Cabinet 16.6", 8-Tier Adjustable Rack | ORDORA | ORDORA Official | 4.4 | 18,835 | $17.74 (Prime only) | List Price $23.99 |

Category placement, as Amazon rendered it:

- `B08FKW9JRM` — Tools & Home Improvement › Paint, Wall Treatments & Supplies › Wallpaper & Wallpapering Supplies › **Wallpaper Tools** (node 164701011)
- `B0BSKQW2T2` — Home & Kitchen › Kitchen & Dining › Storage & Organization › Racks & Holders › **Paper Towel Holders** (node 3744201)
- `B08DY9HRWD` — Home & Kitchen › Kitchen & Dining › Storage & Organization › Racks & Holders › **Pot Racks** (node 289824)

---

## 3. The niche the data actually supports

> **Reversible, low-cost home upgrades for people who cannot or will not make permanent changes.**

Read off the evidence rather than chosen in advance. All three listing titles or subheads carry a
no-permanent-change signal — peel-and-stick, self-adhesive, tool-free, no-drill, under-cabinet. The set
straddles two Amazon top-level departments, which a single-room framing would get wrong, but two of the
three sit in one narrow leaf: Storage & Organization › Racks & Holders. The price band is $5.08–$17.74.
The unifying buyer constraint is **reversibility**, not room and not price.

A secondary signal: every redirect carried `sprefix=diy home upgrades`, showing the resolver worked from
a search seeded with that exact phrase — which is also the project's name.

---

## 4. The seven most consequential findings

### F-01 · Critical — no tracking tag anywhere in the redirect chain
Every observed destination was captured character-for-character. The full parameter set is
`lv=shuf`, `btn_type=ss`, `crid`, `sprefix`, `gaOptInStatus`, `language`, `sr`, `btn_ref`, `channelId`,
`plpRedirect`, `th`. **None is `tag`.** As things stand the links send readers to the right products and
earn nothing. Amazon's Commission Income Statement §2(g) disqualifies purchases "not correctly tracked or
reported because the links from your site to the relevant Amazon Site are not properly formatted".

### F-02 · High — the supplied tokens are not ASINs
`B0hmGG4m2`, `B03QDuGdo` and `B0hpD2JGQ` are each **9 characters** and contain lower-case letters.
Amazon defines an ASIN as "a unique 10-character alphanumeric code assigned to every product listed in
the Amazon store", typically starting `B0`. All three *observed* destination ASINs are valid 10-character
uppercase-alphanumeric codes. The submitted tokens are short-link slugs and cannot be used in Associates
tooling, a PA-API call, or a report join.

### F-03 · High — the destination may not be stable
Every redirect resolved through a **search-fallback path** (`plpRedirect=mhFallback`, `lv=shuf`) with a
**per-request token** (three different `srctok-*` values across three requests) and a **search result
position** (8-2, 8-3, 8-13). A link whose destination is a search position can resolve to a different
product on a different day. This is recorded as an observation, not as a claim that `link.amazon` is
broken or non-compliant — its status is unresolved.

### F-04 · High — `link.amazon` is not referenced in either programme document
Operating Agreement §1 requires links to "properly use the special 'tagged' link formats we provide".
Neither the Agreement nor the Program Policies text retrieved names `link.amazon`. The supplied links *do*
require an affirmative click on this site, which argues against the §2(e) "Redirecting Link"
characterisation — but they carry no tag, which engages §2(g). Both readings are recorded; neither is
asserted as settled. **The brief's instruction not to call the short links invalid has been followed.**

### F-05 · High — commission rates are unresolvable from available sources
Amazon's Program Policies §3 puts the standard off-site rates in the **Appendix**, which was not reached.
Three third-party pages retrieved in the same session disagreed with each other *and* with Amazon's own
onsite schedule:

| Source | Kitchen | Home / Home Improvement | Tools |
| --- | --- | --- | --- |
| Amazon **onsite** schedule (official, different schedule) | 1.25% | 3.00% | 1.75% |
| amawp.com | 4.50% | 3.00% | 3.00% |
| sozee.ai (off-site table) | 4.5% | 3% | 3% |
| sozee.ai (onsite table, **same page**) | 1.25% | 1.25% | 1.75% |
| earnifyhub.com | 5% | 8% | not stated |

Rate cells are **blank**. The calculator takes the rate as an operator input with **no default**.

### F-06 · Medium — the brief's editorial hypotheses do not match the products
Four suggested guide titles concern air fryers and multi-function cooking appliances. **None of the three
resolved products is a cooking appliance.** Per the brief, those titles are working hypotheses rather than
claims, so they are published — in a cluster labelled HYPOTHESIS ONLY, with no product mapping and no
outbound product link, and with their status stated at the foot of each article.

### F-08 · High — self-audit of the research method
Amazon's IP License §4 (Agent Terms) requires an autonomous agent to identify itself with
`Agent/[agent name]` in the user-agent string, not to conceal that its access is automated, and not to
circumvent measures controlling agent access. The research behind this register was performed by an
automated agent. **The user-agent string those requests carried is not visible to this session**, so
compliance cannot be confirmed, and the agent was not operating under an enrolled Associates account.
This is disclosed on every product page rather than quietly omitted.

---

## 5. What was delivered

| Requirement | State |
| --- | --- |
| Publication front page leading with products, not the verification process | Done — editorial hero, product rail, guide rail, seasons, then flags |
| Every dashboard surface reachable from the footer and one navigation group | Done — 16 surfaces behind one `Dashboard` entry, all listed in the footer |
| Subpages by category, dashboard-style, with tables | Done — products, guides, clusters, compare, compliance, flagged, methodology, about |
| Question-shaped guides published | Done — 11 guides, 3 clusters, 2 pillars |
| Publishing cadence set | Done — weekly on Thursdays; sitemap and feed updated in the same commit **by construction** |
| Each new guide added to sitemap and feed | Done — both generated from the same registry; CI fails on drift |
| Shipped RSS feed (SG-28) | Done — RSS 2.0 with `atom:link rel="self"` and autodiscovery on every page |
| Navigation labels (SG-27) | Done — eight labels with published rationale |
| Reader capture (SG-30) | Built and instrumented, **inert** until an endpoint exists (F-13) |
| Search Console (SG-29) | Site side complete; property verification needs an account (F-12) |
| Privacy-preserving outbound-click counter | Done — no cookies, identifiers, IP, user agent or third-party request |
| Self-hosted analytics endpoint | Built and tested (24 assertions green); **not deployable on GitHub Pages** (F-11) |
| The five defined events | Implemented — but the brief never enumerated them, so the set is a documented assumption (F-21) |
| Disclosure above the fold on every page, repeated in the footer | Done — rendered by the page shell, so no page can omit it; CI-asserted |
| Every outbound product link marked sponsored | Done — single emitter that auto-detects shopping hosts; CI-enforced |
| Product-intent record with observed redirects kept separate | Done — separate objects, separate tables, no merge path; CI-asserted |
| Empty but well-defined campaign ledger with dated provenance | Done — fixed schema, forbidden-field declarations, zero invented rows |
| No conversion score, no revenue forecast | Correct — neither appears anywhere |
| Disclosures and API policy checks in the publishing workflow | Done — 13 automated CI checks plus 9 documented human checks |
| Authorship, navigation, brand, imagery, seasons, clusters | Done — with authorship left as a desk label and imagery original, both for stated compliance reasons |
| Flagged for Review page with source links | Done — 23 flags with evidence, impact, action and sources |
| COORDINATION.md task board | Done — created, claimed and completed within this cycle |
| GitHub Pages live site | Done — see section 8 |

---

## 6. What could not be verified

| Item | Why not | Flag |
| --- | --- | --- |
| Commission rate for any product | Official Appendix not reached; four third-party pages gave five conflicting numbers | F-05 |
| That the supplied tokens are ASINs | They are not — 9 characters, mixed case, against Amazon's 10-character definition | F-02 |
| That the redirect destinations are stable | All resolved through a search-fallback path with per-request tokens | F-03 |
| That `link.amazon` is a compliant tagged format | Not referenced in either programme document retrieved. **Not called invalid** | F-04 |
| That `shopnow047c-20` is active on an approved account | Requires an authenticated Associates Central session | F-16 |
| Which product the owner actually intended | Nothing supplied asserted an ASIN, name or category | F-02 |
| Search volume or keyword difficulty for any title | No authorised keyword source available | F-12 |
| Any click, session, order or revenue figure | No collector deployed; no authorised report available | F-11, F-20 |
| That the agent-based research satisfied the Agent Terms | The user-agent string is not visible to this session | F-08 |
| Stock status and variations for two of three listings | Not read on the captured portion of the page; not inferred | F-19 |

---

## 7. The seven decisions that need a human

1. **Confirm the three observed ASINs are the products you meant.** Nothing supplied asserted an identity,
   and all three resolved through a search fallback seeded with "diy home upgrades". If any is wrong, that
   is the single most important finding in this build. — F-02, F-03
2. **Validate one tagged Special Link per product** in Associates Central and confirm it in the tracking
   report. Then flip one field per product in `site/data/products.mjs` and rebuild. — F-01, F-15
3. **Confirm `shopnow047c-20` is active** and that the live GitHub Pages URL is registered on the account. — F-16
4. **Read the commission rate off the official Appendix** under your own session and enter it. The
   calculator has no default and will not guess one. — F-05
5. **Assign a named human editor**, have them read all eleven guides, and only then put their name in the
   byline. — F-14
6. **Deploy the analytics collector** to any Node host and set `window.DIYHOME3.endpoint`. Until then every
   count is local to one browser and there is no aggregate measurement. — F-11
7. **Decide what to do with the air-fryer cluster.** — F-06

---

## 8. Numbers at a glance

| | |
| --- | --- |
| Links supplied | 4 (3 unique) |
| Listings resolved | 3 / 3 |
| Valid ASIN tokens among those supplied | 0 / 3 |
| Links carrying a tracking tag | 0 / 3 |
| Guides published | 11 (4 hypothesis-only) |
| Clusters | 3 (2 live, 1 hypothesis) |
| Official sources cited | 12 |
| Third-party sources recorded as conflict evidence only | 3 |
| Flags raised | 23 (1 critical, 8 high) |
| Dashboard surfaces | 16 |
| Built pages | 46 |
| Sitemap URLs | 45 |
| Feed items | 11 |
| Automated compliance checks in CI | 13 |
| Human-only obligations documented | 9 |
| Collector test assertions | 24, all passing |
| Cookies set | 0 |
| Third-party scripts loaded | 0 |
| Revenue forecast published | none |

---

## 9. One structural idea worth keeping

Every page, the sitemap, the feed, the register and the dashboard are generated from three data files.
Correcting a fact is one edit and it propagates everywhere at once, including into the compliance
assertions. Adding a product is one object; adding a guide is one object.

That is what makes the compliance gate travel with the content instead of sitting beside it — and it is
the part of this build that will still be useful when the register holds fifty products instead of three.

---

## 10. Sources

Twelve official sources and three third-party pages recorded as evidence of conflict. Each entry states
its document date, how it was retrieved, the verbatim quotation relied upon, and what it was used for.

**Full register:** <https://kanlerxz87-cyber.github.io/DIYHOME3/methodology/sources.html>

Key documents:

- [Associates Program Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) — updated 2025-10-15
- [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies) — updated 2026-04-14
- [Associates disclosure help topic](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98)
- [Onsite Commission Income Statement](https://affiliate-program.amazon.com/help/node/topic/G4ARBJC7Z2NK48CA)
- [Understanding ASIN numbers](https://sell.amazon.com/blog/what-is-an-asin)
- [FTC Guides, 16 CFR Part 255 (2023)](https://www.ftc.gov/system/files/ftc_gov/pdf/p204500_endorsement_guides_in_2023.pdf)
- [FTC — Endorsements, Influencers, and Reviews](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews)
- [Google Search Central — Qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
- Product listings: [B08FKW9JRM](https://www.amazon.com/dp/B08FKW9JRM) · [B0BSKQW2T2](https://www.amazon.com/dp/B0BSKQW2T2) · [B08DY9HRWD](https://www.amazon.com/dp/B08DY9HRWD)

---

*This summary is not legal advice. It records what the source documents say and what this build does
about them. The owner should read the Operating Agreement and Program Policies directly and take their
own advice on the FTC Guides and on applicable data-protection law in every jurisdiction their readers
are in.*
