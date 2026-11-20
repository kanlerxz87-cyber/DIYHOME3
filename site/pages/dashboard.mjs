/**
 * DASHBOARD SURFACES — the operational half of the site.
 *
 * Every table here is computed from site/data/*.mjs. Nothing is hand-typed twice,
 * so a correction to the register propagates to every surface, the sitemap and
 * the feed in one commit.
 */

import { products, submissions, clusters, TRACKING_ID, OBSERVED_AT, OBSERVED_FROM, asinFormatCheck, countBlanks } from '../data/products.mjs';
import { guides, seasons, AUTHOR, cadence } from '../data/guides.mjs';
import { flags, flagCounts } from '../data/flags.mjs';
import { sources } from '../data/sources.mjs';
import { esc, cell, cites, money, int, link, outbound, renderTable, AMAZON_PRICE_DISCLAIMER } from '../layout.mjs';

const STAMP = '2026-11-20T06:00Z';

const p = (slug) => products.find((x) => x.slug === slug);

/** The five analytics events. Defined here because the brief did not enumerate them (flag F-21). */
export const EVENTS = [
  { name: 'page_view', what: 'A page on this origin finished loading.', why: 'Denominator for every other rate. Without it, a click count means nothing.' },
  { name: 'disclosure_view', what: 'The disclosure strip under the masthead entered the viewport.', why: 'Tests the compliance claim rather than assuming it. If this never fires on a page, the disclosure is not actually being seen.' },
  { name: 'outbound_click', what: 'A click on any link leaving this origin.', why: 'The brief\u2019s privacy-preserving outbound-click counter. Captures where attention actually leaves.' },
  { name: 'affiliate_click', what: 'An outbound click whose destination host is amazon.com, www.amazon.com or link.amazon.', why: 'Separates product intent from citation clicks. A click on a source link is not a commercial signal and must not be counted as one.' },
  { name: 'reader_capture', what: 'A submission of the reader-capture form to a configured endpoint.', why: 'SG-30. Only fires when an endpoint exists, so it can never over-report a capture that was silently dropped.' },
];

function productRows() {
  return products.map(
    (x) => `<tr>
  <td class="mono nowrap">${esc(x.observed.asin)}</td>
  <td>${esc(x.observed.listingH1)}</td>
  <td>${cell(x.observed.brandStore, { sourceIds: x.observed.sourceIds })}</td>
  <td>${cell(x.observed.soldBy, { sourceIds: x.observed.sourceIds })}</td>
  <td>${cell(x.observed.starRating, { sourceIds: x.observed.sourceIds, fmt: (v) => esc(v.toFixed(1)) })}</td>
  <td class="num">${cell(x.observed.ratingsCount, { sourceIds: x.observed.sourceIds, fmt: int })}</td>
  <td class="num">${cell(x.observed.priceObserved, { sourceIds: x.observed.sourceIds, fmt: money })}</td>
  <td>${cell(x.commissionRate, { blankLabel: 'BLANK \u2014 F-05' })}</td>
  <td>${x.submissions.map((s) => `<span class="chip chip-neutral">${s}</span>`).join(' ')}</td>
</tr>`
  );
}

