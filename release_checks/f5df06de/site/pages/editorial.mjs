/**
 * EDITORIAL PAGES — the reader-facing half of the site.
 * The front page is a publication, not a status screen: it leads with the
 * products and the guides. Every dashboard surface stays reachable, but from the
 * footer and from the single "Dashboard" navigation entry, per the brief.
 */

import { products, submissions, clusters, TRACKING_ID, OBSERVED_AT, countBlanks } from '../data/products.mjs';
import { guides, seasons, AUTHOR, cadence } from '../data/guides.mjs';
import { flags, flagCounts, severityOrder } from '../data/flags.mjs';
import { sources } from '../data/sources.mjs';
import {
  esc, cell, cites, money, int, link, outbound, renderTable, renderBlocks,
  breadcrumbs, AMAZON_DISCLOSURE, AMAZON_PRICE_DISCLAIMER, sourceTableRows, NAV_LABEL_RATIONALE,
} from '../layout.mjs';

const STAMP = '2026-11-20 06:00 UTC';
const p = (slug) => products.find((x) => x.slug === slug);

/* ------------------------------------------------------------------ */
/* Reusable widgets                                                    */
/* ------------------------------------------------------------------ */

export function captureWidget(out) {
  return `<div class="card card-paper" id="reader-capture">
  <h3 style="margin-top:0">Get the next guide</h3>
  <p class="small">One email when a new buyer-question guide is published. No product pitches, no deal alerts, no third-party sharing.</p>
  <form class="capture" id="capture-form" novalidate>
    <div class="field">
      <label class="tiny muted" for="capture-email" style="flex-basis:100%">Email address</label>
      <input id="capture-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
      <button class="btn" type="submit">Subscribe</button>
    </div>
    <div class="formstate" id="capture-state" role="status" aria-live="polite"></div>
    <p class="formnote">
      <strong>Status: capture is not configured.</strong> No endpoint is set on this deployment, so submitting
      this form stores nothing and sends nothing \u2014 it will tell you so rather than pretending to succeed.
      See <a href="${link(out, 'flagged/index.html')}#F-13">flag F-13</a>. Enabling it requires a lawful basis,
      a privacy notice and a working unsubscribe first: the owner is in Z\u00fcrich, so GDPR, the UK GDPR and the
      Swiss FADP all apply to any reader in those jurisdictions.
    </p>
  </form>
</div>`;
}

function priceBlock(x, out) {
  return `<div class="pricebox">
  <div class="metric-label">Observed price</div>
  <div class="price-now">${money(x.observed.priceObserved)}</div>
  <div class="price-anchor">
    ${esc(x.observed.priceAnchorLabel)}: <s>${money(x.observed.priceAnchor)}</s>
    &nbsp;<span class="chip chip-brand">\u2212${x.observed.priceDiscountPct}%</span>
    ${x.observed.primeExclusive ? '&nbsp;<span class="chip chip-warn">Prime members only</span>' : ''}
  </div>
  <div class="price-anchor">${esc(x.observed.dealLabel)} \u00b7 ${esc(x.observed.inStock || 'Stock status not captured')}</div>
  <div class="price-stamp">Amazon.com Price: ${money(x.observed.priceObserved)} (as of ${STAMP} \u2014 Details)</div>
  <p class="tiny muted" style="margin:.6rem 0 0">${esc(AMAZON_PRICE_DISCLAIMER)}</p>
</div>`;
}

