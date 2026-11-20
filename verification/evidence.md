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
| Is catalog automation available? | [Creators API introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) documents the catalog operations and onboarding prerequisites; [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) incorporate the IP License and Usage Requirements. | Do not imply the credentialed API is active. Keep pricing, Amazon ratings/reviews, and product imagery out until the permitted source, use, and refresh rules are established. |
| Does an outbound click establish a conversion? | [Program Policies: Commission Income Statement](https://affiliate-program.amazon.com/help/operating/policies) distinguishes qualified transactions from link clicks. | Keep click analytics separate from authorized Associates reports. Do not join per-reader records or fill missing conversions with zeros. |
| Can Pages host a writable collector? | [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) describes static hosting and discloses GitHub's security IP logging. | A collector needs a separately deployed backend. A static build or a preview collector is not an active production analytics connection. |
| Does generating a sitemap verify Search Console? | [Search Console ownership help](https://support.google.com/webmasters/answer/9008080?hl=en) requires a verification method or granted property access. | Do not claim verification, impressions, or measured queries based on local output. |

## Release status vocabulary

- **Verified observation**: dated public evidence supports this limited fact.
- **Unverified**: leave the value empty; do not substitute observed data for intent or a null metric for a measured zero.
- **Release gate**: must pass before turning on the affected CTA, ingestion, or data claim. Unverified items need not prevent the editorial site from going live.