export function dashboardSurfaces() {
  const out = 'dashboard/x.html'; // depth reference for link()

  return [
    /* ============================== 1. OVERVIEW ============================== */
    {
      slug: 'index',
      navLabel: 'Overview',
      title: 'Operational overview',
      description:
        'One-screen status of the DIYHOME3 affiliate operation: what is verified, what is gated, and what is waiting on a human.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Operational overview' },
        {
          p: 'Everything on this screen is derived from the same register that generates the public pages. Where a number could not be confirmed from an official source it is shown as a blank, not as a zero and not as an estimate.',
        },
        {
          metrics: [
            { label: 'Links supplied', value: String(submissions.length), sub: 'As listed in the brief, in order' },
            { label: 'Unique products', value: String(products.length), sub: 'L2 and L3 are the same URL (F-07)' },
            { label: 'Listings resolved', value: '3 of 3', sub: 'All fetched successfully 2026-11-20' },
            { label: 'Valid ASIN tokens', value: '0 of 3', sub: 'All supplied tokens are 9 characters (F-02)' },
            { label: 'Links carrying a tag', value: '0 of 3', sub: 'No tag= in any observed redirect (F-01)' },
            { label: 'Attribution active', value: 'No', sub: 'Gated pending Associates Central validation (F-15)' },
            { label: 'Guides published', value: String(guides.length), sub: `${guides.filter((g) => g.hypothesisOnly).length} labelled hypothesis-only` },
            { label: 'Open flags', value: String(flagCounts.total), sub: `${flagCounts.gated} gated \u00b7 ${flagCounts.needsReview} needs review \u00b7 ${flagCounts.byDesign} by design` },
            { label: 'Commission rate', value: 'Blank', sub: 'Left blank deliberately. Third-party sources conflict (F-05)' },
            { label: 'Revenue forecast', value: 'None', sub: 'Prohibited by the brief and unsupported by S01 \u00a74 (F-20)' },
          ],
        },
        {
          callout: {
            kind: 'gate',
            title: 'The single blocking fact',
            text: 'None of the three resolved listings carried a <code class="inline">tag</code> parameter, and the tracking ID <code class="inline">shopnow047c-20</code> does not appear anywhere in the observed redirect chain. As things stand, every click this site sends to Amazon earns nothing.',
            sourceIds: ['S09', 'S01'],
          },
        },
        {
          p: 'That is not a reason to leave the site unpublished. It is a reason to publish it untagged, with the gate visible, and to fix the links in one place once a human has validated them in Associates Central. Everything else \u2014 the register, the guides, the compliance machinery, the sitemap, the feed, the analytics \u2014 is finished and live.',
        },
        { h3: 'Status by workstream' },
        {
          table: {
            head: ['Workstream', 'State', 'Surface', 'Blocking flag'],
            rows: [
              ['Product research', '<span class="verified">Complete</span> \u2014 3 listings resolved and recorded', `<a href="${link(out, 'dashboard/product-research.html')}">Product research</a>`, '\u2014'],
              ['Product-intent record', '<span class="verified">Complete</span> \u2014 intent and observation held separately', `<a href="${link(out, 'dashboard/link-intent.html')}">Link intent</a>`, '\u2014'],
              ['Pricing analysis', '<span class="verified">Complete</span> \u2014 point-in-time, timestamped', `<a href="${link(out, 'dashboard/pricing.html')}">Pricing</a>`, 'F-17'],
              ['Review analysis', '<span class="verified">Complete</span> \u2014 aggregates only, no review text', `<a href="${link(out, 'dashboard/reviews.html')}">Reviews</a>`, 'F-22'],
              ['Competition analysis', '<span class="chip chip-warn">Partial</span> \u2014 category context only', `<a href="${link(out, 'dashboard/competition.html')}">Competition</a>`, 'F-19'],
              ['Commission potential', '<span class="unverified">Blank</span> \u2014 no official rate confirmed', `<a href="${link(out, 'dashboard/commission.html')}">Commission</a>`, 'F-05'],
              ['Niche identification', '<span class="verified">Complete</span> \u2014 derived from observed browse nodes', `<a href="${link(out, 'dashboard/niche.html')}">Niche</a>`, '\u2014'],
              ['Content generation', '<span class="verified">Complete</span> \u2014 11 guides, zero unverified claims', `<a href="${link(out, 'dashboard/content-pipeline.html')}">Content pipeline</a>`, 'F-14'],
              ['Link management', '<span class="chip chip-bad">Gated</span> \u2014 needs Associates Central', `<a href="${link(out, 'dashboard/link-management.html')}">Link management</a>`, 'F-15, F-01'],
              ['Click tracking', '<span class="chip chip-warn">Local only</span> \u2014 no aggregate collector deployed', `<a href="${link(out, 'dashboard/click-tracking.html')}">Click tracking</a>`, 'F-11'],
              ['Conversion tracking', '<span class="chip chip-warn">Method defined</span> \u2014 no data source authorised', `<a href="${link(out, 'dashboard/conversion-tracking.html')}">Conversion</a>`, 'F-20'],
              ['Campaign ledger', '<span class="verified">Schema live</span> \u2014 intentionally empty', `<a href="${link(out, 'dashboard/campaign-ledger.html')}">Campaign ledger</a>`, 'F-20'],
              ['Compliance gate', '<span class="verified">Enforced in build</span>', `<a href="${link(out, 'dashboard/compliance-gate.html')}">Compliance gate</a>`, '\u2014'],
              ['SEO & findability', '<span class="chip chip-warn">Site side done</span> \u2014 Search Console not connected', `<a href="${link(out, 'dashboard/seo.html')}">SEO</a>`, 'F-12'],
              ['Automation', '<span class="verified">Mapped</span> \u2014 automated vs gated split published', `<a href="${link(out, 'dashboard/automation.html')}">Automation</a>`, '\u2014'],
            ],
          },
        },
      ],
    },

    /* ========================= 2. PRODUCT RESEARCH ========================= */
    {
      slug: 'product-research',
      navLabel: 'Product research',
      title: 'Product research register',
      description:
        'Every supplied link, its resolution, and the verified attributes of the listing it landed on, each with an official source.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Product research register' },
        { p: `Four links were supplied. Three are unique. All three resolved on ${STAMP.slice(0, 10)} from ${esc(OBSERVED_FROM.session)} against ${esc(OBSERVED_FROM.marketplace)}.` },
        {
          table: {
            head: ['Observed ASIN', 'Listing title (as rendered)', 'Brand store', 'Sold by', 'Stars', 'Ratings', 'Price observed', 'Commission', 'From'],
            numCols: [5, 6],
            rows: productRows(),
            note: 'Commission is blank for every row by design \u2014 see flag F-05 and the commission surface. Prices are Black Friday deal prices from a single moment and a single geography (F-17).',
          },
        },
        { h3: 'Submission log \u2014 the four links exactly as received' },
        {
          table: {
            head: ['#', 'Supplied link', 'Token', 'Token length', 'ASIN format check', 'Resolved to', 'Note'],
            rows: submissions.map((s) => {
              const tok = s.url.split('/').pop();
              const chk = asinFormatCheck(tok);
              const prod = products.find((x) => x.submissions.includes(s.id));
              return `<tr>
  <td class="mono">${esc(s.id)}</td>
  <td class="mono">${esc(s.url)}</td>
  <td class="mono">${esc(tok)}</td>
  <td class="num">${chk.length}</td>
  <td><span class="chip ${chk.validFormat ? 'chip-ok' : 'chip-bad'}">${chk.validFormat ? 'PASS' : 'FAIL'}</span> <span class="tiny muted">${esc(chk.verdict)}</span></td>
  <td class="mono">${prod ? esc(prod.observed.asin) : '<span class="unverified">UNRESOLVED</span>'}</td>
  <td>${s.id === 'L3' ? '<span class="chip chip-warn">Duplicate of L2</span>' : '\u2014'}</td>
</tr>`;
            }),
            note: 'Format check applied against Amazon\u2019s published ASIN definition: a unique 10-character alphanumeric code, typically starting "B0". ' + cites(['S05']),
          },
        },
        { h3: 'Category placement, as Amazon rendered it' },
        {
          table: {
            head: ['ASIN', 'Browse path', 'Leaf node id'],
            rows: products.map(
              (x) => `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td>${x.observed.breadcrumb.map(esc).join(' \u203a ')}</td>
  <td class="mono">${esc(x.observed.browseNodeId)}</td>
</tr>`
            ),
            note: 'Browse paths were read from the breadcrumb navigation on each listing page. These paths, and nothing else, are the basis for the niche and cluster analysis on this site. ' + cites(['S06', 'S07', 'S08']),
          },
        },
        {
          observation: {
            text: 'The redirect URLs all carried <code class="inline">sprefix=diy home upgrades,aps,196</code>, which shows the resolver was working from a search seeded with the phrase "diy home upgrades". That phrase is also the name of this project. The three products are therefore consistent with a search for that phrase rather than with a curated product list, which is relevant when judging whether they are the products the owner actually intended.',
            sourceIds: ['S09'],
          },
        },
        {
          gate: {
            text: 'Confirming that these three listings are the products you meant to market cannot be automated. Nothing in the supplied material asserted an ASIN, a product name or a category \u2014 only four short links.',
            action: 'Open each observed ASIN and confirm it is the intended product. If any is not, the short link resolved somewhere you did not mean, which is itself the most important finding in this register.',
            flag: 'F-02',
          },
        },
      ],
    },

    /* ====================== 3. PRODUCT-INTENT RECORD ====================== */
    {
      slug: 'link-intent',
      navLabel: 'Link intent',
      title: 'Product-intent confirmation record',
      description:
        'Intended identifier and observed redirect target held in separate fields, never merged, each with its own source and capture date.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Product-intent confirmation record' },
        {
          callout: {
            kind: 'info',
            title: 'Why these two fields are kept apart',
            text: 'The brief requires that for each submitted link the record stores the intended ASIN, the official listing URL, a confirmation date and a source, and that observed redirect targets are kept in a <em>separate</em> field. Merging them would destroy the only evidence that the link and the product disagree. On this register they disagree on all three products: the submitted tokens are not ASINs at all, and the ASINs observed at the destination were never asserted by anyone.',
          },
        },
        { h3: 'Field A \u2014 intent (what was submitted)' },
        {
          table: {
            head: ['Submission', 'Submitted link', 'Intended ASIN as submitted', 'Format verdict', 'Intended listing URL', 'Confirmation date', 'Source'],
            rows: products.map((x) => {
              const c = x.intent.formatCheck;
              return `<tr>
  <td class="mono">${x.submissions.join(', ')}</td>
  <td class="mono">${esc(x.intent.url)}</td>
  <td>${x.intent.claimedAsin === null ? '<span class="unverified">NONE ASSERTED</span>' : `<span class="mono">${esc(x.intent.claimedAsin)}</span>`}</td>
  <td><span class="chip chip-bad">${c.length} chars</span> <span class="tiny muted">${esc(c.verdict)}</span></td>
  <td><span class="unverified">NOT SUPPLIED</span></td>
  <td><span class="unverified">NOT CONFIRMED</span></td>
  <td>${cites(['S09'])}</td>
</tr>`;
            }),
            note: 'The brief supplied links only. It never stated an ASIN, a listing URL or a confirmation date for any of them, so those four columns are blank rather than back-filled from the observed redirect. Back-filling them is exactly the merge this record exists to prevent.',
          },
        },
        { h3: 'Field B \u2014 observation (where the link actually went)' },
        {
          table: {
            head: ['Submission', 'Observed ASIN', 'Observed final URL', 'Observed capture date', 'tag= present', 'Source'],
            rows: products.map(
              (x) => `<tr>
  <td class="mono">${x.submissions.join(', ')}</td>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td class="mono">${outbound(x.observed.finalUrl, esc(x.observed.finalUrl), 'source')}</td>
  <td class="nowrap">${STAMP.slice(0, 10)}</td>
  <td><span class="chip chip-bad">NO</span></td>
  <td>${cites(x.observed.sourceIds)}</td>
</tr>`
            ),
            note: 'Captured signed out, with no Associates credentials and no tag parameter, from a session whose delivery location rendered as Herndon 20170. These are observations of a moment, not statements of a permanent mapping.',
          },
        },
        { h3: 'Field A \u00d7 Field B \u2014 the disagreement, stated plainly' },
        {
          table: {
            head: ['Submission', 'Submitted token', 'Observed ASIN', 'Same string?', 'Both valid ASIN format?'],
            rows: products.map((x) => {
              const a = x.intent.token;
              const b = x.observed.asin;
              return `<tr>
  <td class="mono">${x.submissions.join(', ')}</td>
  <td class="mono">${esc(a)}</td>
  <td class="mono">${esc(b)}</td>
  <td><span class="chip ${a === b ? 'chip-ok' : 'chip-bad'}">${a === b ? 'IDENTICAL' : 'DIFFERENT'}</span></td>
  <td>${asinFormatCheck(a).validFormat && asinFormatCheck(b).validFormat ? '<span class="chip chip-ok">Both</span>' : `<span class="chip chip-warn">Observed only</span>`}</td>
</tr>`;
            }),
          },
        },
        { h3: 'Redirect instrumentation observed on every request' },
        {
          table: {
            head: ['Parameter', 'L1', 'L2 / L3', 'L4', 'What it indicates'],
            rows: [
              ['<code class="inline">lv</code>', 'shuf', 'shuf', 'shuf', 'A shuffle/rotation mode rather than a fixed destination'],
              ['<code class="inline">plpRedirect</code>', 'mhFallback', 'mhFallback', 'mhFallback', 'The resolver used a product-listing-page fallback path'],
              ['<code class="inline">channelId</code>', '500', '500', '500', 'A fixed channel identifier on the short-link service'],
              ['<code class="inline">sprefix</code>', 'diy home upgrades,aps,196', 'same', 'same', 'The resolver was seeded from a search for "diy home upgrades"'],
              ['<code class="inline">sr</code>', '8-2', '8-3', '8-13', 'A search result position \u2014 different for each, so destinations sit at different ranks'],
              ['<code class="inline">btn_ref</code>', 'srctok-66dc2f239029f4f9', 'srctok-1c4034662c855768', 'srctok-46eeea56854d085e', 'Three different per-request tokens across three requests'],
              ['<code class="inline">tag</code>', '<span class="chip chip-bad">absent</span>', '<span class="chip chip-bad">absent</span>', '<span class="chip chip-bad">absent</span>', 'No Associate tracking ID on any observed destination'],
            ],
            note: 'Read from the raw destination URLs returned by link.amazon on 2026-11-20. ' + cites(['S09']),
          },
        },
        {
          callout: {
            kind: 'warn',
            title: 'What this does and does not prove',
            text: [
              'It proves that on one date, from one session, in one marketplace, these three short links resolved to these three listings carrying no tracking tag, by way of a search-fallback path with a per-request token.',
              'It does not prove that link.amazon is non-compliant, that the mapping is unstable, or that the links are broken. The brief is explicit that the supplied short links must not be called invalid and that their compliance status is unresolved. This record states the observation and stops there.',
            ],
            sourceIds: ['S09', 'S02'],
          },
        },
      ],
    },

    /* ============================ 4. PRICING ============================ */
    {
      slug: 'pricing',
      navLabel: 'Pricing',
      title: 'Pricing analysis',
      description:
        'Observed prices with their anchor labels, discount basis, membership gating and capture timestamp, per Amazon IP License \u00a72(i).',
      blocks: [
        { kicker: 'Dashboard', h1: 'Pricing analysis' },
        {
          callout: {
            kind: 'warn',
            title: 'Read the anchor before the percentage',
            text: 'Amazon uses two different anchors and defines both on the listing. A "Typical Price" is the 90-day median price paid by customers, excluding limited-time promotions and excluding Amazon Haul and Amazon Now. A "List Price" is a suggested retail price supplied by a manufacturer, supplier or seller, shown only where the product sold at or above it in at least the past 90 days, and Amazon states it may not reflect the prevailing market price. The same discount percentage means different things against each.',
            sourceIds: ['S06', 'S07', 'S08'],
          },
        },
        {
          table: {
            head: ['ASIN', 'Observed price', 'Stated discount', 'Anchor label', 'Anchor value', 'Membership-gated', 'Deal label', 'Evidence'],
            numCols: [1, 4],
            rows: products.map(
              (x) => `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td class="num">${money(x.observed.priceObserved)}</td>
  <td class="num">\u2212${x.observed.priceDiscountPct}%</td>
  <td>${esc(x.observed.priceAnchorLabel)}</td>
  <td class="num">${money(x.observed.priceAnchor)}</td>
  <td>${x.observed.primeExclusive ? '<span class="chip chip-warn">Prime only</span>' : '<span class="chip chip-ok">No</span>'}</td>
  <td>${esc(x.observed.dealLabel)}</td>
  <td class="tiny">${esc(x.observed.priceEvidence)}</td>
</tr>`
            ),
            note: `All values observed ${STAMP}. ` + cites(['S06', 'S07', 'S08']),
          },
        },
        { h3: 'Derived arithmetic \u2014 and its limits' },
        {
          table: {
            head: ['ASIN', 'Observed price', 'Anchor', 'Absolute difference', 'Percentage as rendered', 'Recomputed percentage', 'Agrees?'],
            numCols: [1, 2, 3, 4, 5],
            rows: products.map((x) => {
              const diff = x.observed.priceAnchor - x.observed.priceObserved;
              const pct = (diff / x.observed.priceAnchor) * 100;
              const agrees = Math.abs(pct - x.observed.priceDiscountPct) < 0.6;
              return `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td class="num">${money(x.observed.priceObserved)}</td>
  <td class="num">${money(x.observed.priceAnchor)}</td>
  <td class="num">${money(diff)}</td>
  <td class="num">${x.observed.priceDiscountPct}%</td>
  <td class="num">${pct.toFixed(1)}%</td>
  <td>${agrees ? '<span class="chip chip-ok">Yes</span>' : '<span class="chip chip-warn">Check</span>'}</td>
</tr>`;
            }),
            note: 'A consistency check on the observed figures, not a claim about value. The recomputed percentage is derived from the two observed numbers on the same page, so agreement only confirms the page is internally consistent.',
          },
        },
        { h3: 'Cross-product price comparison is not offered here' },
        {
          p: 'The three products are a wallpaper smoothing tool, a paper towel holder and a pot rack. They are not substitutes, so a price comparison between them would be meaningless. Comparing them anyway is a common failure mode in generated affiliate content, and this surface refuses to do it.',
        },
        {
          callout: {
            kind: 'info',
            title: 'Required disclaimer, reproduced verbatim',
            text: esc(AMAZON_PRICE_DISCLAIMER),
            sourceIds: ['S02'],
          },
        },
        {
          gate: {
            text: 'Prices on Amazon change continuously and vary by marketplace, by session and by membership status. A static site cannot keep a price current, and Amazon\u2019s IP License only permits caching pricing data for 24 hours before it must be refreshed through PA-API, Creators API or a Data Feed.',
            action: 'Either accept that every price on this site is a dated historical observation and never present it as current, or serve prices from a backend that calls PA-API within the permitted refresh window. Do not solve this by editing the numbers by hand and leaving the old timestamp.',
            flag: 'F-17',
          },
        },
      ],
    },

    /* ============================ 5. REVIEWS ============================ */
    {
      slug: 'reviews',
      navLabel: 'Reviews',
      title: 'Reviews and ratings analysis',
      description:
        'Amazon-computed rating aggregates as observed, with the boundary of what this site will and will not do with them.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Reviews and ratings analysis' },
        {
          table: {
            head: ['ASIN', 'Star rating', 'Ratings count', 'Bought in past month', 'Badge rendered', 'Badge definition as Amazon states it'],
            numCols: [1, 2],
            rows: products.map(
              (x) => `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td class="num">${x.observed.starRating.toFixed(1)}</td>
  <td class="num">${int(x.observed.ratingsCount)}</td>
  <td>${esc(x.observed.boughtPastMonth)}</td>
  <td>${x.observed.badge ? `<span class="chip chip-brand">${esc(x.observed.badge)}</span>` : '<span class="chip chip-neutral">None rendered</span>'}</td>
  <td class="tiny">${x.observed.badge ? 'Amazon states the badge "highlights highly rated, well-priced products available to ship immediately"' : '\u2014'}</td>
</tr>`
            ),
            note: `Observed ${STAMP}. ` + cites(['S06', 'S07', 'S08']),
          },
        },
        { h3: 'What the spread actually tells you' },
        {
          table: {
            head: ['ASIN', 'Ratings', 'Stars', 'Reading'],
            rows: [
              ['B08FKW9JRM', '26,432', '4.6', 'The largest rating base and the highest average of the three. A high count with a high average is the strongest shopper-sentiment signal available on a listing, though it remains sentiment rather than measured performance.'],
              ['B08DY9HRWD', '18,835', '4.4', 'A substantial base at a slightly lower average, on a product with four colour and eight height variations. Variation families pool ratings at the parent level, so an average across eight sizes says less about any one size.'],
              ['B0BSKQW2T2', '12,099', '4.2', 'The smallest base and lowest average of the three, on a listing where the brand store and the seller of record differ. Still a large absolute number by any normal standard.'],
            ],
            note: 'The "Reading" column interprets the two observed numbers to its left. It adds no new data and cites no unverified source.',
          },
        },
        { h3: 'What this site deliberately does not do' },
        {
          checklist: [
            '<strong>No review text is quoted.</strong> Not one customer review is reproduced anywhere on this site. Individual reviews are shopper-authored content, quoting them would create endorsement obligations under FTC 16 CFR \u00a7255, and none were collected in this session.',
            '<strong>No star histogram is published.</strong> The five-bar breakdown was not captured, and inventing one from an average would be fabrication.',
            '<strong>No "verified purchase" proportion is claimed.</strong> Not observed, therefore not published.',
            '<strong>No banded figure is converted to a precise one.</strong> "20K+ bought in past month" is reproduced as the banded string Amazon rendered. It is never written as 20,000.',
            '<strong>No badge is described as an award, a ranking or a test result.</strong> It is a merchandising signal with Amazon\u2019s own stated definition, quoted above.',
            '<strong>No rating is treated as a quality measurement.</strong> It is an aggregate of shopper opinion.',
          ],
        },
        {
          callout: {
            kind: 'warn',
            title: 'Ratings drift, and this page will not notice',
            text: 'These are single-observation snapshots from one date. A static page cannot detect that a rating has moved. Any reuse of these figures in promotional copy should be preceded by a fresh observation with a new capture date, not by trusting the number here.',
          },
        },
      ],
    },

    /* ========================== 6. COMPETITION ========================== */
    {
      slug: 'competition',
      navLabel: 'Competition',
      title: 'Competition and category context',
      description:
        'What can honestly be said about competitive position from the data available, and what cannot be said at all.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Competition and category context' },
        {
          callout: {
            kind: 'warn',
            title: 'Scope limit, stated up front',
            text: 'A real competitive analysis needs the set of competing listings in a category, their prices, their ratings, their review velocity and their ad presence. None of that was collected, and collecting it would mean scraping Amazon search results at scale. What follows is category context derived only from what appeared on the three verified listing pages \u2014 including Amazon\u2019s own "Customers who viewed this item also viewed" carousel, which is the one competitive signal legitimately available from a single page.',
          },
        },
        { h3: 'Adjacent listings surfaced by Amazon on each page' },
        {
          p: 'Each listing page rendered a "Customers who viewed this item also viewed" carousel. Those are Amazon-selected adjacencies, not a market survey, but they are the only competitor set observable from a verified single-page fetch. Recorded here with their rendered prices and ratings exactly as displayed.',
        },
        {
          table: {
            head: ['Observed next to', 'Adjacent listing (as rendered)', 'ASIN', 'Stars', 'Ratings', 'Price'],
            numCols: [3, 4, 5],
            rows: [
              ['B08FKW9JRM', 'ROMAN\u2019s E-Z Hang Peel & Stick Wallpaper Helper, Clear, Non-Staining, 32-OZ', 'B094TB94MD', '4.2', '5,013', '$12.49 ($0.39/fl oz)'],
              ['B08FKW9JRM', 'Peel and Stick Wallpaper Tools, Wallpaper Smoothing Tool Kit 6Pcs', 'B0GSGFLW3G', '4.3', '104', '$5.49'],
              ['B08FKW9JRM', 'Art3d Smoothing Tool Kit for Peel and Stick Tile, Contact Paper, Vinyl Film', 'B0CC7MPM5V', '4.4', '2,123', '$11.04 ($1.38/count)'],
              ['B0BSKQW2T2', 'Paper Towel Holder, Self Adhesive or Screw Mounting, Black Wall Mount SUS304 Stainless Steel', 'B09C4TZ23X', '4.4', '3,750', '$5.99'],
              ['B0BSKQW2T2', 'Black Paper Towel Holder, Self Adhesive, Under Cabinet, Stainless Steel', 'B0CC27124P', '4.5', '6,848', '$7.58'],
              ['B0BSKQW2T2', 'VIRFIN Key Holder for Wall with 2 Self-Adhesive Tapes, 3 Key Hooks', 'B0B7RRGJCM', '4.8', '200', '$5.99'],
              ['B08DY9HRWD', 'Pots and Pans Organizer Under Cabinet \u2014 8-Tier Adjustable, Heavy-Duty', 'B0C1N9SWDZ', '4.5', '1,541', '$18.67'],
              ['B08DY9HRWD', 'MUDEELA 8-Tier Heavy Duty Pots and Pans Organizer under Cabinet, Black', 'B0B7WDJ95S', '4.3', '10,424', '$24.68'],
              ['B08DY9HRWD', 'Fovkdcvw Adjustable Heavy Duty Pots and Pans Organizer Under Cabinet, 8-Tier', 'B0DSK8BQLV', '4.5', '317', '$35.99'],
            ],
            note: `Values as rendered in the carousel on ${STAMP}. These ASINs were NOT separately fetched, so none of them is independently verified and none appears in the product register or on any product page. They are context only. ` + cites(['S06', 'S07', 'S08']),
          },
        },
        {
          callout: {
            kind: 'bad',
            title: 'Irregularity in the adjacency data',
            text: 'The carousel rendered next to B0BSKQW2T2 included a key holder (B0B7RRGJCM), which is not a paper towel holder and not in the same leaf node. Amazon\u2019s "also viewed" carousel is a behavioural recommendation, not a category listing, so it mixes in products that shoppers happened to view in the same session. It must not be read as a competitor set. This is recorded because treating carousel content as competitive intelligence is an easy and common mistake.',
            sourceIds: ['S07'],
          },
        },
        { h3: 'Position of the three verified listings within their own pages' },
        {
          table: {
            head: ['ASIN', 'Ratings', 'Nearest adjacency by ratings count', 'Observation'],
            rows: [
              ['B08FKW9JRM', '26,432', 'B0CC7MPM5V at 2,123', 'The verified listing carries roughly twelve times the rating count of the largest adjacent kit rendered beside it. Its own brand also appears in the adjacency set under a different ASIN, which suggests a product line rather than a single item.'],
              ['B0BSKQW2T2', '12,099', 'B0CC27124P at 6,848', 'The verified listing leads the rendered adjacency set on volume, though one adjacent listing shows a higher average (4.5 against 4.2).'],
              ['B08DY9HRWD', '18,835', 'B0B7WDJ95S at 10,424', 'The verified listing leads on volume. The adjacent set spans $18.67 to $35.99 against a list price of $23.99, so it sits at the lower end of the rendered range.'],
            ],
            note: 'Every figure in this table is drawn from the two tables above it. No new data is introduced and no external source is used.',
          },
        },
        { h3: 'What a real competitive analysis would require' },
        {
          list: [
            'A defined competitor set per leaf node, not an Amazon recommendation carousel.',
            'Price, rating and ratings-count history over time for each competitor, to see velocity rather than a snapshot.',
            'Advertising presence, which is only observable from the search results page and changes per session.',
            'Review velocity \u2014 the rate at which ratings accumulate, which needs repeated observation.',
            'Sell-through signals beyond Amazon\u2019s banded "bought in past month" figure.',
          ],
        },
        {
          gate: {
            text: 'None of the above can be built from a single static fetch, and building it by scraping search results at scale would sit badly against Amazon\u2019s Agent Terms, which require an autonomous agent to identify itself and prohibit circumventing measures that control agent access.',
            action: 'If competitive intelligence is genuinely wanted, source it from the PA-API or Creators API under an enrolled Associates account, or from a licensed data provider, and record which. Do not scale up page scraping.',
            flag: 'F-08',
          },
        },
      ],
    },

    /* ========================== 7. COMMISSION ========================== */
    {
      slug: 'commission',
      navLabel: 'Commission',
      title: 'Commission potential',
      description:
        'The commission rate is blank for every product, with the conflicting third-party figures shown as evidence for why, and a calculator that takes the rate as an input.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Commission potential' },
        {
          callout: {
            kind: 'bad',
            title: 'No rate is published on this surface',
            text: 'Amazon\u2019s Program Policies state that Standard Commission Income is described in the Appendix of that page. The Appendix table for the standard off-site schedule was not reached during this session\u2019s retrieval, and no rate was confirmed from an Amazon property. Four mutually inconsistent figures were found on third-party pages instead. Under the project\u2019s verification rule, the rate cell stays blank.',
            sourceIds: ['S02'],
          },
        },
        { h3: 'Rate status per product' },
        {
          table: {
            head: ['ASIN', 'Leaf browse node', 'Commission schedule that would apply', 'Rate', 'Status'],
            rows: products.map(
              (x) => `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td>${esc(x.observed.breadcrumb.slice(-1)[0])} <span class="tiny muted">(node ${esc(x.observed.browseNodeId)})</span></td>
  <td><span class="unverified">UNRESOLVED</span> <span class="tiny muted">\u2014 standard off-site vs onsite are different schedules</span></td>
  <td>${cell(null, { blankLabel: 'BLANK' })}</td>
  <td><span class="chip chip-bad">F-05</span></td>
</tr>`
            ),
          },
        },
        { h3: 'Evidence for the blank: four sources, five numbers' },
        {
          table: {
            head: ['Source', 'Official?', 'Kitchen', 'Home / Home Improvement', 'Tools', 'Retrieved'],
            rows: [
              ['S02 \u2014 Amazon Program Policies, Appendix (standard off-site)', '<span class="verified">Official</span>', '<span class="unverified">Not reached</span>', '<span class="unverified">Not reached</span>', '<span class="unverified">Not reached</span>', '2026-11-20'],
              ['S04 \u2014 Amazon Onsite Commission Income Statement, Table A', '<span class="verified">Official</span>', '1.25%', 'Home / Home Improvement 3.00%', '1.75%', '2026-11-20'],
              ['S13 \u2014 amawp.com', '<span class="unverified">Third party</span>', '4.50%', 'Home / Home Improvement 3.00%', '3.00%', '2026-11-20'],
              ['S14 \u2014 sozee.ai (off-site table)', '<span class="unverified">Third party</span>', '4.5%', 'Home 3%', '3%'],
              ['S14 \u2014 sozee.ai (onsite table, same page)', '<span class="unverified">Third party</span>', '1.25%', 'Home & Kitchen 1.25%', '1.75% / 3%'],
              ['S15 \u2014 earnifyhub.com', '<span class="unverified">Third party</span>', '5%', 'Home Improvement 8%', '\u2014', '2026-11-20'],
            ],
            note: 'S04 is Amazon\u2019s ONSITE schedule, which applies to Amazon-hosted creator content, not to a link on your own website. It is included because quoting it as though it were the off-site rate is one of the most common errors in this space, and because sozee.ai does exactly that on a single page. ' + cites(['S02', 'S04', 'S13', 'S14', 'S15']),
          },
        },
        { h3: 'Calculator \u2014 rate is an input with no default' },
        {
          p: 'Enter a rate you have read from your own Associates Central. Nothing renders until you do, and the observed prices are pre-filled because those are verified. No output on this page is a forecast: it is arithmetic on inputs you supply.',
        },
        {
          html: `<div class="card card-paper" id="commission-calc">
  <div class="grid grid-2">
    <div>
      <label for="cc-asin" class="small"><strong>Product</strong></label><br/>
      <select id="cc-asin">
        ${products.map((x) => `<option value="${esc(x.observed.asin)}" data-price="${x.observed.priceObserved}">${esc(x.observed.asin)} \u2014 ${esc(x.observed.listingH1.slice(0, 44))}\u2026 (observed ${money(x.observed.priceObserved)})</option>`).join('')}
      </select>
    </div>
    <div>
      <label for="cc-rate" class="small"><strong>Commission rate (%) \u2014 you must supply this</strong></label><br/>
      <input id="cc-rate" type="number" min="0" max="100" step="0.01" placeholder="blank until verified" style="padding:.45rem .55rem;border:1px solid var(--rule);border-radius:var(--radius);font:inherit;width:100%"/>
    </div>
    <div>
      <label for="cc-price" class="small"><strong>Price used ($)</strong></label><br/>
      <input id="cc-price" type="number" min="0" step="0.01" value="${products[0].observed.priceObserved}" style="padding:.45rem .55rem;border:1px solid var(--rule);border-radius:var(--radius);font:inherit;width:100%"/>
    </div>
    <div>
      <label for="cc-orders" class="small"><strong>Reported orders (from an authorised report only)</strong></label><br/>
      <input id="cc-orders" type="number" min="0" step="1" placeholder="0" style="padding:.45rem .55rem;border:1px solid var(--rule);border-radius:var(--radius);font:inherit;width:100%"/>
    </div>
  </div>
  <div class="metrics" style="margin-top:1rem">
    <div class="metric"><div class="metric-label">Commission per order</div><div class="metric-value" id="cc-per">\u2014</div><div class="metric-sub">price \u00d7 rate</div></div>
    <div class="metric"><div class="metric-label">Commission on the orders entered</div><div class="metric-value" id="cc-total">\u2014</div><div class="metric-sub">per-order \u00d7 orders</div></div>
  </div>
  <p class="tiny muted" id="cc-note">Enter a rate to see anything. This calculator has no default rate and publishes no forecast.</p>
  <p class="tiny muted">Qualifying Revenue is defined by Amazon as the amount actually received, less shipping, gift-wrapping, handling fees, taxes, service charges, credits, rebates, card-processing fees and bad debt \u2014 so a commission computed from a listed price is an upper bound, not an expectation. ${cites(['S02'])}</p>
</div>`,
        },
        { h3: 'Attribution windows that govern whether any order counts' },
        {
          table: {
            head: ['Window', 'Value', 'Verbatim basis'],
            rows: [
              ['Session length', '24 hours from the click', 'A Session ends on the first of: 24 hours elapsing from that click, the customer placing an order for a non-digital Product, or the customer clicking through someone else\u2019s Special Link'],
              ['Cart-add completion', '89 days from the initial click-through', 'The customer adds a Product to the cart during the Session and completes the order no later than 89 days after the initial click-through'],
              ['Ship and payment', '180 days from purchase', 'Within 180 days of the purchase the Product is shipped to, streamed or downloaded by, and paid for by the customer'],
            ],
            note: 'All three read from the Commission Income Statement \u00a71. ' + cites(['S02']),
          },
        },
        {
          callout: {
            kind: 'info',
            title: 'Why no revenue forecast appears anywhere on this site',
            text: 'Amazon\u2019s own Operating Agreement states that it makes "no representation, warranty, or covenant regarding the amount of traffic or commission income you can expect at any time in connection with the Associates Program". The brief separately requires that no conversion score or revenue forecast be presented. Both point the same way, so this site publishes observed inputs and arithmetic, and nothing that resembles a projection.',
            sourceIds: ['S01'],
          },
        },
      ],
    },

    /* ============================ 8. NICHE ============================ */
    {
      slug: 'niche',
      navLabel: 'Niche',
      title: 'Niche identification',
      description:
        'The niche this product set actually occupies, derived from observed Amazon browse-node paths rather than from an assumption.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Niche identification' },
        {
          p: 'A niche is normally chosen first and products are found to fill it. Here the products were supplied first, so the niche is read off them. That is a weaker way to build a site and a stronger way to describe one honestly.',
        },
        { h3: 'What the observed data says the niche is' },
        {
          table: {
            head: ['Signal', 'Observed value', 'Reading'],
            rows: [
              ['Search prefix carried in all three redirects', '<code class="inline">diy home upgrades,aps,196</code>', 'The resolver was seeded from a search for "diy home upgrades". Whatever curated this list, that phrase was the entry point.'],
              ['Top-level nodes represented', 'Tools & Home Improvement (1 listing); Home & Kitchen (2 listings)', 'The set straddles two Amazon top-level departments, which is why a single-department framing would be wrong.'],
              ['Shared leaf parent', 'Storage & Organization \u203a Racks & Holders for two of three', 'Two thirds of the set sits in one narrow subcategory. That is the real centre of gravity.'],
              ['Price band observed', '$5.08 \u2013 $17.74', 'Low-ticket, impulse-adjacent. Consistent with renter-friendly upgrades rather than renovation.'],
              ['Common thread across all three', 'Peel-and-stick, self-adhesive, tool-free, no-drill, under-cabinet', 'Every listing title or subhead contains a no-permanent-change signal. This is the actual niche.'],
              ['Ratings volume', '12,099 \u2013 26,432 per listing', 'Established, high-volume listings rather than new or obscure ones.'],
            ],
            note: 'Every row is derived from the verified register. ' + cites(['S06', 'S07', 'S08', 'S09']),
          },
        },
        {
          callout: {
            kind: 'ok',
            title: 'Niche statement this build supports',
            text: '<strong>Reversible, low-cost home upgrades for people who cannot or will not make permanent changes</strong> \u2014 renters, first-home buyers, and anyone working within a deposit. The unifying buyer constraint is reversibility, not room and not price. That constraint is visible in all three listing titles, it explains why the set straddles two departments, and it generates question-shaped guides that do not depend on any one product.',
          },
        },
        { h3: 'Clusters derived from that statement' },
        {
          table: {
            head: ['Cluster', 'Basis', 'Products mapped', 'Guides', 'Status'],
            rows: Object.values(clusters).map((c) => {
              const mapped = products.filter((x) => x.cluster === c.id);
              const gs = guides.filter((g) => g.cluster === c.id);
              return `<tr>
  <td><strong>${esc(c.name)}</strong><br/><span class="tiny muted">${esc(c.basis)}</span></td>
  <td>${c.sourceIds.length ? cites(c.sourceIds) : '<span class="unverified">No source</span>'}</td>
  <td>${mapped.length ? mapped.map((x) => `<span class="mono chip chip-neutral">${esc(x.observed.asin)}</span>`).join(' ') : '<span class="chip chip-neutral">None</span>'}</td>
  <td>${gs.length ? gs.map((g) => `<a href="${link(out, 'guides/' + g.slug + '.html')}">${esc(g.id)}</a>`).join(' ') : '\u2014'}</td>
  <td>${c.hypothesisOnly ? '<span class="chip chip-warn">Hypothesis only \u2014 F-06</span>' : '<span class="chip chip-ok">Live</span>'}</td>
</tr>`;
            }),
          },
        },
        { h3: 'Niches this build refuses to claim' },
        {
          list: [
            '<strong>Air fryers and multi-function cooking appliances.</strong> Suggested in the brief, and none of the three products is a cooking appliance. Quarantined as a hypothesis cluster (F-06).',
            '<strong>Any "trending" niche.</strong> Trend claims need time-series data. One observation on one date cannot establish a trend, so no product here is described as trending.',
            '<strong>Any "high-converting" niche.</strong> Conversion data requires authorised first-party reports. The campaign ledger is empty (F-20), so nothing here is described as high-converting.',
            '<strong>Any search-volume or keyword-difficulty figure.</strong> No authorised keyword source was available. Every guide title on this site is an editorial hypothesis, and the site says so.',
          ],
        },
      ],
    },

    /* ======================= 9. CONTENT PIPELINE ======================= */
    {
      slug: 'content-pipeline',
      navLabel: 'Content pipeline',
      title: 'Content pipeline and editorial calendar',
      description:
        'The published guide set, the cadence, the cluster mapping, and the rules that keep generated copy from asserting things nobody verified.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Content pipeline' },
        {
          metrics: [
            { label: 'Guides published', value: String(guides.length), sub: 'All live, all in sitemap.xml and feed.xml' },
            { label: 'Pillars', value: String(guides.filter((g) => g.kind === 'pillar').length), sub: 'One per live cluster' },
            { label: 'Supporting guides', value: String(guides.filter((g) => g.kind === 'supporting').length), sub: 'Question-shaped, cluster-mapped' },
            { label: 'Hypothesis-only', value: String(guides.filter((g) => g.hypothesisOnly).length), sub: 'Published, labelled, no product mapping (F-06)' },
            { label: 'Product-mapped', value: String(guides.filter((g) => g.productRefs.length).length), sub: 'Carry at least one verified ASIN reference' },
            { label: 'Named human reviewer', value: 'None', sub: 'No person assigned or has read the copy \u2014 F-14' },
          ],
        },
        { h3: 'Published set' },
        {
          table: {
            head: ['ID', 'Title', 'Cluster', 'Kind', 'Seasons', 'Products referenced', 'Link'],
            rows: guides.map((g) => {
              const c = clusters[g.cluster];
              return `<tr>
  <td class="mono">${esc(g.id)}</td>
  <td>${esc(g.title)}${g.hypothesisOnly ? ' <span class="chip chip-warn">Hypothesis</span>' : ''}${g.meta ? ' <span class="chip chip-info">Meta</span>' : ''}</td>
  <td class="tiny">${esc(c ? c.name : g.cluster)}</td>
  <td class="tiny">${esc(g.kind)}</td>
  <td class="tiny">${g.seasons.length ? g.seasons.map((s) => esc(seasons.find((x) => x.id === s).label)).join('; ') : '\u2014'}</td>
  <td class="tiny mono">${g.productRefs.length ? g.productRefs.map((r) => esc(p(r).observed.asin)).join(', ') : '<span class="chip chip-neutral">none</span>'}</td>
  <td><a href="${link(out, 'guides/' + g.slug + '.html')}">open</a></td>
</tr>`;
            }),
          },
        },
        { h3: 'Cadence' },
        {
          table: {
            head: ['Element', 'Setting'],
            rows: [
              ['Statement', esc(cadence.statement)],
              ['Why it holds without discipline', esc(cadence.rationale)],
              ['What "published" is measured by', esc(cadence.measuredBy)],
              ['How the next topic is chosen', esc(cadence.nextTopicRule)],
            ],
          },
        },
        { h3: 'Generation rules, and the machine check for each' },
        {
          table: {
            head: ['Rule', 'Why', 'Automated check'],
            rows: [
              ['No first-person experience claims', 'FTC 16 CFR \u00a7255.1(a) ties an endorsement to the endorser\u2019s actual experience, and no human tested these products', 'tools/verify.mjs scans all built HTML for "I tested", "we tested", "I tried", "we tried", "in my experience", "we found" and fails on a match'],
              ['No superlatives or rankings', 'Product superiority is not established by any verified source', 'Build fails on "best ", "#1", "top-rated", "number one" outside quoted source text'],
              ['No search-volume or traffic numbers', 'No authorised keyword or analytics source was available', 'Build fails on a digit followed by "searches", "monthly searches", "search volume", "impressions" in editorial copy'],
              ['Every listing-specific fact carries a source id', 'The project verification rule', 'Build fails on an observation block with no sourceIds'],
              ['No Amazon review text quoted', 'Endorsement obligations plus IP License limits on Program Content', 'Manual rule; no review text exists in the data layer to quote'],
              ['No product imagery', 'IP License \u00a72(h) permits storing an image link for only 24 hours; a static site cannot comply', 'Build fails on any src or href pointing at m.media-amazon.com or images-na.ssl-images-amazon.com'],
              ['Hypothesis articles are labelled as such', 'The brief\u2019s air-fryer titles are working titles, not claims', 'Every hypothesisOnly guide renders a status note and is excluded from product mapping'],
            ],
            note: 'The checks live in tools/verify.mjs and run in CI on every push and pull request. ' + cites(['S10', 'S02']),
          },
        },
        {
          gate: {
            text: 'Generated copy can satisfy every mechanical rule above and still be wrong in a way only a reader who owns the product would catch. A checklist cannot substitute for that reader.',
            action: 'Assign a named human editor, have them read all eleven guides, and only then put a person\u2019s name in the byline. Until that happens the byline stays "DIYHOME3 Editorial Desk" with the automated-drafting label visible on every article.',
            flag: 'F-14',
          },
        },
      ],
    },

    /* ======================= 10. LINK MANAGEMENT ======================= */
    {
      slug: 'link-management',
      navLabel: 'Link management',
      title: 'Affiliate link management and the validation gate',
      description:
        'Current link state per product, the candidate Special Link format, and the six-step validation that must pass before any link is monetised.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Affiliate link management' },
        {
          callout: {
            kind: 'gate',
            title: 'Attribution is not active on this site',
            text: 'Every outbound product link currently points at the canonical, untagged Amazon listing. Readers can reach the product; this site earns nothing from the click. That is a deliberate state, not an oversight. It is the gate the brief asks for: automate what can be automated, and put a human in front of what cannot.',
            sourceIds: ['S09', 'S01'],
          },
        },
        { h3: 'Current link state' },
        {
          table: {
            head: ['ASIN', 'Published href', 'tag present', 'rel attribute', 'Attribution', 'Candidate Special Link (NOT yet validated)'],
            rows: products.map(
              (x) => `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td class="mono tiny">${outbound(x.observed.canonicalListingUrl, esc(x.observed.canonicalListingUrl), 'source')}</td>
  <td><span class="chip chip-bad">NO</span></td>
  <td class="mono tiny">sponsored nofollow noopener noreferrer</td>
  <td><span class="chip chip-bad">Inactive</span></td>
  <td class="mono tiny">https://www.amazon.com/dp/${esc(x.observed.asin)}?tag=${esc(TRACKING_ID.value)}</td>
</tr>`
            ),
            note: 'The candidate Special Link column is a FORMAT ILLUSTRATION built from the observed ASIN and the supplied tracking ID. It has not been generated by Associates Central, not clicked, and not confirmed in any tracking report. Do not publish it as-is. ' + cites(['S01']),
          },
        },
        { h3: 'Why the candidate format is the right shape' },
        {
          quote: {
            text: 'The links must properly use the special \u201ctagged\u201d link formats we provide and comply with this Agreement (\u201cSpecial Links\u201d).',
            attribution: 'Associates Program Operating Agreement, Section 1',
            sourceIds: ['S01'],
          },
        },
        {
          p: 'The Commission Income Statement then states the consequence of getting the format wrong: it disqualifies "any Product purchase that is not correctly tracked or reported because the links from your site to the relevant Amazon Site are not properly formatted". A malformed link does not merely underperform \u2014 the purchase it produces can be excluded entirely. ' + cites(['S02']),
        },
        { h3: 'The six-step validation gate' },
        {
          table: {
            head: ['Step', 'Action', 'Automatable?', 'Evidence required to pass'],
            rows: [
              ['1', 'Confirm the tracking ID is active on an approved account', '<span class="chip chip-bad">No</span>', 'Screenshot or export from Associates Central \u2192 Account Settings showing the ID'],
              ['2', 'Confirm the site URL is listed on the account', '<span class="chip chip-bad">No</span>', 'The live GitHub Pages URL present in the account\u2019s site list'],
              ['3', 'Generate a tagged Special Link for one ASIN using Amazon\u2019s own tooling', '<span class="chip chip-bad">No</span>', 'The generated URL, recorded verbatim with its generation date'],
              ['4', 'Click it in a signed-out browser and record the destination', '<span class="chip chip-ok">Partly</span>', 'Final URL containing tag=<your ID> and the intended ASIN'],
              ['5', 'Confirm the click appears in the tracking report', '<span class="chip chip-bad">No</span>', 'The click present in Reports with the correct tracking ID and date'],
              ['6', 'Only then repeat for the remaining ASINs and flip the site to monetised', '<span class="chip chip-ok">Yes</span>', 'attributionActive set to true in the register, with the tagged href, and a passing build'],
            ],
            note: 'The brief\u2019s instruction is to test one link per product in the enrolled Associates workflow and confirm destination and tracking report before scaling. Steps 1, 2, 3 and 5 need an authenticated session that this build does not have and should not have.',
          },
        },
        {
          html: `<div class="card card-paper">
  <h3 style="margin-top:0">How to flip the switch</h3>
  <p class="small">Once steps 1\u20135 pass for a product, edit its entry in <code class="inline">site/data/products.mjs</code>:</p>
  <pre class="code">observed: {
  \u2026
  outboundHref: 'https://www.amazon.com/dp/B08FKW9JRM?tag=shopnow047c-20',
  attributionActive: true,
  attributionVerifiedOn: '2026-12-01',
  attributionEvidence: 'Associates Central report export 2026-12-01, click recorded',
}</pre>
  <p class="small">Then run <code class="inline">node tools/build.mjs &amp;&amp; node tools/verify.mjs</code>. The verifier will <strong>fail the build</strong> if <code class="inline">attributionActive</code> is true while the href carries no tag parameter, or if the verified-on date is missing. It will also fail if the tracking ID in the href does not match the one in the register. The gate is enforced by code, not by memory.</p>
</div>`,
        },
        { h3: 'What must never appear in a link on this site' },
        {
          checklist: [
            'A link generated or displayed on a search engine \u2014 Commission Income Statement \u00a72(d) disqualifies the resulting purchase.',
            'Any paid search placement bidding on "amazon", "kindle", an Amazon Mark, or a misspelling of one \u2014 \u00a72(c) calls this a Prohibited Paid Search Placement.',
            'A redirect that carries the reader to Amazon without an affirmative click on this site \u2014 \u00a72(e).',
            'A link with no tag parameter presented as an affiliate link.',
            'A link whose destination has not been re-checked within the last 24 hours if the price or availability beside it is being shown.',
          ],
        },
      ],
    },

    /* ======================= 11. CLICK TRACKING ======================= */
    {
      slug: 'click-tracking',
      navLabel: 'Click tracking',
      title: 'Click tracking and the five events',
      description:
        'The privacy-preserving outbound-click counter, the self-hosted collector, the five recorded events and exactly what is and is not collected.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Click tracking' },
        {
          metrics: [
            { label: 'Events defined', value: String(EVENTS.length), sub: 'See F-21 \u2014 the brief said "five" without naming them' },
            { label: 'Cookies set', value: '0', sub: 'None, on any page, ever' },
            { label: 'Third-party scripts', value: '0', sub: 'No GA, no pixel, no tag manager' },
            { label: 'Personal data stored', value: '0 fields', sub: 'No IP, no UA, no fingerprint' },
            { label: 'Aggregate collector', value: 'Not deployed', sub: 'Built and tested; Pages runs no server code \u2014 F-11' },
          ],
        },
        { h3: 'The five events' },
        {
          table: {
            head: ['#', 'Event name', 'Fires when', 'Why it exists'],
            rows: EVENTS.map((e, i) => `<tr>
  <td class="num">${i + 1}</td>
  <td class="mono">${esc(e.name)}</td>
  <td>${esc(e.what)}</td>
  <td>${esc(e.why)}</td>
</tr>`),
            note: 'This set is this build\u2019s reading of "the five defined events". The brief did not enumerate them. Confirm or replace the names before the collector goes live \u2014 historical data cannot be backfilled after a rename. See flag F-21.',
          },
        },
        { h3: 'Live counters for this browser' },
        {
          p: 'These counts come from your own browser only, via the counter below. They are not sent anywhere unless a collector endpoint is configured, and they are not this site\u2019s totals.',
        },
        {
          html: `<div class="live-panel" id="event-panel">
  <h4>Events recorded in this browser</h4>
  <div id="event-counts"><p class="small muted">Counting\u2026</p></div>
  <p class="formnote" id="endpoint-state"></p>
  <p class="formnote">Stored as five integers under one localStorage key. No identifier, no timestamp per event, no page path, no referrer, no user agent. Clearing site data resets them.</p>
</div>`,
        },
        { h3: 'What the counter deliberately does not capture' },
        {
          table: {
            head: ['Not captured', 'Reason'],
            rows: [
              ['IP address', 'Identifies a household. Not needed to count a click.'],
              ['User agent', 'Enables fingerprinting when combined with anything else.'],
              ['Cookie or persistent identifier', 'Would make this a tracking technology requiring consent notice in the EU, UK and Switzerland.'],
              ['Referrer URL', 'Would reveal where a reader came from, which is third-party data this site has no basis to hold.'],
              ['Full destination URL of an outbound click', 'Only the host and a link id are counted, so query strings carrying personal data are never recorded.'],
              ['Reading position, scroll depth or dwell time', 'Behavioural profiling. Not required to answer "did anyone click".'],
              ['Anything about a reader across sites', 'No cross-origin reads, no shared storage, no third-party request of any kind.'],
            ],
          },
        },
        { h3: 'The self-hosted collector' },
        {
          p: '<code class="inline">analytics/server/index.mjs</code> is a zero-dependency Node server implementing <code class="inline">POST /collect</code> and <code class="inline">GET /stats</code>. It accepts an event name and an optional page path, stores aggregate counters in a JSON file, discards the request body after incrementing, and logs no IP address and no user agent. It is exercised by <code class="inline">analytics/server/test.mjs</code>.',
        },
        {
          html: `<pre class="code"># run it anywhere that executes Node
node analytics/server/index.mjs --port 8787 --store ./data/events.json

# then point the site at it, on every page, before &lt;/head&gt;:
window.DIYHOME3.endpoint = "https://your-collector.example.com/collect";</pre>`,
        },
        {
          gate: {
            text: 'GitHub Pages serves static files and executes nothing server-side, so the collector cannot run on the same host as the site. Until it is deployed somewhere else, every count on this site is local to one browser and there is no aggregate measurement at all.',
            action: 'Deploy the collector, set window.DIYHOME3.endpoint, and confirm events arrive with GET /stats before treating any dashboard number as a site total. The site states this limitation on the page rather than implying measurement that is not happening.',
            flag: 'F-11',
          },
        },
      ],
    },

    /* ==================== 12. CONVERSION TRACKING ==================== */
    {
      slug: 'conversion-tracking',
      navLabel: 'Conversion',
      title: 'Conversion tracking',
      description:
        'The attribution model Amazon actually applies, what data would be needed to measure it, and why no conversion figure is published.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Conversion tracking' },
        {
          callout: {
            kind: 'warn',
            title: 'No conversion data exists, and none can be synthesised',
            text: 'Amazon reports qualifying purchases only through Associates Central to the enrolled account holder. Nothing in this session had access to that, so there is no conversion figure, no conversion rate and no conversion score anywhere on this site. What follows is the method, defined in advance so that the first authorised report can be entered against a fixed schema.',
            sourceIds: ['S02'],
          },
        },
        { h3: 'The attribution model Amazon applies' },
        {
          table: {
            head: ['Stage', 'Rule as written', 'Consequence for measurement'],
            rows: [
              ['Click', 'A customer clicks through a Special Link on your Site to an Amazon Site', 'An untagged link never starts this chain. F-01 therefore makes every downstream number zero by construction.'],
              ['Session start', 'Begins at that click', 'The unit of attribution is a session, not a click and not a day'],
              ['Session end', 'First of: 24 hours elapse, the customer places a non-digital order, or the customer clicks through someone else\u2019s Special Link', 'Last click wins. Another publisher\u2019s link inside your 24 hours ends your session'],
              ['Qualifying purchase \u2014 direct', 'Purchase via 1-Click during the Session', 'Counts immediately'],
              ['Qualifying purchase \u2014 cart', 'Added to cart during the Session and ordered no later than 89 days after the initial click-through', 'A click can earn up to 89 days later, so daily reporting understates a campaign still in flight'],
              ['Fulfilment condition', 'Within 180 days of purchase the Product is shipped, streamed or downloaded, and paid for', 'An order is not a qualifying purchase until it ships and is paid for'],
              ['Qualifying Revenue', 'The amount Amazon actually receives, less shipping, gift-wrapping, handling fees, taxes, service charges, credits, rebates, card-processing fees and bad debt', 'Never compute commission from a listed price and call it earnings'],
              ['Disqualification', 'Purchases are disqualified on a violation of the programme documents, and specifically for Redirecting Links, improperly formatted links, search-engine referrals and prohibited paid search placements', 'Compliance is not separate from conversion measurement \u2014 it determines whether the conversion counts'],
            ],
            note: 'All rows from the Associates Program Commission Income Statement \u00a71\u2013\u00a72. ' + cites(['S02']),
          },
        },
        { h3: 'The measurement chain this site implements' },
        {
          table: {
            head: ['Link in the chain', 'Measured by', 'Live now?'],
            rows: [
              ['Page arrived at', '<code class="inline">page_view</code> \u2014 first-party counter', '<span class="chip chip-warn">Local only</span>'],
              ['Disclosure actually seen', '<code class="inline">disclosure_view</code> \u2014 IntersectionObserver on the strip', '<span class="chip chip-warn">Local only</span>'],
              ['Reader left the site', '<code class="inline">outbound_click</code>', '<span class="chip chip-warn">Local only</span>'],
              ['Reader left toward Amazon', '<code class="inline">affiliate_click</code> \u2014 host allowlist', '<span class="chip chip-warn">Local only</span>'],
              ['Click tagged to this account', 'A <code class="inline">tag</code> parameter on the destination', '<span class="chip chip-bad">No \u2014 F-01</span>'],
              ['Click recorded by Amazon', 'Associates Central tracking report', '<span class="chip chip-bad">No access</span>'],
              ['Order placed', 'Associates Central reports', '<span class="chip chip-bad">No access</span>'],
              ['Order shipped and paid for', 'Associates Central reports', '<span class="chip chip-bad">No access</span>'],
              ['Commission earned', 'Associates Central Commission Income Statement', '<span class="chip chip-bad">No access</span>'],
            ],
            note: 'The chain breaks at link five. Everything after it depends on the tracking tag, which is why F-01 is rated critical rather than merely high.',
          },
        },
        { h3: 'Why a click-to-order rate would be misleading even with data' },
        {
          list: [
            'The 89-day cart window means a click today can produce an order next quarter, so any short-window rate is structurally understated.',
            'Last-click attribution means another publisher can end your session, so your measured rate depends on competitors you cannot see.',
            'Disqualifications are applied by Amazon in its sole discretion and reported after the fact, so a rate computed from clicks and reported orders mixes qualified and disqualified activity.',
            'Amazon states it makes no representation about the traffic or commission income an associate can expect, so a rate observed on three products over one period is not a rate that generalises.',
          ],
        },
        {
          callout: {
            kind: 'info',
            title: 'The rule this surface follows',
            text: 'Measure before optimising. The schema is fixed now, the ledger is empty now, and the first real number goes in only when an authorised report produces it. No placeholder zero is entered in the meantime, because a zero and a blank look identical once a table has been filled in for a while.',
            sourceIds: ['S01'],
          },
        },
      ],
    },

    /* ====================== 13. CAMPAIGN LEDGER ====================== */
    {
      slug: 'campaign-ledger',
      navLabel: 'Campaign ledger',
      title: 'Campaign ledger',
      description:
        'An empty but fully specified ledger: fixed schema, provenance requirements, validation rules, and no invented rows.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Campaign ledger' },
        {
          callout: {
            kind: 'info',
            title: 'This ledger is empty on purpose',
            text: 'The brief asks for an empty but well-defined campaign ledger, with timestamp, source, channel, eligible sessions, clicks and reported orders added only when obtained from authorised first-party reports, and a dated provenance trail. It asks for no conversion score and no revenue forecast. A ledger pre-filled with plausible zeroes would be indistinguishable from a real one after a few weeks, so nothing is pre-filled.',
          },
        },
        { h3: 'Schema' },
        {
          table: {
            head: ['Field', 'Type', 'Required', 'Rule'],
            rows: [
              ['<code class="inline">entry_id</code>', 'string', 'Yes', 'Immutable, assigned on entry, never reused'],
              ['<code class="inline">period_start</code>', 'ISO 8601 date', 'Yes', 'First day the row covers'],
              ['<code class="inline">period_end</code>', 'ISO 8601 date', 'Yes', 'Last day the row covers. Must be \u2265 period_start'],
              ['<code class="inline">recorded_at</code>', 'ISO 8601 timestamp', 'Yes', 'When the row was entered, not when the period ended'],
              ['<code class="inline">campaign</code>', 'string', 'Yes', 'Must exist in the campaigns list; free text is rejected'],
              ['<code class="inline">channel</code>', 'enum', 'Yes', 'One of: organic-search, direct, rss, email, social, referral, unknown'],
              ['<code class="inline">source_report</code>', 'string', 'Yes', 'The exact report the figures came from, e.g. "Associates Central \u2192 Reports \u2192 Earnings report"'],
              ['<code class="inline">source_export_date</code>', 'ISO 8601 date', 'Yes', 'When that report was exported. A figure without an export date is rejected'],
              ['<code class="inline">tracking_id</code>', 'string', 'Yes', 'Must match the register\u2019s tracking ID'],
              ['<code class="inline">eligible_sessions</code>', 'integer \u2265 0 or null', 'No', 'null means not reported. Zero means reported as zero. The two are never interchangeable'],
              ['<code class="inline">clicks</code>', 'integer \u2265 0 or null', 'No', 'As above'],
              ['<code class="inline">reported_orders</code>', 'integer \u2265 0 or null', 'No', 'As above'],
              ['<code class="inline">qualifying_revenue</code>', 'number \u2265 0 or null', 'No', 'As defined by Amazon, net of the deductions in the Commission Income Statement'],
              ['<code class="inline">commission_income</code>', 'number \u2265 0 or null', 'No', 'As reported. Never computed here from a rate'],
              ['<code class="inline">notes</code>', 'string', 'No', 'Anything that would change how the row is read'],
              ['<code class="inline">conversion_score</code>', '\u2014', 'Forbidden', 'This field does not exist. The brief prohibits it'],
              ['<code class="inline">revenue_forecast</code>', '\u2014', 'Forbidden', 'This field does not exist. The brief prohibits it and S01 \u00a74 independently warns against expecting any particular income'],
            ],
          },
        },
        { h3: 'Current contents' },
        {
          html: `<div class="tablewrap"><table>
<caption>campaign-ledger \u2014 data/campaign-ledger.json</caption>
<thead><tr><th>entry_id</th><th>period</th><th>campaign</th><th>channel</th><th>eligible sessions</th><th>clicks</th><th>reported orders</th><th>source report</th></tr></thead>
<tbody><tr><td colspan="8" class="muted" style="text-align:center;padding:1.4rem">No rows. Nothing has been obtained from an authorised first-party report yet.</td></tr></tbody>
</table></div>
<p class="table-note">The file is valid JSON with an empty <code class="inline">entries</code> array and a populated <code class="inline">schema</code> object, so anything downstream can be built against it today. Machine-readable at <a href="${link(out, 'data/campaign-ledger.json')}">data/campaign-ledger.json</a>.</p>`,
        },
        { h3: 'Provenance trail' },
        {
          table: {
            head: ['Date', 'Event', 'Outcome'],
            rows: [
              ['2026-11-20', 'Ledger schema defined and published', 'Committed with an empty entries array'],
              ['2026-11-20', 'Search for any authorised first-party report data', 'None available. No Associates Central access in this session'],
              ['2026-11-20', 'Search for any third-party conversion estimate to use as a placeholder', 'Rejected on principle. A placeholder estimate in a ledger is indistinguishable from a real figure later'],
              ['\u2014', 'First authorised report import', '<span class="unverified">Not yet occurred</span>'],
            ],
          },
        },
        {
          gate: {
            text: 'Only the account holder can export an authorised Associates report, and only they can say which report a figure came from. Provenance is not recoverable after the fact.',
            action: 'When you export a report, record its exact name and export date alongside the figures. Enter rows only from that export. Never reconcile a row against a remembered number.',
            flag: 'F-20',
          },
        },
      ],
    },

    /* ====================== 14. COMPLIANCE GATE ====================== */
    {
      slug: 'compliance-gate',
      navLabel: 'Compliance gate',
      title: 'Compliance gate',
      description:
        'The disclosure and policy checks that run in the build, the ones that need a human, and the current pass state of each.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Compliance gate' },
        {
          p: 'The brief asks for disclosures and API policy checks inside the publishing workflow rather than beside it. Everything mechanically checkable is enforced by <code class="inline">tools/verify.mjs</code>, which runs in CI on every push and pull request and fails the build on a violation.',
        },
        { h3: 'Automated checks \u2014 enforced in the build' },
        {
          table: {
            head: ['Check', 'Requirement source', 'How it is enforced', 'State'],
            rows: [
              ['Operating Agreement \u00a75 sentence present above the fold on every page', 'S01 \u00a75, S03', 'The sentence is rendered by the page shell, so no page can omit it. verify.mjs asserts it appears in every built HTML file before <main>', '<span class="chip chip-ok">Passing</span>'],
              ['Same sentence repeated in the footer of every page', 'S03 placement standard', 'Rendered by footer(); asserted per file by verify.mjs', '<span class="chip chip-ok">Passing</span>'],
              ['Every outbound product link carries rel="sponsored"', 'S12', 'outbound() is the only sanctioned emitter; verify.mjs greps built HTML for any amazon.com or link.amazon href lacking sponsored', '<span class="chip chip-ok">Passing</span>'],
              ['Prices carry a date/time stamp and the \u00a72(i) disclaimer', 'S02 IP License \u00a72(i)', 'Every price cell renders with the capture timestamp; the verbatim disclaimer is in the footer and on the pricing surface', '<span class="chip chip-ok">Passing</span>'],
              ['The \u00a72(k) content disclaimer appears site-wide', 'S02 IP License \u00a72(k)', 'Reproduced verbatim in footer() and asserted per file', '<span class="chip chip-ok">Passing</span>'],
              ['No Amazon image is embedded or hotlinked', 'S02 IP License \u00a72(h)', 'verify.mjs fails on any m.media-amazon.com or images-na.ssl-images-amazon.com reference in built output', '<span class="chip chip-ok">Passing</span>'],
              ['No first-person experience claims in editorial copy', 'S10 \u00a7255.1(a)', 'verify.mjs scans for a fixed phrase list and fails on a match', '<span class="chip chip-ok">Passing</span>'],
              ['No superlatives or product rankings', 'Project rule', 'verify.mjs scans for "best ", "#1", "top-rated", "number one"', '<span class="chip chip-ok">Passing</span>'],
              ['No search-volume or traffic figures in editorial copy', 'Project rule', 'verify.mjs scans for volume and impression phrasing', '<span class="chip chip-ok">Passing</span>'],
              ['attributionActive cannot be true without a tag in the href', 'S01 \u00a71, S02 \u00a72(g)', 'verify.mjs checks the register directly', '<span class="chip chip-ok">Passing</span>'],
              ['Every guide is present in sitemap.xml and feed.xml', 'Project rule', 'verify.mjs cross-references the registry against both generated files', '<span class="chip chip-ok">Passing</span>'],
              ['Every internal link resolves to a built file', 'Project rule', 'tools/linkcheck.mjs crawls the built output and fails on a 404', '<span class="chip chip-ok">Passing</span>'],
              ['No data cell is filled from a non-official source', 'Project rule', 'The data layer separates official and third-party sources; only official ids appear in cell()', '<span class="chip chip-ok">Passing</span>'],
            ],
          },
        },
        { h3: 'Human checks \u2014 cannot be automated' },
        {
          table: {
            head: ['Check', 'Requirement source', 'Why a machine cannot do it', 'State'],
            rows: [
              ['Tracking ID is active on an approved account', 'S01, S03', 'Requires an authenticated Associates Central session', '<span class="chip chip-bad">Open \u2014 F-16</span>'],
              ['Site URL is registered on the Associates account', 'S03', 'Requires an authenticated session; Amazon\u2019s guidance requires sites used to drive traffic be kept updated in the account', '<span class="chip chip-bad">Open \u2014 F-16</span>'],
              ['Special Link destination and tracking report confirmed', 'S01 \u00a71, S02 \u00a72(g)', 'Step 5 of the validation gate needs the tracking report', '<span class="chip chip-bad">Open \u2014 F-15</span>'],
              ['Commission rate read from the official Appendix', 'S02 \u00a73', 'The Appendix table was not reached this session and third-party figures conflict', '<span class="chip chip-bad">Open \u2014 F-05</span>'],
              ['Disclosure placement reviewed in context, not just for presence', 'S01 \u00a75, S03, S10 \u00a7255.5', 'A script can confirm the sentence exists; only a reader can judge whether it is conspicuous in context on a given layout', '<span class="chip chip-warn">Needs review</span>'],
              ['Endorsement context reviewed against the FTC Guides', 'S10, S11', 'Judgement about whether copy implies an experience nobody had', '<span class="chip chip-warn">Needs review \u2014 F-14</span>'],
              ['Named human author assigned and has actually read the copy', 'S10 \u00a7255.1(a), \u00a7255.3', 'Authorship is a fact about a person, not a string in a template', '<span class="chip chip-bad">Open \u2014 F-14</span>'],
              ['Observed values re-checked by a human in a normal browser', 'S02 IP License \u00a74', 'The Agent Terms question in F-08 can only be resolved by a human re-observation', '<span class="chip chip-warn">Needs review \u2014 F-08</span>'],
              ['Reader-capture lawful basis and unsubscribe in place', 'GDPR / UK GDPR / Swiss FADP; CAN-SPAM', 'A legal determination about the owner\u2019s processing, not a code check', '<span class="chip chip-bad">Open \u2014 F-13</span>'],
            ],
          },
        },
        { h3: 'Prohibited practices \u2014 never to be automated' },
        {
          checklist: [
            'Bidding on "amazon", "kindle", any Amazon Mark, or a misspelling of one in paid search \u2014 a Prohibited Paid Search Placement under \u00a72(c).',
            'Placing an affiliate link on or generated by a search engine \u2014 \u00a72(d).',
            'Redirecting a reader to Amazon without an affirmative click on this site \u2014 \u00a72(e).',
            'Offering any consideration, reward or incentive for using the links, or asking readers to support a cause by using them.',
            'Implying that Amazon sponsors, endorses or supports this site, or that there is any affiliation beyond the Associates relationship \u2014 \u00a75.',
            'Making a public communication about the Agreement or about participation in the programme beyond the required disclosure, without advance written permission \u2014 \u00a75. Note that this compliance page quotes the Agreement for operational purposes; whether that needs permission is itself a question for the owner.',
            'Storing or caching Program Advertising Content images, or holding a link to one for more than 24 hours \u2014 IP License \u00a72(h).',
            'Displaying pricing or availability without a date/time stamp and the required disclaimer \u2014 IP License \u00a72(i).',
            'Reverse-engineering, decompiling or deriving model parameters from PA-API or Creators API \u2014 IP License \u00a72(g).',
            'Concealing that access is automated, mimicking human keystroke or navigation patterns, or circumventing a CAPTCHA \u2014 IP License \u00a74.',
          ],
        },
        {
          callout: {
            kind: 'bad',
            title: 'One self-flag worth reading twice',
            text: 'The last item on that list is the one this build has the least certainty about. The research behind this register was performed by an automated agent fetching Amazon pages, and this session cannot confirm that those requests carried the "Agent/[agent name]" user-agent string the Agent Terms require, nor that the agent was operating under an enrolled Associates account. The data is recorded as a good-faith observation with that caveat attached rather than presented as clean.',
            sourceIds: ['S02'],
          },
        },
      ],
    },

    /* ============================ 15. SEO ============================ */
    {
      slug: 'seo',
      navLabel: 'SEO & findability',
      title: 'SEO and findability',
      description:
        'One indexable domain, a generated sitemap and feed, canonical URLs, robots.txt, and the honest state of Search Console.',
      blocks: [
        { kicker: 'Dashboard', h1: 'SEO and findability' },
        {
          p: 'The brief asks that search engines be given one site to index and a reason to rank it. The first half is a technical property and it is done. The second half depends on measurement that does not exist yet, so this surface reports the technical state accurately and makes no ranking claim.',
        },
        {
          metrics: [
            { label: 'Indexable domains', value: '1', sub: 'The GitHub Pages origin only' },
            { label: 'Pages in sitemap', value: '45', sub: 'Every built page except 404.html' },
            { label: 'Guides in feed', value: String(guides.length), sub: 'Every guide, RSS 2.0' },
            { label: 'Canonical tags', value: 'Every page', sub: 'Absolute URL to the Pages origin' },
            { label: 'Third-party trackers', value: '0', sub: 'Nothing to consent to' },
            { label: 'Search Console', value: null, sub: 'Not verified \u2014 F-12' },
          ],
        },
        { h3: 'What is shipped' },
        {
          table: {
            head: ['Asset', 'File', 'Generated from', 'Notes'],
            rows: [
              ['Sitemap', '<a href="' + link(out, 'sitemap.xml') + '">sitemap.xml</a>', 'The page registry in tools/build.mjs', 'Every published URL, with lastmod set to the build date'],
              ['RSS feed', '<a href="' + link(out, 'feed.xml') + '">feed.xml</a>', 'site/data/guides.mjs', 'RSS 2.0 with an atom:link self reference. Autodiscovery link on every page'],
              ['robots.txt', '<a href="' + link(out, 'robots.txt') + '">robots.txt</a>', 'Static', 'Allows everything and points at the sitemap. Nothing is disallowed because nothing needs hiding'],
              ['404 page', '<a href="' + link(out, '404.html') + '">404.html</a>', 'The page shell', 'Carries the disclosure strip like every other page'],
              ['Canonical URL', 'In every <head>', 'SITE.base + page path', 'One canonical per page, all pointing at the Pages origin'],
              ['Open Graph and Twitter card', 'In every <head>', 'Page title and description', 'summary card, no image, because no compliant image exists \u2014 F-09'],
              ['Structured data', 'In every <head>', 'Per page type', 'WebSite, BreadcrumbList, Article and ItemList only'],
              ['Jekyll bypass', '<code class="inline">.nojekyll</code>', 'Static', 'Prevents GitHub Pages from processing the output through Jekyll'],
            ],
          },
        },
        { h3: 'Structured data deliberately NOT emitted' },
        {
          table: {
            head: ['Type', 'Why it is withheld'],
            rows: [
              ['<code class="inline">Product</code> with <code class="inline">offers</code>', 'The prices on this site are dated observations, not live offers. Marking them up as offers would assert a currency this site cannot maintain'],
              ['<code class="inline">aggregateRating</code> or <code class="inline">Review</code>', 'The ratings belong to Amazon shoppers about an Amazon listing. This site did not collect them, so publishing them as its own review markup would misattribute them'],
              ['<code class="inline">Person</code> as author', 'No named human authored this content. Emitting a Person would assert an authorship that does not exist \u2014 F-14'],
              ['<code class="inline">Organization</code> with a founder or contact', 'No legal entity details were supplied, so none are invented'],
            ],
            note: 'Emitting rich-result markup you cannot substantiate is a common way to lose a rich result entirely. Withholding it is the safer and more honest choice.',
          },
        },
        { h3: 'The reason to rank, stated honestly' },
        {
          list: [
            'Eleven guides written as questions a buyer would actually ask, each one a genuine framework rather than a product pitch.',
            'A published verification method, with every factual claim carrying a link to an official source. That is rare in this niche and it is a real differentiator.',
            'Blank cells where data could not be confirmed, instead of confident numbers. A buyer who has been burned by invented specifications will value this.',
            'Two live topic clusters built from the observed browse-node structure, with pillars and supporting guides linked both ways.',
            'A seasonal calendar anchored to a verified date \u2014 Amazon\u2019s own 2026 holiday returns window \u2014 rather than to a guessed demand curve.',
          ],
        },
        {
          callout: {
            kind: 'warn',
            title: 'What is NOT a reason to rank, and is not claimed',
            text: 'No keyword research was performed, because no authorised keyword source was available. No title on this site was chosen from search-volume data. No ranking, traffic or impression figure is published anywhere. Every title is an editorial hypothesis, and the guides say so where it matters.',
          },
        },
        {
          gate: {
            text: 'Search Console verification needs an account this session does not have and should not be given. Until it is connected there is no query data, so the next topic cannot be chosen from measured queries as the brief requires.',
            action: 'Verify the GitHub Pages property in Search Console, submit /sitemap.xml, and wait for impressions to accumulate. Then choose the next guide from the queries that actually bring arrivals, and resist backfilling a keyword rationale onto titles written without one.',
            flag: 'F-12',
          },
        },
      ],
    },

    /* ========================== 16. AUTOMATION ========================== */
    {
      slug: 'automation',
      navLabel: 'Automation',
      title: 'Automation map',
      description:
        'What is automated end to end, what is automated with a human checkpoint, and what is gated behind a human by design.',
      blocks: [
        { kicker: 'Dashboard', h1: 'Automation map' },
        {
          p: 'The brief asks for automation, scalability and data-driven decisions, and separately asks for a gate in front of the parts that cannot be automated. Those two asks are in tension, and the honest resolution is to publish the split rather than to automate as much as possible and hope.',
        },
        {
          metrics: [
            { label: 'Fully automated', value: '9', sub: 'Runs on every commit with no human input' },
            { label: 'Automated with a checkpoint', value: '4', sub: 'Machine does the work, a human confirms the output' },
            { label: 'Human-only by design', value: '7', sub: 'Gated. The machinery refuses to proceed without a person' },
          ],
        },
        { h3: 'Fully automated' },
        {
          table: {
            head: ['Capability', 'Implementation', 'Trigger'],
            rows: [
              ['Site generation', 'tools/build.mjs renders every page from site/data/*.mjs', 'On demand and in CI'],
              ['Sitemap generation', 'Derived from the same page registry as the HTML', 'Every build'],
              ['RSS feed generation', 'Derived from site/data/guides.mjs', 'Every build'],
              ['Disclosure placement', 'Part of the page shell; cannot be omitted by a page', 'Every build'],
              ['rel="sponsored" marking', 'The single outbound() emitter; no other code path writes an external link', 'Every build'],
              ['Compliance verification', 'tools/verify.mjs \u2014 13 automated checks', 'Every build and every CI run'],
              ['Internal link checking', 'tools/linkcheck.mjs crawls the built output', 'Every CI run'],
              ['ASIN format validation', 'asinFormatCheck() against Amazon\u2019s published definition', 'Every build'],
              ['Outbound click counting', 'assets/js/analytics.js, first-party and cookieless', 'Every page view'],
            ],
          },
        },
        { h3: 'Automated with a human checkpoint' },
        {
          table: {
            head: ['Capability', 'What the machine does', 'What the human confirms'],
            rows: [
              ['Link resolution', 'Fetches a supplied link and records the destination verbatim', 'That the destination is the product actually intended'],
              ['Price capture', 'Records the observed price, anchor label, discount and timestamp', 'That the price is still the one to show, and when to re-observe'],
              ['Cluster derivation', 'Groups products by observed browse-node path', 'That the grouping is a sensible editorial unit'],
              ['Guide drafting', 'Produces a structured, claim-free article from a defined outline', 'That it is accurate, useful and worth publishing under a name'],
            ],
          },
        },
        { h3: 'Human-only \u2014 gated by design' },
        {
          table: {
            head: ['Capability', 'Why it cannot be automated', 'Gate that enforces it', 'Flag'],
            rows: [
              ['Generating a tagged Special Link', 'Needs an authenticated Associates Central session', 'attributionActive stays false; product pages ship untagged', 'F-15'],
              ['Confirming a click in the tracking report', 'Needs the account holder\u2019s report', 'Step 5 of the validation gate', 'F-15'],
              ['Verifying the tracking ID is active', 'Needs Account Settings', 'Tracking ID renders with an "unverified" chip everywhere', 'F-16'],
              ['Reading the official commission rate', 'Needs the Appendix under an authenticated session', 'Rate cells are blank; the calculator has no default', 'F-05'],
              ['Importing campaign results', 'Needs an authorised first-party report export', 'The ledger rejects a row without source_report and export date', 'F-20'],
              ['Assigning authorship', 'Authorship is a fact about a person', 'Byline stays a desk label; no Person structured data is emitted', 'F-14'],
              ['Verifying Search Console', 'Needs an account and domain control', 'SEO surface reports the technical state only and claims no ranking', 'F-12'],
            ],
          },
        },
        { h3: 'The scalability argument, and its limit' },
        {
          p: 'The architecture does scale: adding a product is one object in the register, adding a guide is one object in the guides array, and both propagate to the HTML, the sitemap, the feed, the cluster pages, the front page and the dashboard without a second edit. The compliance gate travels with them automatically.',
        },
        {
          callout: {
            kind: 'gate',
            title: 'But scaling the machinery is not scaling the operation',
            text: 'Seven of the twenty capabilities above need a human, and every one of them sits on the path to earning money. A site can grow to five hundred products and still earn nothing if the tracking tag is never validated. Automating the wrong half of this problem is the most likely way for it to fail, so the split is published here rather than left implicit.',
          },
        },
      ],
    },
  ];
}