function attributionStatus(x) {
  return `<div class="callout callout-bad" style="margin-top:1rem">
  <div class="callout-title">Affiliate attribution: NOT ACTIVE</div>
  <p class="small">
    The link below goes to the canonical Amazon listing for <span class="mono">${esc(x.observed.asin)}</span>
    and carries <strong>no tracking tag</strong>. It is nonetheless marked
    <code class="inline">rel="sponsored"</code>, because the intent is commercial. This site earns nothing
    from the click until a tagged Special Link has been validated in Associates Central.
    <a href="${link('products/x.html', 'dashboard/link-management.html')}">Link management</a> \u00b7
    <a href="${link('products/x.html', 'flagged/index.html')}#F-01">F-01</a> \u00b7
    <a href="${link('products/x.html', 'flagged/index.html')}#F-15">F-15</a>
  </p>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export function frontPage(out) {
  const lead = guides[0];
  const live = guides.filter((g) => !g.hypothesisOnly);
  const hypo = guides.filter((g) => g.hypothesisOnly);

  return {
    title: 'DIYHOME3',
    description:
      'Buyer-question guides for reversible, low-cost home upgrades. Every product claim carries a link to an official source, and anything that could not be verified is left blank rather than guessed.',
    body: `
<section class="hero grid grid-sidebar">
  <div>
    <p class="kicker">The reversible-upgrades desk</p>
    <h1>Home upgrades you can undo, researched before they are recommended.</h1>
    <p class="dek">
      Peel-and-stick, self-adhesive, tool-free, under-cabinet. Three products, two Amazon
      departments, one buyer constraint: nothing permanent. Every factual claim on this site
      links to an official source, and anything that could not be verified is published as a
      visible blank instead of a confident guess.
    </p>
    <p class="small muted">
      <strong>${esc(AMAZON_DISCLOSURE)}</strong> Attribution is not currently active \u2014
      <a href="${link(out, 'flagged/index.html')}#F-01">here is why, in full</a>.
    </p>
    <p style="margin-top:1.1rem">
      <a class="btn" href="${link(out, 'products/index.html')}">Browse the product register</a>
      &nbsp;
      <a class="btn btn-outline" href="${link(out, 'guides/index.html')}">Read the guides</a>
    </p>
  </div>
  <aside>
    <div class="hero-art"><img src="${link(out, 'assets/img/hero-front.svg')}" alt="Abstract illustration of modular shelving lines forming a house outline" width="560" height="420" loading="eager"></div>
    <div class="metrics" style="margin-top:.9rem">
      <div class="metric"><div class="metric-label">Links supplied</div><div class="metric-value">${submissions.length}</div><div class="metric-sub">3 unique (F-07)</div></div>
      <div class="metric"><div class="metric-label">Listings verified</div><div class="metric-value">3</div><div class="metric-sub">All resolved ${STAMP.slice(0, 10)}</div></div>
      <div class="metric"><div class="metric-label">Fields left blank</div><div class="metric-value">${countBlanks()}</div><div class="metric-sub">No official source, so never inferred</div></div>
      <div class="metric"><div class="metric-label">Open flags</div><div class="metric-value">${flagCounts.total}</div><div class="metric-sub">${flagCounts.gated} gated</div></div>
    </div>
  </aside>
</section>

<div class="rail-head">
  <h2>The register</h2>
  <a href="${link(out, 'products/index.html')}">Full register, sources and verification status \u203a</a>
</div>
<div class="grid grid-3">
  ${products
    .map(
      (x) => `<a class="tile" href="${link(out, 'products/' + x.slug + '.html')}">
    <span class="chip ${x.observed.badge ? 'chip-brand' : 'chip-neutral'}">${esc(x.observed.badge || 'No badge')}</span>
    <span class="tile-title" style="margin-top:.5rem">${esc(x.observed.listingH1)}</span>
    <span class="tile-meta">
      ${esc(x.observed.brandStore)} \u00b7 <span class="mono">${esc(x.observed.asin)}</span><br/>
      ${money(x.observed.priceObserved)} observed ${STAMP.slice(0, 10)} \u00b7
      ${x.observed.starRating.toFixed(1)}\u2605 from ${int(x.observed.ratingsCount)} ratings<br/>
      <span class="chip chip-bad">Attribution inactive</span>
    </span>
  </a>`
    )
    .join('\n  ')}
</div>

<div class="rail-head">
  <h2>Latest guides</h2>
  <a href="${link(out, 'guides/index.html')}">All ${guides.length} guides \u203a</a>
</div>
<div class="grid grid-sidebar">
  <div>
    <article class="story">
      <p class="kicker">${esc(clusters[lead.cluster].name)} \u00b7 pillar</p>
      <h3><a href="${link(out, 'guides/' + lead.slug + '.html')}">${esc(lead.title)}</a></h3>
      <p class="small">${esc(lead.dek)}</p>
      <p class="tiny muted">${esc(AUTHOR.byline)} \u00b7 ${lead.seasons.length ? 'Season: ' + lead.seasons.map((s) => esc(seasons.find((y) => y.id === s).label)).join(', ') : 'Evergreen'}</p>
    </article>
    ${live
      .slice(1, 5)
      .map(
        (g) => `<article class="story">
      <p class="kicker">${esc(clusters[g.cluster].name)}${g.meta ? ' \u00b7 method' : ''}</p>
      <h3><a href="${link(out, 'guides/' + g.slug + '.html')}">${esc(g.title)}</a></h3>
      <p class="small">${esc(g.dek)}</p>
    </article>`
      )
      .join('\n    ')}
  </div>
  <aside>
    ${captureWidget(out)}
    <div class="card card-tight" style="margin-top:1rem">
      <h4 style="margin-top:0">Seasons</h4>
      ${seasons
        .map(
          (s) => `<p class="tiny" style="margin-bottom:.6rem">
        <strong>${esc(s.label)}</strong><br/>
        <span class="muted">${esc(s.window)}</span><br/>
        ${s.verified ? '<span class="verified">Verified anchor</span>' : '<span class="unverified">Planning slot</span>'}
        ${s.sourceIds.length ? cites(s.sourceIds) : ''}
      </p>`
        )
        .join('')}
      <p class="tiny"><a href="${link(out, 'clusters/index.html')}">Clusters and the seasonal calendar \u203a</a></p>
    </div>
  </aside>
</div>

<div class="rail-head">
  <h2>What this build could not verify</h2>
  <a href="${link(out, 'flagged/index.html')}">All ${flags.length} flags, with evidence and sources \u203a</a>
</div>
<div class="grid grid-2">
  ${flags
    .filter((f) => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 4)
    .map(
      (f) => `<div class="card card-tight flag-${f.severity}" style="border-left-width:4px">
    <div class="flag-head"><span class="flag-id">${esc(f.id)}</span><span class="chip chip-${f.severity === 'critical' ? 'bad' : 'warn'}">${esc(f.severity)}</span></div>
    <h3 style="font-family:var(--sans);font-size:.95rem;margin:.1rem 0 .35rem">${esc(f.title)}</h3>
    <p class="tiny muted" style="margin:0">${esc(f.summary)}</p>
    <p class="tiny" style="margin:.5rem 0 0"><a href="${link(out, 'flagged/index.html')}#${esc(f.id)}">Evidence and required action \u203a</a></p>
  </div>`
    )
    .join('\n  ')}
</div>

<div class="rail-head">
  <h2>How the research was done</h2>
  <a href="${link(out, 'methodology/index.html')}">Full method \u00b7 source register \u203a</a>
</div>
<div class="grid grid-3">
  <div class="card card-tight">
    <h4 style="margin-top:0">One source of truth</h4>
    <p class="tiny">Every table, the sitemap and the RSS feed are generated from the same three data files. Correct a fact once and it corrects everywhere.</p>
  </div>
  <div class="card card-tight">
    <h4 style="margin-top:0">Blank beats plausible</h4>
    <p class="tiny">No official source for a value means the cell stays empty and renders as <span class="unverified">UNVERIFIED</span>. Third-party blogs are recorded as evidence of conflict, never as data.</p>
  </div>
  <div class="card card-tight">
    <h4 style="margin-top:0">A gate, not a checklist</h4>
    <p class="tiny">Thirteen compliance checks run in CI and fail the build. Seven capabilities are gated behind a human by design, and the list of them is published.</p>
  </div>
</div>

<p class="tiny muted" style="margin-top:2.4rem;border-top:1px solid var(--rule);padding-top:1rem">
  Operational surfaces \u2014 product research, link intent, pricing, reviews, competition, commission,
  niche, content pipeline, link management, click tracking, conversion, the campaign ledger, the
  compliance gate, SEO and the automation map \u2014 live under
  <a href="${link(out, 'dashboard/index.html')}">Dashboard</a> and are listed in full in the footer.
</p>
`,
  };
}

/* ------------------------------------------------------------------ */

export function productsIndex(out) {
  return {
    title: 'Product register',
    description:
      'All four supplied links, the three unique products they resolved to, and every verified attribute with its official source. Unverified values are blank.',
    activeKey: 'products',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Products', null]])}
<p class="kicker">The register</p>
<h1>Three products, four supplied links, and one thing they all have in common</h1>
<p class="dek">
  Every listing in this register was reached by following a supplied short link and reading what
  Amazon rendered. Nothing here is inferred, and nothing is filled in from a third-party source.
</p>

<div class="callout callout-bad">
  <div class="callout-title">Read this before the table</div>
  <p class="small">
    The submitted link tokens (<span class="mono">B0hmGG4m2</span>, <span class="mono">B03QDuGdo</span>,
    <span class="mono">B0hpD2JGQ</span>) are nine characters long and contain lower-case letters. Amazon
    defines an ASIN as a unique ten-character alphanumeric code, so none of them is an ASIN. The
    ten-character codes in the table below were <em>observed at the destination</em>, not asserted by
    anyone. Those two facts are kept in separate columns throughout this site and are never merged.
    ${cites(['S05', 'S09'])}
  </p>
</div>

<h2>The register</h2>
${renderTable(
  {
    head: ['ASIN (observed)', 'Listing title as rendered', 'Brand store', 'Sold by', 'Stars', 'Ratings', 'Price observed', 'Commission', 'Page'],
    numCols: [4, 5, 6],
    rows: products.map((x) => {
      const srcs = x.observed.sourceIds;
      return `<tr>
  <td class="mono nowrap">${outbound(x.observed.canonicalListingUrl, esc(x.observed.asin), 'source')} ${cites(srcs)}</td>
  <td>${esc(x.observed.listingH1)}<br/><span class="tiny muted">${esc(x.observed.listingSubhead)}</span></td>
  <td>${cell(x.observed.brandStore, { sourceIds: srcs })}</td>
  <td>${cell(x.observed.soldBy, { sourceIds: srcs })}<br/><span class="tiny muted mono">${esc(x.observed.sellerId)}</span></td>
  <td class="num">${cell(x.observed.starRating, { sourceIds: srcs, fmt: (v) => v.toFixed(1) })}</td>
  <td class="num">${cell(x.observed.ratingsCount, { sourceIds: srcs, fmt: int })}</td>
  <td class="num">${cell(x.observed.priceObserved, { sourceIds: srcs, fmt: money })}<br/><span class="tiny muted">${esc(x.observed.priceAnchorLabel)} ${money(x.observed.priceAnchor)}</span></td>
  <td>${cell(null, { blankLabel: 'BLANK \u00b7 F-05' })}</td>
  <td><a href="${link(out, 'products/' + x.slug + '.html')}">open</a></td>
</tr>`;
    }),
    note: `All values observed ${STAMP} from ${esc(OBSERVED_AT ? 'amazon.com' : '')}, signed out, with no Associates credentials and no tag parameter. Prices are Black Friday deal prices from a single moment and a single geography (F-17). ${cites(['S06', 'S07', 'S08', 'S09'])}`,
  }
)}

<h2>The four supplied links, as received</h2>
${renderTable(
  {
    head: ['#', 'Supplied link', 'Token', 'Chars', 'ASIN format check', 'Resolved to', 'Note'],
    numCols: [3],
    rows: submissions.map((s) => {
      const tok = s.url.split('/').pop();
      const len = [...tok].length;
      const ok = len === 10 && /^[A-Z0-9]+$/.test(tok);
      const prod = products.find((x) => x.submissions.includes(s.id));
      return `<tr>
  <td class="mono">${esc(s.id)}</td>
  <td class="mono tiny">${esc(s.url)}</td>
  <td class="mono">${esc(tok)}</td>
  <td class="num">${len}</td>
  <td><span class="chip ${ok ? 'chip-ok' : 'chip-bad'}">${ok ? 'PASS' : 'FAIL'}</span> <span class="tiny muted">${len} chars, mixed case</span></td>
  <td class="mono">${prod ? outbound(prod.observed.canonicalListingUrl, esc(prod.observed.asin), 'source') : '\u2014'}</td>
  <td>${s.id === 'L3' ? '<span class="chip chip-warn">Byte-identical duplicate of L2</span>' : '\u2014'}</td>
</tr>`;
    }),
    note: 'Format check against Amazon\u2019s published ASIN definition. ' + cites(['S05', 'S09']),
  }
)}

<h2>Category placement</h2>
${renderTable({
  head: ['ASIN', 'Browse path as Amazon rendered it', 'Leaf node'],
  rows: products.map(
    (x) => `<tr>
  <td class="mono">${esc(x.observed.asin)}</td>
  <td>${x.observed.breadcrumb.map(esc).join(' \u203a ')}</td>
  <td class="mono">${esc(x.observed.browseNodeId)}</td>
</tr>`
  ),
  note: 'These paths are the entire basis for the niche and cluster analysis on this site. ' + cites(['S06', 'S07', 'S08']),
})}

<h2>What is deliberately absent from this register</h2>
<ul class="checklist">
  <li><strong>No product images.</strong> Amazon\u2019s IP License permits storing a link to a product image for only 24 hours, and a static site cannot refresh anything. Original artwork is used instead. ${cites(['S02'])}</li>
  <li><strong>No commission rate.</strong> Not confirmed from an official source; four third-party pages gave five different numbers. ${cites(['S13', 'S14', 'S15'])}</li>
  <li><strong>No review text.</strong> No customer review is quoted anywhere on this site.</li>
  <li><strong>No precise sales figure.</strong> Amazon\u2019s banded "bought in past month" strings are reproduced as banded strings.</li>
  <li><strong>No stock status for two of three.</strong> Not read on the captured portion of the page, so left blank rather than assumed from the presence of a buybox.</li>
  <li><strong>No revenue forecast.</strong> Amazon states it makes no representation about the traffic or commission income an associate can expect. ${cites(['S01'])}</li>
</ul>

<h2>Where to go next</h2>
<div class="grid grid-3">
  <a class="tile" href="${link(out, 'dashboard/link-intent.html')}"><span class="tile-title">Product-intent record</span><span class="tile-meta">Submitted token and observed destination, held apart</span></a>
  <a class="tile" href="${link(out, 'reviews/index.html')}"><span class="tile-title">Compare the three</span><span class="tile-meta">Criteria, not verdicts</span></a>
  <a class="tile" href="${link(out, 'flagged/index.html')}"><span class="tile-title">Flagged for review</span><span class="tile-meta">${flags.length} items with evidence and sources</span></a>
</div>
`,
  };
}

