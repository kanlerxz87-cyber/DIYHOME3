# Independent release review

**Observed 2026-11-20 UTC.** Public Amazon pages were opened from the submitted short URLs. The final Amazon page title and `/dp/` path identify the **observed** listing, not the product the submitter intended or the link's tracking behavior. The listing links below normalize the observed paths and omit transient parameters. They are evidence links, not Special Links.

| Submission | Input | Observed listing | Intended ASIN | Intended listing | Intent confirmation date | Intent confirmation source | Flag |
|---|---|---|---|---|---|---|---|
| 1 | `https://link.amazon/B0hmGG4m2` | [B08FKW9JRM · Art3d wallpaper smoothing tool kit](https://www.amazon.com/dp/B08FKW9JRM) | | | | | Intent and tracking unverified |
| 2 | `https://link.amazon/B03QDuGdo` | [B0BSKQW2T2 · under-cabinet paper towel holder](https://www.amazon.com/dp/B0BSKQW2T2) | | | | | Intent and tracking unverified |
| 3 | `https://link.amazon/B03QDuGdo` | [B0BSKQW2T2 · under-cabinet paper towel holder](https://www.amazon.com/dp/B0BSKQW2T2) | | | | | Exact duplicate of submission 2; no independent intent or tracking evidence |
| 4 | `https://link.amazon/B0hpD2JGQ` | [B08DY9HRWD · ORDORA pots and pans organizer](https://www.amazon.com/dp/B08DY9HRWD) | | | | | Intent and tracking unverified |

The three observed listings are not air fryers. Air-fryer titles can be explored as a separate editorial hypothesis, not as a description of these submissions. A redirect check does not establish whether a short URL is compliant or whether it credits `shopnow047c-20`. No authenticated report, controlled link attribution, purchase, session count, revenue observation, popularity estimate, or pricing evidence was recorded.

| Release question | Independently verified official reference | Implication for the build |
|---|---|---|
| Is an ASIN checkable? | [Sell on Amazon: What is an ASIN?](https://sell.amazon.com/blog/what-is-an-asin) defines a ten-character identifier and describes finding it after `/dp/` on a detail page. | Do not interpret a short slug as an ASIN; keep intent fields distinct from observed records. |
| Can a short URL be a Special Link? | [Operating Agreement §1](https://affiliate-program.amazon.com/help/operating/agreement) requires Amazon-provided tagged link formats; [SiteStripe Help](https://affiliate-program.amazon.com/help/node/topic/GJMMT7G4C8K4Y3AY) explicitly describes short links generated with Associate and tracking IDs. | No blanket classification based on URL length or the final query string. Gate affiliate CTAs until the enrolled workflow verifies one intended destination and report result per product. Do not make an incentivized or self-purchase to test revenue. |
| What disclosure is required? | [Operating Agreement §5](https://affiliate-program.amazon.com/help/operating/agreement) specifies “As an Amazon Associate I earn from qualifying purchases.” [FTC Endorsement Guides FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking#affiliateornetwork) explains clear and conspicuous material connection disclosure and context. | Display the statement below the masthead and in the footer. Separately check link-local disclosure when affiliate recommendations are enabled; a footer line or machine-readable link attribute does not replace it. |
| How should paid links be marked? | [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#sponsored) recommends `rel="sponsored"` for paid links. | Validate `rel` when rendering product anchors, including evidence links per project requirement. |
| Is catalog automation available? | [Creators API introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) documents the catalog operations and onboarding prerequisites; [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) incorporate the IP License and Usage Requirements. | Do not imply the credentialed API is active. Participation Requirements restrict displayed price and availability data to an Amazon-served link or a compliant API source, and restrict customer reviews/star ratings to compliant API use. IP License §(e) requires express prior written approval for use of the listed APIs or feeds to aggregate, analyze, extract, or repurpose Product Advertising Content, or directly train or fine-tune models. A dated manual snapshot does not establish permission. |
| Does an outbound click establish a conversion? | [Program Policies: Commission Income Statement](https://affiliate-program.amazon.com/help/operating/policies) distinguishes qualified transactions from link clicks. | Keep click analytics separate from authorized Associates reports. Do not join per-reader records or fill missing conversions with zeros. |
| Can Pages host a writable collector? | [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) describes static hosting and discloses GitHub's security IP logging. | A collector needs a separately deployed backend. A static build or a preview collector is not an active production analytics connection. |
| Does generating a sitemap verify Search Console? | [Search Console ownership help](https://support.google.com/webmasters/answer/9008080?hl=en) requires a verification method or granted property access. | Do not claim verification, impressions, or measured queries based on local output. |

## Release status vocabulary

- **Verified observation**: dated public evidence supports this limited fact.
- **Unverified**: leave the value empty; do not substitute observed data for intent or a null metric for a measured zero.
- **Release gate**: must pass before turning on the affected CTA, ingestion, or data claim. Unverified items need not prevent the editorial site from going live.

---

## 2026-11-21 — session `f23eebec`: independent live re-read (append only; no prior evidence edited)

Each line was fetched from the official host on 2026-11-21 and the quoted wording was
read in the response body. This is an independent read by a different session; it did not
consult any other session's report before recording the results.

| # | URL | Read today | Result |
|---|---|---|---|
| 1 | https://affiliate-program.amazon.com/help/operating/agreement | Section 5, verbatim: "As an Amazon Associate I earn from qualifying purchases." Header: "**Updated:** October 15, 2025". Section 1: Special Links must "properly use the special 'tagged' link formats we provide". | Matches site |
| 2 | https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98 | Link-level disclosure must be "Clear" and "Conspicuous", "placed near any affiliate link or product review"; the same required sentence is restated. | Matches site |
| 3 | https://www.amazon.com/b?ie=UTF8&node=51812349011 | GLOSSARY: "Every item in our catalog has a unique 10-digit ASIN." | Confirms the 9-character finding |
| 4 | https://affiliate-program.amazon.com/help/operating/policies | Header "**Updated:** April 14, 2026". §2(t) reviews/ratings only via Creators API or PA API; §2(y) no price tracking/alerting; §2(u) no self-purchase through Special Links; IP License §2(h) 24-hour image-link window; §2(i) price timestamp + disclaimer; §4 Agent Terms require `Agent/[agent name]`. | New: §2(t)/§2(y)/§2(h)/§2(i) recorded as F-22 source |
| 5 | https://affiliate-program.amazon.com/help/node/topic/GRXPHT8U84RAYDXZ | Table 1: "Physical Books, Kitchen, Automotive | 4.50%"; "…Home, Home Improvement … Tools… | 3.00%"; "All Other Categories | 4.00%". | Matches site |
| 6 | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | "GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions…" | Matches site |
| 7 | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking | "an act or practice is deceptive if it misleads 'a significant minority' of consumers. That's why disclosure is important." | Matches site |
| 8 | https://www.amazon.com/dp/B08FKW9JRM | Title/ASIN match; breadcrumb "Tools & Home Improvement › Paint, Wall Treatments & Supplies › Wallpaper & Wallpapering Supplies › Wallpaper Tools". Price shown $5.08 — **not published**. | Observed only |
| 9 | https://www.amazon.com/dp/B0BSKQW2T2 | Title/ASIN match; breadcrumb "Home & Kitchen › … › Racks & Holders › Paper Towel Holders". Price shown $6.79 — **not published**. | Observed only |
| 10 | https://www.amazon.com/dp/B08DY9HRWD | Title/ASIN match; breadcrumb "Home & Kitchen › … › Racks & Holders › Pot Racks". Price shown $17.74 — **not published**. | Observed only |

### New finding — F-22

**Agent identification.** IP License §4 requires an autonomous agent that touches Program
Content to send `Agent/[agent name]` in its user-agent string and not to conceal that its
access is automated. This session read the three listing pages through automated tooling;
whether that tool set such a token is not observable from inside the sandbox. The listing
values are therefore presentational observations, to be re-checked by a human in a normal
browser before use in promotional copy. Non-blocking: the published site shows only an
ASIN and a breadcrumb path from those pages, and no price, rating or image.

### Still unverified after this pass (unchanged, still blank on the site)

- Intended ASIN per submission — the brief names none; a redirect records behaviour, not intent.
- Special Link destination and report attribution for `shopnow047c-20` — needs the enrolled Associates session.
- Search Console ownership, impressions and clicks — no verified property.
- Production analytics totals — the collector is not deployed on the Pages host.