/* ------------------------------------------------------------------ */

export function productPage(x, out) {
  const o = x.observed;
  const cluster = clusters[x.cluster];
  const related = guides.filter((g) => g.productRefs.includes(x.slug));

  return {
    title: o.listingH1,
    description: `${o.listingH1} \u2014 verified listing record for ASIN ${o.asin}: observed price, rating, seller, category path and source links. Unverified values are left blank.`,
    activeKey: 'products',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${o.listingH1} \u2014 verified listing record`,
      description: `Observation record for ASIN ${o.asin} captured ${STAMP}.`,
      datePublished: '2026-11-20',
      dateModified: '2026-11-20',
      author: { '@type': 'Organization', name: AUTHOR.byline },
      publisher: { '@type': 'Organization', name: 'DIYHOME3' },
      about: { '@type': 'Thing', name: o.listingH1 },
    },
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Products', 'products/index.html'], [o.asin, null]])}
<p class="kicker">${esc(cluster.name)} \u00b7 verified listing record</p>
<h1>${esc(o.listingH1)}</h1>
<p class="dek">${esc(o.listingSubhead)}</p>

<div class="byline">
  <span>Recorded by <b>${esc(AUTHOR.byline)}</b></span>
  <span>Observed <b>${STAMP}</b></span>
  <span>ASIN <b class="mono">${esc(o.asin)}</b></span>
  <span>Sources ${cites(o.sourceIds)}</span>
</div>

<div class="grid grid-sidebar">
<div>

<h2>What was verified</h2>
${renderTable({
  head: ['Field', 'Value', 'Source'],
  rows: [
    ['Observed ASIN', `<span class="mono">${esc(o.asin)}</span> <span class="verified">10 chars, valid format</span>`, cites(o.sourceIds)],
    ['Listing URL', outbound(o.canonicalListingUrl, esc(o.canonicalListingUrl), 'source'), cites(o.sourceIds)],
    ['Page title as rendered', `<span class="tiny">${esc(o.pageTitle)}</span>`, cites(o.sourceIds)],
    ['Brand store', cell(o.brandStore, { sourceIds: o.sourceIds }), cites(o.sourceIds)],
    ['Ships from', cell(o.shipsFrom, { sourceIds: o.sourceIds }), cites(o.sourceIds)],
    ['Sold by', cell(o.soldBy, { sourceIds: o.sourceIds }), cites(o.sourceIds)],
    ['Seller ID', `<span class="mono">${esc(o.sellerId)}</span>`, cites(o.sourceIds)],
    ['Star rating', cell(o.starRating, { sourceIds: o.sourceIds, fmt: (v) => v.toFixed(1) + ' out of 5' }), cites(o.sourceIds)],
    ['Ratings count', cell(o.ratingsCount, { sourceIds: o.sourceIds, fmt: (v) => int(v) + ' ratings' }), cites(o.sourceIds)],
    ['Badge rendered', o.badge ? `<span class="chip chip-brand">${esc(o.badge)}</span>` : '<span class="chip chip-neutral">None rendered</span>', cites(o.sourceIds)],
    ['Bought in past month', esc(o.boughtPastMonth) + ' <span class="tiny muted">(banded string, reproduced as rendered)</span>', cites(o.sourceIds)],
    ['Browse path', o.breadcrumb.map(esc).join(' \u203a '), cites(o.sourceIds)],
    ['Leaf browse node', `<span class="mono">${esc(o.browseNodeId)}</span>`, cites(o.sourceIds)],
    ['Stock status', cell(o.inStock, { sourceIds: o.sourceIds }), cites(o.sourceIds)],
    ['Returns window', esc(o.returnsNote), cites(o.sourceIds)],
    ['Other offers', cell(o.otherOffers, { sourceIds: o.sourceIds }), cites(o.sourceIds)],
    ['Commission rate', cell(null, { blankLabel: 'BLANK \u2014 F-05' }), '<span class="tiny muted">No official rate confirmed</span>'],
  ],
})}

${o.variations ? `<h2>Variations offered on the listing</h2>
${renderTable({
  head: ['Axis', 'Options as rendered', 'Observed selection'],
  rows: [
    ['Colour', o.variations.colour.map(esc).join(' \u00b7 '), esc(o.variations.observedSelected.colour)],
    ['Size', o.variations.size.map(esc).join(' \u00b7 '), esc(o.variations.observedSelected.size)],
  ],
  note: 'A variation family pools ratings at the parent level, so the aggregate rating above says less about any single size or colour than it appears to. ' + cites(o.sourceIds),
})}` : ''}

<h2>What was submitted, and where it went</h2>
${renderTable({
  head: ['Field', 'Value'],
  rows: [
    ['Submitted link', `<span class="mono tiny">${esc(x.intent.url)}</span>`],
    ['Submission reference', x.submissions.map((s) => `<span class="chip chip-neutral">${s}</span>`).join(' ') + (x.duplicateSubmission ? ' <span class="chip chip-warn">Submitted twice \u2014 F-07</span>' : '')],
    ['Submitted token', `<span class="mono">${esc(x.intent.token)}</span>`],
    ['Token length', `${x.intent.formatCheck.length} characters`],
    ['Is the token a valid ASIN format?', `<span class="chip chip-bad">NO</span> <span class="tiny">${esc(x.intent.formatCheck.verdict)}</span>`],
    ['Intended ASIN as asserted by the brief', '<span class="unverified">NONE ASSERTED</span>'],
    ['Observed final URL', `<span class="mono tiny">${esc(x.observed.rawRedirectUrl)}</span>`],
    ['tag parameter in the observed redirect', '<span class="chip chip-bad">ABSENT</span> <span class="tiny">No tracking ID anywhere in the chain \u2014 F-01</span>'],
  ],
  note: 'Submitted token and observed destination are separate rows in separate tables and are never merged. ' + cites(['S09', 'S05']),
})}

<h2>Redirect instrumentation observed</h2>
${renderTable({
  head: ['Parameter', 'Value', 'What it indicates'],
  rows: Object.entries(o.fallbackParams).map(([k, v]) => {
    const meaning = {
      'lv': 'A shuffle/rotation mode rather than a fixed destination',
      'btn_type': 'A search-suggestion button type',
      'sprefix': 'The resolver was seeded from a search for "diy home upgrades"',
      'sr': 'A search result position',
      'btn_ref': 'A per-request source token \u2014 different on every fetch',
      'channelId': 'A fixed channel identifier on the short-link service',
      'plpRedirect': 'A product-listing-page fallback path was used',
      'th': 'A variation/theme selector',
      'crid': 'A request identifier',
      'gaOptInStatus': 'A personalisation opt-in flag',
      'language': 'The rendered language',
    }[k] || 'Not interpreted \u2014 recorded verbatim only';
    return `<tr><td class="mono">${esc(k)}</td><td class="mono tiny">${esc(v)}</td><td class="tiny">${esc(meaning)}</td></tr>`;
  }),
  note: 'Recorded verbatim from the observed destination URL. This is an observation, not a claim that link.amazon is non-compliant \u2014 its compliance status is unresolved. ' + cites(['S09', 'S02']),
})}

<h2>Guides that reference this listing</h2>
${related.length ? `<ul class="tight">${related.map((g) => `<li><a href="${link(out, 'guides/' + g.slug + '.html')}">${esc(g.title)}</a></li>`).join('')}</ul>` : '<p class="small muted">None yet.</p>'}

<h2>Provenance of this record</h2>
<div class="callout callout-warn">
  <div class="callout-title">How these values were obtained</div>
  <p class="small">
    Fetched on ${STAMP} by an automated agent, signed out, with no Associates credentials, against
    amazon.com. The session\u2019s delivery location rendered as Herndon 20170. Amazon\u2019s Program
    Policies contain Agent Terms requiring an autonomous agent to identify itself in the user-agent
    string; this session cannot confirm that requirement was met, so the record is published as a
    good-faith observation with that caveat attached. A human should re-verify these values in a
    normal browser before they are used in promotional copy. ${cites(['S02'])}
    <a href="${link(out, 'flagged/index.html')}#F-08">Flag F-08</a>.
  </p>
</div>

</div>
<aside>
  ${priceBlock(x, out)}
  ${attributionStatus(x)}
  <p style="margin-top:1rem">
    ${outbound(o.canonicalListingUrl, `View listing on Amazon <span class="tiny">(${esc(o.asin)})</span>`, 'product', { class: 'btn btn-block', dataAttrs: { affiliate: 'pending-validation', asin: o.asin, linkId: x.slug } })}
  </p>
  <p class="tiny muted">Marked <code class="inline">rel="sponsored nofollow noopener noreferrer"</code>. Untagged.</p>

  <div class="card card-tight" style="margin-top:1rem">
    <h4 style="margin-top:0">Candidate Special Link</h4>
    <p class="tiny mono" style="word-break:break-all">https://www.amazon.com/dp/${esc(o.asin)}?tag=${esc(TRACKING_ID.value)}</p>
    <p class="tiny muted" style="margin-bottom:0"><strong>Not validated. Do not publish.</strong> Format illustration only \u2014 not generated by Associates Central, not clicked, not confirmed in any tracking report. <a href="${link(out, 'dashboard/link-management.html')}">Validation gate \u203a</a></p>
  </div>

  <div class="card card-tight" style="margin-top:1rem">
    <h4 style="margin-top:0">Cluster</h4>
    <p class="tiny"><strong>${esc(cluster.name)}</strong></p>
    <p class="tiny muted">${esc(cluster.basis)}</p>
    <p class="tiny" style="margin-bottom:0"><a href="${link(out, 'clusters/index.html')}">All clusters \u203a</a></p>
  </div>

  <div class="card card-tight" style="margin-top:1rem">
    <h4 style="margin-top:0">Sources for this page</h4>
    <ul class="tight tiny" style="margin-bottom:0">
      ${o.sourceIds.map((id) => { const s = sources.find((y) => y.id === id); return `<li>${cites([id])} ${outbound(s.url, esc(s.title), 'source')}</li>`; }).join('')}
    </ul>
  </div>
</aside>
</div>
`,
  };
}

/* ------------------------------------------------------------------ */

export function guidesIndex(out) {
  const byCluster = Object.values(clusters).map((c) => ({ c, gs: guides.filter((g) => g.cluster === c.id) }));
  return {
    title: 'Guides',
    description:
      'Question-shaped buyer guides for reversible home upgrades. No superlatives, no rankings, no search-volume claims, and no first-person experience claims.',
    activeKey: 'guides',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Guides', null]])}
<p class="kicker">Editorial</p>
<h1>Guides written as the questions buyers actually ask</h1>
<p class="dek">
  ${guides.length} articles, grouped into topic clusters. Four of them are labelled
  <strong>hypothesis only</strong>: the brief supplied those working titles, and none of the products
  in this register is an air fryer, so they are published unlinked from any product and marked as such.
</p>

<div class="callout callout-info">
  <div class="callout-title">What you will not find in these guides</div>
  <p class="small">
    No "best", no ranking, no popularity claim, no search-volume figure, no first-person
    "I tested this". No human has tested these products for this site, and the FTC Guides tie an
    endorsement to the endorser\u2019s actual experience \u2014 so the copy makes no experience claim at all.
    ${cites(['S10'])} <a href="${link(out, 'flagged/index.html')}#F-14">Flag F-14</a>.
  </p>
</div>

${byCluster
  .map(
    ({ c, gs }) => `<div class="rail-head">
  <h2>${esc(c.name)}${c.hypothesisOnly ? ' <span class="chip chip-warn">Hypothesis only</span>' : ''}</h2>
  <span class="tiny muted">${gs.length} guide${gs.length === 1 ? '' : 's'}</span>
</div>
<p class="small muted">${esc(c.basis)} ${c.sourceIds.length ? cites(c.sourceIds) : ''}</p>
${gs
  .map(
    (g) => `<article class="story">
  <p class="kicker">${esc(g.kind)}${g.meta ? ' \u00b7 method' : ''} \u00b7 ${esc(g.id)}</p>
  <h3><a href="${link(out, 'guides/' + g.slug + '.html')}">${esc(g.title)}</a></h3>
  <p class="small">${esc(g.dek)}</p>
  <p class="tiny muted">
    ${g.seasons.length ? 'Season: ' + g.seasons.map((s) => esc(seasons.find((y) => y.id === s).label)).join(', ') + ' \u00b7 ' : ''}
    ${g.productRefs.length ? 'References ' + g.productRefs.map((r) => `<span class="mono">${esc(p(r).observed.asin)}</span>`).join(', ') : 'No product mapped'}
    \u00b7 <a href="${link(out, 'guides/' + g.slug + '.html')}">Read \u203a</a>
  </p>
</article>`
  )
  .join('\n')}`
  )
  .join('\n')}

<h2>Publishing cadence</h2>
${renderTable({
  head: ['Element', 'Setting'],
  rows: [
    ['Statement', esc(cadence.statement)],
    ['Why it holds without discipline', esc(cadence.rationale)],
    ['What publication is measured by', esc(cadence.measuredBy)],
    ['How the next topic is chosen', esc(cadence.nextTopicRule)],
  ],
})}
<p class="small">
  Every guide appears in <a href="${link(out, 'sitemap.xml')}">sitemap.xml</a> and
  <a href="${link(out, 'feed.xml')}">feed.xml</a> automatically \u2014 both are generated from the same
  registry as these pages, so there is no second list to forget. Subscribe:
  <span class="mono tiny">${esc('https://kanlerxz87-cyber.github.io/DIYHOME3/feed.xml')}</span>
</p>
`,
  };
}

export function guidePage(g, out) {
  const c = clusters[g.cluster];
  const siblings = guides.filter((x) => x.cluster === g.cluster && x.id !== g.id);
  const mapped = g.productRefs.map((r) => p(r));

  // Convert the guide's section shape into renderable blocks.
  const blocks = [];
  for (const s of g.sections) {
    if (s.h) blocks.push({ h2: esc(s.h) });
    if (s.p) blocks.push({ p: s.p.map(esc) });
    if (s.table) blocks.push({ table: { head: s.table.head, rows: s.table.rows.map((r) => r.map(esc)), note: s.table.note ? esc(s.table.note) : null } });
    if (s.list) blocks.push({ list: s.list.map(esc) });
    if (s.observation) blocks.push({ observation: { text: s.observation.text, sourceIds: s.observation.sourceIds } });
    if (s.quote) blocks.push({ quote: s.quote });
    if (s.quote2) blocks.push({ quote: s.quote2 });
    if (s.note) blocks.push({ callout: { kind: 'warn', title: 'Status of this article', text: esc(s.note) } });
  }

  return {
    title: g.title,
    description: g.dek,
    activeKey: 'guides',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.title,
      description: g.dek,
      datePublished: '2026-11-20',
      dateModified: '2026-11-20',
      author: { '@type': 'Organization', name: AUTHOR.byline },
      publisher: { '@type': 'Organization', name: 'DIYHOME3' },
      isPartOf: { '@type': 'Collection', name: c.name },
    },
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Guides', 'guides/index.html'], [g.id, null]])}
<p class="kicker">${esc(c.name)} \u00b7 ${esc(g.kind)}${g.meta ? ' \u00b7 method' : ''}</p>
<h1>${esc(g.title)}</h1>
<p class="dek">${esc(g.dek)}</p>

<div class="byline">
  <span>By <b>${esc(AUTHOR.byline)}</b></span>
  <span class="tiny">${esc(AUTHOR.role)}</span>
  <span>Published <b>2026-11-20</b></span>
  ${g.seasons.length ? `<span>Season <b>${g.seasons.map((s) => esc(seasons.find((y) => y.id === s).label)).join(', ')}</b></span>` : '<span><b>Evergreen</b></span>'}
  <span><a href="${link(out, 'about/index.html')}">Editorial standards</a></span>
</div>

${g.hypothesisOnly ? `<div class="callout callout-warn">
  <div class="callout-title">Hypothesis only \u2014 no product mapped</div>
  <p class="small">
    This title was supplied in the project brief as a working editorial hypothesis. It is not a claim
    about popularity, search volume or product superiority. <strong>No product in this site\u2019s register
    is an air fryer or a cooking appliance</strong>, so this article carries no product mapping and no
    outbound product link. The mismatch is recorded as
    <a href="${link(out, 'flagged/index.html')}#F-06">flag F-06</a>.
  </p>
</div>` : ''}

<div class="grid grid-sidebar">
<div>
${renderBlocks(blocks, out)}

<hr class="rule"/>
<p class="small muted">
  Written by ${esc(AUTHOR.byline)}. ${esc(AUTHOR.note)}
</p>
</div>
<aside>
  <div class="card card-tight">
    <h4 style="margin-top:0">In this cluster</h4>
    <p class="tiny"><strong>${esc(c.name)}</strong></p>
    <p class="tiny muted">${esc(c.basis)}</p>
    ${siblings.length ? `<ul class="tight tiny">${siblings.map((s) => `<li><a href="${link(out, 'guides/' + s.slug + '.html')}">${esc(s.title)}</a></li>`).join('')}</ul>` : ''}
    <p class="tiny" style="margin-bottom:0"><a href="${link(out, 'clusters/index.html')}">All clusters \u203a</a></p>
  </div>

  ${mapped.length ? `<div class="card card-tight" style="margin-top:1rem">
    <h4 style="margin-top:0">Listings referenced</h4>
    ${mapped
      .map(
        (m) => `<p class="tiny" style="margin-bottom:.7rem">
      <a href="${link(out, 'products/' + m.slug + '.html')}"><strong>${esc(m.observed.listingH1)}</strong></a><br/>
      <span class="mono muted">${esc(m.observed.asin)}</span> \u00b7 ${money(m.observed.priceObserved)} observed<br/>
      <span class="chip chip-bad">Attribution inactive</span>
    </p>`
      )
      .join('')}
    <p class="tiny muted" style="margin-bottom:0">Referenced as verified listings. This article makes no claim that any of them is better than an alternative.</p>
  </div>` : ''}

  ${captureWidget(out)}

  <div class="card card-tight" style="margin-top:1rem">
    <h4 style="margin-top:0">Sources cited</h4>
    <ul class="tight tiny" style="margin-bottom:0">
      ${[...new Set(g.sections.flatMap((s) => [...(s.observation?.sourceIds || []), ...(s.quote?.sourceIds || []), ...(s.quote2?.sourceIds || [])]))]
        .map((id) => { const s = sources.find((y) => y.id === id); return `<li>${cites([id])} ${outbound(s.url, esc(s.title), 'source')}</li>`; })
        .join('') || '<li class="muted">No listing-specific facts asserted in this article, so no product source is cited.</li>'}
    </ul>
  </div>
</aside>
</div>
`,
  };
}

/* ------------------------------------------------------------------ */

export function clustersIndex(out) {
  return {
    title: 'Clusters and the seasonal calendar',
    description:
      'Topic clusters derived from observed Amazon browse-node structure, plus a seasonal calendar anchored only to verified dates.',
    activeKey: 'clusters',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Clusters', null]])}
<p class="kicker">Structure</p>
<h1>Topic clusters and the seasonal calendar</h1>
<p class="dek">
  A cluster is a pillar guide with supporting question-shaped guides around it, all linked both ways.
  These were derived from the browse-node structure Amazon itself rendered, not from a guess about
  what the niche should be.
</p>

${Object.values(clusters)
  .map((c) => {
    const gs = guides.filter((g) => g.cluster === c.id);
    const mapped = products.filter((x) => x.cluster === c.id);
    const pillar = gs.find((g) => g.kind === 'pillar');
    return `<section class="card" style="margin-bottom:1.2rem${c.hypothesisOnly ? ';border-left:4px solid var(--warn)' : ''}">
  <p class="kicker">${c.hypothesisOnly ? 'Hypothesis cluster \u2014 not live' : 'Live cluster'}</p>
  <h2 style="margin-top:0">${esc(c.name)}</h2>
  <p class="small muted">${esc(c.basis)} ${c.sourceIds.length ? cites(c.sourceIds) : ''}</p>

  ${pillar ? `<p class="small"><strong>Pillar:</strong> <a href="${link(out, 'guides/' + pillar.slug + '.html')}">${esc(pillar.title)}</a></p>` : '<p class="small muted"><strong>Pillar:</strong> none \u2014 a hypothesis cluster has no pillar until products are mapped to it.</p>'}

  ${mapped.length ? `<p class="small"><strong>Products mapped:</strong> ${mapped.map((m) => `<a href="${link(out, 'products/' + m.slug + '.html')}"><span class="mono">${esc(m.observed.asin)}</span></a>`).join(', ')}</p>` : '<p class="small"><strong>Products mapped:</strong> <span class="chip chip-neutral">none</span></p>'}

  <h3 style="margin-top:1rem">Guides in this cluster</h3>
  ${gs.length ? `<ul class="tight small">${gs.map((g) => `<li><a href="${link(out, 'guides/' + g.slug + '.html')}">${esc(g.title)}</a> <span class="tiny muted">\u2014 ${esc(g.kind)}</span></li>`).join('')}</ul>` : '<p class="small muted">None.</p>'}
</section>`;
  })
  .join('\n')}

<h2>Seasonal calendar</h2>
<p class="small">
  Two of the three windows below have a verified anchor read directly off the listings. The third is a
  planning slot with no demand claim attached, and it is labelled as such. A seasonal calendar built
  from guessed demand curves is worse than no calendar, because it looks like evidence.
</p>
${renderTable({
  head: ['Window', 'Dates', 'Anchor', 'Verified', 'Source'],
  rows: seasons.map(
    (s) => `<tr>
  <td><strong>${esc(s.label)}</strong></td>
  <td class="nowrap">${esc(s.window)}</td>
  <td class="tiny">${esc(s.anchor)}</td>
  <td>${s.verified ? '<span class="verified">Verified</span>' : '<span class="unverified">Planning slot</span>'}</td>
  <td>${s.sourceIds.length ? cites(s.sourceIds) : '\u2014'}</td>
</tr>`
  ),
})}

<div class="callout callout-ok">
  <div class="callout-title">The one genuinely verified seasonal fact in this build</div>
  <p class="small">
    All three listings rendered the same returns sentence on 2026-11-20: "For the 2026 holiday season,
    eligible items purchased between November 1 and December 31, 2026 can be returned until
    January 31, 2027." That is a real, dated, source-backed window with a direct bearing on a purchase
    decision \u2014 for a product that might not fit, the returns window is part of the price. ${cites(['S06', 'S07', 'S08'])}
  </p>
</div>
`,
  };
}

/* ------------------------------------------------------------------ */

export function comparePage(out) {
  return {
    title: 'Compare the three listings',
    description:
      'A comparison of the three verified listings on the criteria that actually differ, with no verdict and no ranking, because none is supported by the evidence.',
    activeKey: 'compare',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Compare', null]])}
<p class="kicker">Comparison</p>
<h1>Three listings, compared on what differs</h1>
<p class="dek">
  This is a comparison of <em>criteria</em>, not a ranking. A wallpaper smoothing tool, a paper towel
  holder and a pot rack are not substitutes for one another, so declaring a winner would be
  meaningless. What they do share is a buyer constraint, and that is worth setting out.
</p>

<div class="callout callout-warn">
  <div class="callout-title">No verdict is offered, and here is the reason</div>
  <p class="small">
    Nothing in the verified evidence establishes that any of these three products is better than an
    alternative, and no competitive set was collected. Ranking them would be a superiority claim with
    no source behind it. The FTC Guides require that an endorsement reflect an honest opinion actually
    held; this site holds none about these products. ${cites(['S10'])}
  </p>
</div>

<h2>What they share</h2>
${renderTable({
  head: ['Shared attribute', 'B08FKW9JRM', 'B0BSKQW2T2', 'B08DY9HRWD'],
  rows: [
    ['No permanent change required', 'Peel-and-stick tooling \u2014 the job itself is reversible', 'Self-adhesive option offered alongside drilling', 'Tool-free assembly; sits inside a cabinet'],
    ['Renter-compatible', 'Yes \u2014 nothing is fixed to the wall by the tool', 'Yes, in adhesive mode', 'Yes \u2014 no mounting required'],
    ['Low ticket', money(products[0].observed.priceObserved), money(products[1].observed.priceObserved), money(products[2].observed.priceObserved)],
    ['Amazon-fulfilled', 'Ships from Amazon', 'Ships from Amazon', 'Ships from Amazon'],
    ['Third-party seller of record', 'Art3d\u00ae', 'YH Urban', 'ORDORA Official'],
    ['Same holiday returns window', 'Until Jan 31, 2027', 'Until Jan 31, 2027', 'Until Jan 31, 2027'],
    ['Deal pricing on 2026-11-20', 'Black Friday Deal \u221215%', 'Black Friday Deal \u221215%', 'Black Friday Deal \u221226%'],
    ['Tracking tag present', '<span class="chip chip-bad">No</span>', '<span class="chip chip-bad">No</span>', '<span class="chip chip-bad">No</span>'],
  ],
  note: 'Observed ' + STAMP + '. ' + cites(['S06', 'S07', 'S08', 'S09']),
})}

<h2>Where they differ</h2>
${renderTable({
  head: ['Criterion', 'B08FKW9JRM', 'B0BSKQW2T2', 'B08DY9HRWD'],
  numCols: [],
  rows: [
    ['Amazon top-level department', 'Tools & Home Improvement', 'Home & Kitchen', 'Home & Kitchen'],
    ['Leaf browse node', 'Wallpaper Tools (164701011)', 'Paper Towel Holders (3744201)', 'Pot Racks (289824)'],
    ['Star rating', '4.6', '4.2', '4.4'],
    ['Ratings count', '26,432', '12,099', '18,835'],
    ['Bought in past month', '20K+', '8K+', '1K+'],
    ['Badge rendered', "Amazon's Choice", "Amazon's Choice", 'None'],
    ['Price anchor used by Amazon', 'Typical price $5.99', 'Typical price $7.99', 'List Price $23.99'],
    ['Price gated behind membership', 'No', 'No', 'Yes \u2014 Prime only'],
    ['Variations offered', 'Not captured', 'Not captured', '4 colours \u00d7 8 heights'],
    ['Brand store equals seller', 'Yes', '<strong>No</strong> \u2014 niffgaff store, sold by YH Urban', 'Yes'],
    ['Brand named in the listing title', 'Yes \u2014 Art3d', '<strong>No</strong>', 'Yes \u2014 ORDORA (in the page title)'],
    ['Stock status captured', 'Not captured', 'Not captured', 'In Stock'],
  ],
  note: 'The two anchors are defined differently by Amazon and are not interchangeable. "Typical Price" is a 90-day median paid by customers; "List Price" is a suggested retail figure that Amazon states may not reflect the prevailing market price. ' + cites(['S06', 'S07', 'S08']),
})}

<h2>The questions a buyer should put to each</h2>
${renderTable({
  head: ['Product', 'The question that actually decides it', 'Guide'],
  rows: [
    ['B08FKW9JRM', 'Am I hanging soft film, rigid tile, or both \u2014 and will this edge crease the soft one?', `<a href="${link(out, 'guides/peel-and-stick-tool-kit-what-to-compare.html')}">What belongs in a tool kit</a>`],
    ['B0BSKQW2T2', 'What is under my cabinet at the mounting point, and do I need one-handed tearing?', `<a href="${link(out, 'guides/paper-towel-holder-mounting-comparison.html')}">Under-cabinet or wall-mounted</a>`],
    ['B08DY9HRWD', 'What is my clear height at the front edge, and is the stated limit a diameter or a weight?', `<a href="${link(out, 'guides/pot-rack-vertical-clearance-checklist.html')}">How much clearance does a pot rack need</a>`],
    ['All three', 'Adhesive or screws, given a kitchen\u2019s heat, steam and grease cycle?', `<a href="${link(out, 'guides/adhesive-or-drilling-kitchen-mounting.html')}">Adhesive or drilling</a>`],
    ['All three', 'Is the price I am looking at a standing price or a limited-time deal, and against which anchor?', `<a href="${link(out, 'guides/how-to-read-an-amazon-listing-without-being-led.html')}">Reading a listing without being led</a>`],
  ],
})}

<h2>Side-by-side outbound links</h2>
<p class="small">All three are canonical, untagged, and marked <code class="inline">rel="sponsored"</code>. Attribution is inactive site-wide \u2014 <a href="${link(out, 'flagged/index.html')}#F-01">F-01</a>.</p>
<div class="grid grid-3">
  ${products
    .map(
      (x) => `<div class="card card-tight">
    <h4 style="margin-top:0">${esc(x.observed.asin)}</h4>
    <p class="tiny">${esc(x.observed.listingH1)}</p>
    <p class="tiny"><strong>${money(x.observed.priceObserved)}</strong> observed \u00b7 ${x.observed.starRating.toFixed(1)}\u2605</p>
    <p style="margin-bottom:0">${outbound(x.observed.canonicalListingUrl, 'View listing', 'product', { class: 'btn btn-outline btn-block tiny', dataAttrs: { affiliate: 'pending-validation', asin: x.observed.asin, linkId: x.slug } })}</p>
    <p class="tiny" style="margin:.5rem 0 0"><a href="${link(out, 'products/' + x.slug + '.html')}">Full record \u203a</a></p>
  </div>`
    )
    .join('\n  ')}
</div>
`,
  };
}

/* ------------------------------------------------------------------ */

export function flaggedPage(out) {
  const sorted = [...flags].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.id.localeCompare(b.id));
  const groups = [
    ['critical', 'Critical'],
    ['high', 'High'],
    ['medium', 'Medium'],
    ['low', 'Low'],
    ['info', 'Informational'],
  ];

  return {
    title: 'Flagged for Review',
    description:
      'Every irregularity, unverified value and gated capability found in this build, with its evidence, its official source links, and the specific action needed to clear it.',
    activeKey: 'flagged',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Flagged for Review', null]])}
<p class="kicker">Needs your eyes</p>
<h1>Flagged for Review</h1>
<p class="dek">
  ${flags.length} items. Nothing here blocked the build or the merge \u2014 per the project brief, flagged
  irregularities and unverified items are published rather than hidden, so they can be reviewed after
  the site is live. Each one has its evidence, its official source links, and the specific action
  needed to clear it.
</p>

<div class="metrics">
  <div class="metric"><div class="metric-label">Total flags</div><div class="metric-value">${flagCounts.total}</div></div>
  <div class="metric"><div class="metric-label">Critical</div><div class="metric-value">${flagCounts.critical || 0}</div></div>
  <div class="metric"><div class="metric-label">High</div><div class="metric-value">${flagCounts.high || 0}</div></div>
  <div class="metric"><div class="metric-label">Medium</div><div class="metric-value">${flagCounts.medium || 0}</div></div>
  <div class="metric"><div class="metric-label">Low</div><div class="metric-value">${flagCounts.low || 0}</div></div>
  <div class="metric"><div class="metric-label">Informational</div><div class="metric-value">${flagCounts.info || 0}</div></div>
  <div class="metric"><div class="metric-label">Gated (human required)</div><div class="metric-value">${flagCounts.gated}</div></div>
  <div class="metric"><div class="metric-label">By design</div><div class="metric-value">${flagCounts.byDesign}</div></div>
</div>

<div class="callout callout-gate">
  <div class="callout-title">If you read only one thing</div>
  <p class="small">
    <strong>F-01.</strong> None of the three resolved listings carried a tracking tag, and
    <span class="mono">shopnow047c-20</span> does not appear anywhere in the observed redirect chain.
    The site is live, useful and fully compliant in its disclosure, but as published it earns nothing.
    Fixing it is a single data change once a human has validated one link per product in Associates Central.
  </p>
</div>

<h2>Quick index</h2>
<div class="pill-nav">
  ${sorted.map((f) => `<a href="#${esc(f.id)}">${esc(f.id)}</a>`).join('\n  ')}
</div>

${groups
  .map(([sev, label]) => {
    const list = sorted.filter((f) => f.severity === sev);
    if (!list.length) return '';
    return `<h2>${esc(label)} severity <span class="tiny muted">(${list.length})</span></h2>
${list
  .map(
    (f) => `<article class="flag-card flag-${f.severity}" id="${esc(f.id)}">
  <div class="flag-head">
    <span class="flag-id">${esc(f.id)}</span>
    <span class="chip chip-${sev === 'critical' ? 'bad' : sev === 'info' ? 'neutral' : sev === 'low' ? 'info' : 'warn'}">${esc(f.severity)}</span>
    <span class="chip chip-neutral">${esc(f.status)}</span>
    <span class="chip chip-neutral">${esc(f.category)}</span>
    <h3>${esc(f.title)}</h3>
  </div>
  <div class="flag-body">
    <p>${esc(f.summary)}</p>
    ${f.evidence ? `<span class="label">Evidence</span><p class="evidence">${esc(f.evidence)}</p>` : ''}
    ${f.impact ? `<span class="label">Impact</span><p>${esc(f.impact)}</p>` : ''}
    ${f.action ? `<span class="label">Required action</span><p>${esc(f.action)}</p>` : ''}
    ${f.blocks ? `<span class="label">Blocks</span><p>${f.blocks.map(esc).join(', ')}</p>` : ''}
    <p class="tiny" style="margin-top:.7rem"><span class="label" style="display:inline;margin-right:.4rem">Sources</span>${f.sourceIds.length ? f.sourceIds.map((id) => { const s = sources.find((y) => y.id === id); return outbound(s.url, `${id} \u2014 ${esc(s.owner)}`, 'source', { class: 'src' }) + ' '; }).join('') : '<span class="muted">No external source \u2014 this flag concerns this build\u2019s own configuration.</span>'}</p>
  </div>
</article>`
  )
  .join('\n')}`;
  })
  .join('\n')}

<h2>Unverified values across the site</h2>
<p class="small">
  Every cell rendered as <span class="unverified">UNVERIFIED</span> or
  <span class="unverified">BLANK</span> anywhere on this site, in one place. None was inferred and none
  was filled from a third-party source.
</p>
${renderTable({
  head: ['Field', 'Where it appears', 'Why it is blank', 'Flag'],
  rows: [
    ['Commission rate (all 3 products)', 'Product register, product pages, commission dashboard', 'No official rate confirmed; four third-party sources gave five different numbers', 'F-05'],
    ['Commission schedule that applies', 'Commission dashboard', 'Standard off-site and onsite are different schedules and neither was confirmed for these browse nodes', 'F-05'],
    ['Intended ASIN as asserted', 'Link-intent record, product pages', 'The brief supplied links only and never asserted an ASIN', 'F-02'],
    ['Intended listing URL', 'Link-intent record', 'Never supplied', 'F-02'],
    ['Confirmation date for intent', 'Link-intent record', 'No human has confirmed intent', 'F-02'],
    ['Tracking ID enrollment status', 'Masthead, link management, flagged', 'Requires an authenticated Associates Central session', 'F-16'],
    ['Named human author / reviewer', 'Every guide byline, about page', 'No person has been assigned or has read the copy', 'F-14'],
    ['Stock status (2 of 3 listings)', 'Product register, product pages', 'Not read on the captured portion of the page; not inferred from the presence of a buybox', 'F-19'],
    ['Variations (2 of 3 listings)', 'Product pages', 'Not captured in this session', 'F-19'],
    ['Aggregate click and conversion data', 'Click tracking, conversion, campaign ledger', 'No collector deployed and no authorised report available', 'F-11, F-20'],
    ['Search Console query data', 'SEO dashboard', 'Property not verified; no account access', 'F-12'],
    ['Reader-capture endpoint', 'Capture widget on every page', 'No endpoint configured; the form says so instead of silently discarding input', 'F-13'],
    ['Campaign ledger rows', 'Campaign ledger', 'Intentionally empty until an authorised first-party report exists', 'F-20'],
    ['Revenue forecast / conversion score', 'Nowhere \u2014 prohibited', 'Prohibited by the brief and unsupported by S01 \u00a74', 'F-20'],
  ],
})}

<h2>Links for manual review</h2>
<p class="small">Every official source used in this build, so each can be opened and checked directly.</p>
<div class="tablewrap"><table class="compact">
<thead><tr><th>ID</th><th>Type</th><th>Owner</th><th>Document</th><th>Document date</th><th>Checked</th></tr></thead>
<tbody>${sourceTableRows().join('\n')}</tbody>
</table></div>
`,
  };
}
