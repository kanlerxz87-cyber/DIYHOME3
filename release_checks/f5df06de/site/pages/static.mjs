/**
 * STATIC PAGES — about, methodology, source register, compliance hub, executive
 * summary, privacy and the 404. Each returns { title, description, activeKey, body }.
 */

import { products, submissions, clusters, TRACKING_ID } from '../data/products.mjs';
import { guides, seasons, AUTHOR } from '../data/guides.mjs';
import { flags, flagCounts } from '../data/flags.mjs';
import { sources } from '../data/sources.mjs';
import { EVENTS } from './dashboard.mjs';
import {
  esc, cites, money, int, link, outbound, renderTable, breadcrumbs,
  AMAZON_DISCLOSURE, AMAZON_CONTENT_DISCLAIMER, AMAZON_PRICE_DISCLAIMER,
  sourceTableRows, NAV, NAV_LABEL_RATIONALE, SITE,
} from '../layout.mjs';

const STAMP = '2026-11-20 06:00 UTC';

/* ------------------------------------------------------------------ */

export function aboutPage(out) {
  return {
    title: 'About, authorship and editorial standards',
    description:
      'Who publishes this site, why the byline is a desk rather than a person, and the editorial rules the build enforces mechanically.',
    activeKey: null,
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['About', null]])}
<p class="kicker">About</p>
<h1>Authorship, brand and editorial standards</h1>

<h2>Who publishes this</h2>
<p class="lede">
  ${esc(SITE.name)} is an Amazon Associates property covering reversible, low-cost home upgrades.
  It is published as a static site from a public repository, with every claim traceable to a source
  and every gap marked rather than filled.
</p>

<div class="card card-warn">
  <h3 style="margin-top:0">The byline is a desk, not a person \u2014 on purpose</h3>
  <p class="small">
    Every article on this site is bylined <strong>${esc(AUTHOR.byline)}</strong> and labelled
    <em>${esc(AUTHOR.role)}</em>. No named human has tested, owned or used any product in this register
    for this site.
  </p>
  <p class="small">
    FTC 16 CFR \u00a7255.1(a) requires that an endorsement reflect the honest opinions, findings, beliefs
    or experience of the endorser, and \u00a7255.3 requires that where an advertisement presents the
    endorser as an expert, the endorser must actually have that expertise. Amazon\u2019s Operating
    Agreement \u00a75 separately forbids misrepresenting or embellishing the relationship with Amazon.
    Inventing a persona with a biography would violate all three at once, so no persona exists.
    ${cites(['S10', 'S01'])}
  </p>
  <p class="small" style="margin-bottom:0">
    ${esc(AUTHOR.note)} <a href="${link(out, 'flagged/index.html')}#F-14">Flag F-14</a>.
  </p>
</div>

<h2>Editorial standards, and how each is enforced</h2>
${renderTable({
  head: ['Standard', 'Why', 'Enforcement'],
  rows: [
    ['Every factual claim about a specific listing carries a link to an official source', 'The project verification rule', 'The data layer separates official from third-party sources; only official ids can be passed to a value cell. CI fails on a third-party id in a cell'],
    ['A value with no official source is left blank and marked UNVERIFIED', 'Never infer or fill in values', 'cell() renders null as an UNVERIFIED chip. CI fails if a null field is rendered as a value'],
    ['No superlatives, rankings or superiority claims', 'No verified source establishes that any product here is better than an alternative', 'CI scans for "best ", "#1", "top-rated", "number one"'],
    ['No first-person experience claims', 'FTC \u00a7255.1(a)', 'CI scans for "I tested", "we tested", "I tried", "we tried", "in my experience", "we found"'],
    ['No search-volume, keyword-difficulty or traffic figures', 'No authorised keyword or analytics source was available', 'CI scans for volume and impression phrasing in editorial copy'],
    ['No customer review text quoted', 'Endorsement obligations plus IP License limits on Program Content', 'No review text exists in the data layer to quote'],
    ['No Amazon product imagery', 'IP License \u00a72(h) allows storing an image link for only 24 hours; a static site cannot refresh', 'CI fails on any m.media-amazon.com reference in built output'],
    ['Banded figures stay banded', '"20K+ bought in past month" is not 20,000', 'Reproduced as the rendered string'],
    ['Prices carry a timestamp and the required disclaimer', 'IP License \u00a72(i)', 'Rendered by priceBlock(); the verbatim disclaimer is also site-wide in the footer'],
    ['Hypothesis articles are labelled as hypotheses', 'The brief\u2019s air-fryer titles are working titles, not claims', 'Every hypothesisOnly guide renders a status callout and is excluded from product mapping'],
  ],
  note: 'Enforcement lives in tools/verify.mjs and runs in CI on every push and pull request. ' + cites(['S10', 'S02', 'S12']),
})}

<h2>Navigation labels, and why they say what they say</h2>
<p class="small">SG-27 in the brief asks for navigation labels. This is the set, with the reasoning recorded so it can be argued with.</p>
${renderTable({
  head: ['Label', 'Rationale'],
  rows: NAV_LABEL_RATIONALE.map(([l, r]) => `<tr><td><strong>${esc(l)}</strong></td><td>${esc(r)}</td></tr>`),
  note: 'Live navigation: ' + NAV.map((n) => `<a href="${link(out, n.href)}">${esc(n.label)}</a>`).join(' \u00b7 '),
})}

<h2>Brand</h2>
<div class="grid grid-2">
  <div class="card card-tight">
    <h4 style="margin-top:0">Name and mark</h4>
    <p class="small"><strong>DIYHOME3</strong>. The mark is an inline SVG \u2014 a roofline over a doorway with a fixing point at the centre. It is drawn in code, so it costs no HTTP request and no licence.</p>
    <p class="small muted" style="margin-bottom:0">Wordmark set in a system serif; body in a system sans. No webfont is loaded, because a font request is a third-party dependency and a privacy question.</p>
  </div>
  <div class="card card-tight">
    <h4 style="margin-top:0">Imagery policy</h4>
    <p class="small">No Amazon product photography appears anywhere on this site, and no synthetic product imagery is generated either \u2014 an invented picture of a real ASIN would misrepresent it. All imagery is original abstract artwork describing the <em>category</em>, never a product.</p>
    <p class="small muted" style="margin-bottom:0">Licensing basis: IP License \u00a72(h). ${cites(['S02'])} See <a href="${link(out, 'flagged/index.html')}#F-09">F-09</a>.</p>
  </div>
</div>

<h2>What this site is not</h2>
<ul class="checklist">
  <li><strong>Not a storefront.</strong> It leads with questions and evidence, not with buy buttons. Every product page states plainly that attribution is inactive.</li>
  <li><strong>Not a review site.</strong> It publishes comparison criteria. No verdict, no star rating of its own, no ranking.</li>
  <li><strong>Not an endorsement.</strong> No human here has used these products, and the copy never implies otherwise.</li>
  <li><strong>Not a forecast.</strong> No revenue projection, no conversion score, no traffic estimate, anywhere.</li>
  <li><strong>Not affiliated with Amazon beyond the Associates relationship.</strong> Nothing on this site implies sponsorship, endorsement or support by Amazon.</li>
</ul>

<h2>Contact and corrections</h2>
<p class="small">
  Corrections are handled in the open. Every page is generated from
  <a href="${SITE.repo}" rel="noopener noreferrer">a public repository</a>, so a factual error can be
  raised as an issue and fixed in the data file that generated it \u2014 one edit, and the correction
  reaches the page, the register, the sitemap and the feed together.
</p>
<p class="small">
  No contact email address is published, because none was supplied and inventing one would create an
  inbox nobody reads. That is recorded as an open item rather than papered over with a plausible address.
</p>
`,
  };
}

/* ------------------------------------------------------------------ */

export function methodologyPage(out) {
  return {
    title: 'Verification method',
    description:
      'How every value on this site was obtained, what counts as an official source, and what happens to a value that cannot be confirmed.',
    activeKey: null,
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Verification method', null]])}
<p class="kicker">Method</p>
<h1>How this site was verified</h1>
<p class="dek">
  The rule the whole build follows: every table row that asserts a fact has a source link to an
  official site. If a value cannot be confirmed from an official source, the cell is left blank and
  flagged as unverified. Nothing is inferred and nothing is filled in.
</p>

<h2>What counts as an official source</h2>
${renderTable({
  head: ['Fact being asserted', 'Official source domain', 'Why that domain'],
  rows: [
    ['ASIN format and definition', 'sell.amazon.com', 'Amazon defines its own identifier'],
    ['Associate disclosure wording', 'affiliate-program.amazon.com', 'The Operating Agreement is the contract that imposes it'],
    ['Link format and disqualifications', 'affiliate-program.amazon.com', 'Same'],
    ['Attribution windows', 'affiliate-program.amazon.com', 'The Commission Income Statement defines them'],
    ['Image and price caching limits', 'affiliate-program.amazon.com', 'The IP License sets them'],
    ['Agent conduct requirements', 'affiliate-program.amazon.com', 'IP License \u00a74'],
    ['Commission rates', 'affiliate-program.amazon.com (Appendix)', 'Only Amazon sets its own rates'],
    ['Listing title, price, rating, seller, category', 'www.amazon.com', 'The listing is the record'],
    ['Where a short link resolves to', 'link.amazon and www.amazon.com', 'The redirect is the evidence'],
    ['Endorsement and disclosure law', 'ftc.gov', 'The FTC issues 16 CFR Part 255'],
    ['How to mark a paid link in HTML', 'developers.google.com', 'Google specifies rel="sponsored"'],
  ],
})}

<h2>What does not count</h2>
<p class="small">
  Affiliate blogs, SEO tools and rate aggregators are not sources for data, however confident they
  sound. Three were retrieved in this session while looking for commission rates, and they disagreed
  with each other so thoroughly that the disagreement became the evidence for leaving the field blank:
</p>
${renderTable({
  head: ['Third-party page', 'Kitchen rate claimed', 'Home / Home Improvement', 'Tools'],
  rows: [
    ['amawp.com', '4.50%', '3.00%', '3.00%'],
    ['sozee.ai \u2014 off-site table', '4.5%', '3%', '3%'],
    ['sozee.ai \u2014 onsite table, same page', '1.25%', '1.25%', '1.75%'],
    ['earnifyhub.com', '5%', '8%', 'not stated'],
    ['Amazon\u2019s own ONSITE schedule (S04)', '1.25%', '3.00%', '1.75%'],
  ],
  note: 'These are recorded in the source register with official: false and are used only to demonstrate that the rate is unresolvable from third-party material. No cell on this site is filled from any of them. ' + cites(['S04', 'S13', 'S14', 'S15']),
})}

<h2>The procedure, step by step</h2>
<ol class="tight">
  <li><strong>Take the supplied input verbatim.</strong> All four links were recorded exactly as given, including the duplicate. Nothing was normalised, deduplicated or corrected before recording.</li>
  <li><strong>Resolve each link and record the destination.</strong> Fetched signed out, with no Associates credentials, on ${STAMP.slice(0, 10)}. The full destination URL was captured character for character, including every query parameter.</li>
  <li><strong>Check the token against the published identifier definition.</strong> A pure format test: length and character set, against Amazon\u2019s own definition. This asserts nothing about whether the token exists in Amazon\u2019s catalogue.</li>
  <li><strong>Fetch the canonical listing and read only what is unambiguously labelled.</strong> Titles from the H1, ratings from the rating element, prices from the buybox \u2014 including, for one product, a machine-readable <code class="inline">displayPrice</code> value in the page\u2019s embedded JSON, which corroborates the rendered text.</li>
  <li><strong>Refuse anything ambiguous.</strong> Where a number appeared in the page but its attribution was not certain, it was left blank rather than adopted. Stock status for two of three listings is blank for exactly this reason.</li>
  <li><strong>Record the retrieval method honestly.</strong> Two documents were fetched directly; several were read through a search index extract of the same official URL, and one direct fetch failed with an HTTP error. Each source entry states which.</li>
  <li><strong>Separate intent from observation.</strong> The submitted token and the observed ASIN live in different objects in the data layer and are rendered in different tables. No code path merges them.</li>
  <li><strong>Gate what cannot be automated.</strong> Anything requiring an authenticated Associates Central session, a legal judgement, or a named human is left open and published as a flag rather than approximated.</li>
  <li><strong>Enforce it in CI.</strong> tools/verify.mjs re-checks the built output on every push and pull request, so the standards survive the first edit.</li>
</ol>

<h2>Limits of this method</h2>
<ul class="tight">
  <li>Every value is a single observation from one session, one marketplace, one geography and one date. Prices, ratings and banded sales figures all drift.</li>
  <li>The research was performed by an automated agent. Amazon\u2019s Agent Terms require an agent to identify itself in the user-agent string, and this session cannot confirm that requirement was met. That is disclosed as <a href="${link(out, 'flagged/index.html')}#F-08">F-08</a> rather than quietly ignored.</li>
  <li>No competitor set, keyword data, review text, or historical pricing was collected. The competition surface explains what it would take and why it was not attempted.</li>
  <li>Several official documents were read via search index extract rather than direct fetch. Links are provided on the <a href="${link(out, 'flagged/index.html')}">Flagged for Review</a> page for manual checking.</li>
</ul>

<h2>The source register</h2>
<p class="small">Full detail, including verbatim quotations relied upon and how each document was accessed, is on <a href="${link(out, 'methodology/sources.html')}">the source register page</a>.</p>
`,
  };
}

export function sourcesPage(out) {
  return {
    title: 'Source register',
    description:
      'Every source cited on this site, official and third-party, with its document date, retrieval method, and the verbatim text relied upon.',
    activeKey: null,
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Verification method', 'methodology/index.html'], ['Source register', null]])}
<p class="kicker">Method</p>
<h1>Source register</h1>
<p class="dek">
  ${sources.length} entries. ${sources.filter((s) => s.official).length} are official sources owned by
  the body that defines the fact. ${sources.filter((s) => !s.official).length} are third-party pages,
  recorded only as evidence that the commission rate is unresolvable from non-official material.
</p>

<div class="tablewrap"><table class="compact">
<thead><tr><th>ID</th><th>Type</th><th>Owner</th><th>Document</th><th>Document date</th><th>Checked</th></tr></thead>
<tbody>${sourceTableRows().join('\n')}</tbody>
</table></div>

<h2>Detail</h2>
${sources
  .map(
    (s) => `<article class="card card-tight" id="${esc(s.id)}" style="margin-bottom:1rem;${s.official ? '' : 'border-left:3px solid var(--warn)'}">
  <div class="flag-head">
    <span class="flag-id">${esc(s.id)}</span>
    ${s.official ? '<span class="verified">Official</span>' : '<span class="unverified">Third party</span>'}
    <h3 style="font-family:var(--sans);font-size:.98rem;margin:0">${esc(s.title)}</h3>
  </div>
  <p class="tiny muted" style="margin:.2rem 0 .5rem">
    ${esc(s.owner)} \u00b7 ${esc(s.docDate)} \u00b7 checked ${esc(s.checked)} \u00b7 ${outbound(s.url, 'open source', 'source')}
  </p>
  <p class="tiny"><strong>Access:</strong> ${esc(s.access)}</p>
  <p class="tiny"><strong>Quotation relied upon:</strong> \u201c${esc(s.quote)}\u201d</p>
  <p class="tiny" style="margin-bottom:0"><strong>Used for:</strong></p>
  <ul class="tight tiny" style="margin-top:.2rem">${s.relied_on.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
</article>`
  )
  .join('\n')}
`,
  };
}

/* ------------------------------------------------------------------ */

export function complianceIndex(out) {
  return {
    title: 'Compliance hub',
    description:
      'The disclosure, the Amazon Associates programme rules, the FTC endorsement guidance, and the privacy position of this site in one place.',
    activeKey: 'compliance',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Compliance', null]])}
<p class="kicker">Compliance</p>
<h1>Compliance hub</h1>
<p class="dek">
  Four obligations apply to this site, from four different directions. They are separated here because
  they have different owners and different failure modes, and because conflating them is how affiliate
  sites end up compliant with one and in breach of another.
</p>

<div class="grid grid-2">
  <a class="tile" href="${link(out, 'compliance/disclosure.html')}">
    <span class="tile-title">1 \u00b7 Disclosure</span>
    <span class="tile-meta">The Amazon Associates statement, its exact wording, and where it appears on every page. Plus the FTC clear-and-conspicuous standard.</span>
  </a>
  <a class="tile" href="${link(out, 'compliance/associates-policy.html')}">
    <span class="tile-title">2 \u00b7 Associates programme rules</span>
    <span class="tile-meta">Special Link format, disqualifying purchase types, attribution windows, IP License limits on images, prices and caching, and the Agent Terms.</span>
  </a>
  <a class="tile" href="${link(out, 'compliance/ftc.html')}">
    <span class="tile-title">3 \u00b7 FTC endorsement guidance</span>
    <span class="tile-meta">16 CFR Part 255: honest experience, expert qualification, material connections. Why this site makes no experience claim at all.</span>
  </a>
  <a class="tile" href="${link(out, 'compliance/privacy.html')}">
    <span class="tile-title">4 \u00b7 Privacy and data</span>
    <span class="tile-meta">No cookies, no third-party scripts, no personal data. What the first-party counter does and does not record.</span>
  </a>
</div>

<h2>The gate</h2>
<div class="callout callout-gate">
  <div class="callout-title">Compliance is in the build, not beside it</div>
  <p class="small">
    Thirteen checks run in CI on every push and pull request and fail the build on a violation. Seven
    further obligations cannot be checked by a machine at all, because they need an authenticated
    Associates Central session or a legal judgement. Both lists are published in full, with the current
    state of each, on the
    <a href="${link(out, 'dashboard/compliance-gate.html')}">compliance gate dashboard</a>.
  </p>
</div>

<h2>Current compliance state</h2>
${renderTable({
  head: ['Obligation', 'Owner', 'State', 'Detail'],
  rows: [
    ['Site-level Associate statement, verbatim', 'Operating Agreement \u00a75', '<span class="chip chip-ok">Satisfied</span>', `<a href="${link(out, 'compliance/disclosure.html')}">Disclosure</a>`],
    ['Statement above the fold on every page', 'Associates guidance (clear and conspicuous)', '<span class="chip chip-ok">Satisfied</span>', 'Part of the page shell; cannot be omitted'],
    ['Statement repeated in the footer', 'Project requirement', '<span class="chip chip-ok">Satisfied</span>', 'Part of the page shell'],
    ['Link-level disclosure near each product link', 'Associates guidance', '<span class="chip chip-ok">Satisfied</span>', 'Each product page carries an attribution-status callout beside the button'],
    ['Paid links marked rel="sponsored"', 'Google Search Central', '<span class="chip chip-ok">Satisfied</span>', 'Single emitter; CI-enforced'],
    ['Links use Amazon\u2019s tagged Special Link format', 'Operating Agreement \u00a71', '<span class="chip chip-bad">Not satisfied \u2014 gated</span>', `<a href="${link(out, 'flagged/index.html')}#F-15">F-15</a>`],
    ['Tracking ID active and site registered on the account', 'Associates guidance', '<span class="unverified">Unverified</span>', `<a href="${link(out, 'flagged/index.html')}#F-16">F-16</a>`],
    ['Price displays stamped and disclaimed', 'IP License \u00a72(i)', '<span class="chip chip-ok">Satisfied</span>', 'Timestamp on every price; verbatim disclaimer site-wide'],
    ['Program Content text disclaimer', 'IP License \u00a72(k)', '<span class="chip chip-ok">Satisfied</span>', 'Verbatim in the footer of every page'],
    ['No stored or cached product imagery', 'IP License \u00a72(h)', '<span class="chip chip-ok">Satisfied</span>', 'No Amazon image is embedded or linked; CI-enforced'],
    ['No prohibited paid search placement', 'Commission Income Statement \u00a72(c)', '<span class="chip chip-ok">Satisfied</span>', 'No paid search activity of any kind'],
    ['No search-engine-generated links', 'Commission Income Statement \u00a72(d)', '<span class="chip chip-ok">Satisfied</span>', 'No links are placed on any search engine'],
    ['No endorsements beyond actual experience', 'FTC 16 CFR \u00a7255.1(a)', '<span class="chip chip-ok">Satisfied</span>', 'No experience claim is made anywhere; CI-enforced'],
    ['No implied expert endorsement', 'FTC 16 CFR \u00a7255.3', '<span class="chip chip-ok">Satisfied</span>', 'Byline is a desk label, not a credentialed person'],
    ['Named human reviewer assigned', 'FTC \u00a7255.1(a), \u00a7255.3', '<span class="chip chip-bad">Open</span>', `<a href="${link(out, 'flagged/index.html')}#F-14">F-14</a>`],
    ['Agent identified itself when accessing Program Content', 'IP License \u00a74', '<span class="unverified">Unconfirmed</span>', `<a href="${link(out, 'flagged/index.html')}#F-08">F-08</a>`],
    ['No cookies or third-party tracking', 'GDPR / UK GDPR / Swiss FADP', '<span class="chip chip-ok">Satisfied</span>', `<a href="${link(out, 'compliance/privacy.html')}">Privacy</a>`],
    ['Lawful basis for reader capture', 'GDPR / UK GDPR / Swiss FADP; CAN-SPAM', '<span class="chip chip-bad">Open \u2014 capture disabled</span>', `<a href="${link(out, 'flagged/index.html')}#F-13">F-13</a>`],
  ],
  note: 'Satisfied means the obligation is met on the evidence available in this build. It is not legal advice and it does not substitute for the owner\u2019s own review of the Operating Agreement.',
})}
`,
  };
}

export function disclosurePage(out) {
  return {
    title: 'Disclosure',
    description:
      'The full affiliate disclosure for this site, the exact wording required by the Amazon Associates Operating Agreement, and where it appears.',
    activeKey: 'compliance',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Compliance', 'compliance/index.html'], ['Disclosure', null]])}
<p class="kicker">Compliance \u00b7 1</p>
<h1>Disclosure</h1>

<div class="card card-warn" style="margin-bottom:1.5rem">
  <p style="margin:0;font-size:1.1rem"><strong>${esc(AMAZON_DISCLOSURE)}</strong></p>
</div>

<h2>What that means in plain terms</h2>
<p>
  This site participates in the Amazon Associates programme, an affiliate advertising programme. When
  a reader follows a product link from here to Amazon and then buys something, the operator of this
  site may receive a commission. The price the reader pays is not affected by arriving via this site.
</p>
<p>
  Every outbound product-intent link on this site is also marked in the HTML with
  <code class="inline">rel="sponsored nofollow noopener noreferrer"</code>, which tells search engines
  that the link exists because of a commercial arrangement rather than because it is an independent
  editorial recommendation. ${cites(['S12'])}
</p>

<h2>The current state of attribution \u2014 read this</h2>
<div class="callout callout-bad">
  <div class="callout-title">No link on this site currently carries a tracking tag</div>
  <p class="small">
    As published, every product link points at a canonical, untagged Amazon listing. The disclosure
    above is displayed because the <em>intent</em> of these links is commercial and because the site is
    built to participate in the programme. But no click currently attributes to
    <span class="mono">${esc(TRACKING_ID.value)}</span>, because the supplied links resolved without any
    <code class="inline">tag</code> parameter and no tagged Special Link has yet been validated in
    Associates Central. ${cites(['S09'])}
  </p>
  <p class="small" style="margin-bottom:0">
    This is stated openly rather than left implicit. A reader who clicks a product link here is not
    currently generating a commission for this site.
    <a href="${link(out, 'flagged/index.html')}#F-01">F-01</a> \u00b7
    <a href="${link(out, 'dashboard/link-management.html')}">Link management</a>.
  </p>
</div>

<h2>The exact wording, and where it comes from</h2>
<blockquote class="pull">
  You must clearly and prominently state the following, or any substantially similar statement
  previously allowed under this Agreement, on your Site or any other location where Amazon may
  authorize your display or other use of Program Content: \u201cAs an Amazon Associate I earn from
  qualifying purchases.\u201d
  <cite>Associates Program Operating Agreement, Section 5 \u2014 Identifying Yourself as an Associate. Updated October 15, 2025. ${cites(['S01'])}</cite>
</blockquote>
<p class="small">
  Section 6 of the same Agreement adds the consequence: \u201cany violation of Section 5 and as specified
  in the Program Policies will be deemed a material breach of this Agreement.\u201d ${cites(['S01'])}
</p>

<h2>Where the disclosure appears</h2>
${renderTable({
  head: ['Placement', 'Form', 'Why'],
  rows: [
    ['Directly under the masthead, above the fold, on every page including the 404', 'A highlighted strip carrying the \u00a75 sentence verbatim, plus a link to this page and to the current attribution status', 'Associates guidance requires the disclosure to be clear and conspicuous, placed near the affiliate link or product review, where customers will notice it easily \u2014 they should not have to hunt for it. A footer-only disclosure fails that standard. ' + cites(['S03'])],
    ['In the footer of every page', 'The \u00a75 sentence again, plus an explanation of the sponsored marking and the current attribution state', 'Repetition is required by the project brief and is good practice regardless'],
    ['Beside every outbound product button', 'An attribution-status callout stating that the link is untagged', 'A link-level disclosure, as Associates guidance requires in addition to the site-level statement. ' + cites(['S03'])],
    ['On the product register and every product page', 'The same statement plus the source citations', 'Where the commercial relationship is most likely to be acted on'],
    ['In the RSS feed description', 'The \u00a75 sentence', 'A reader who never visits the site still sees the disclosure in their feed reader'],
  ],
})}
<p class="small">
  Placement is enforced structurally: the disclosure strip is rendered by the page shell itself, so no
  individual page can omit it. <code class="inline">tools/verify.mjs</code> additionally asserts that
  the sentence appears before <code class="inline">&lt;main&gt;</code> in every built HTML file.
</p>

<h2>Two further required disclaimers</h2>
<p class="small">Both are reproduced verbatim in the footer of every page, because Amazon\u2019s IP License requires them where Program Content or pricing is displayed. ${cites(['S02'])}</p>
<div class="card card-tight" style="margin-bottom:.8rem">
  <p class="tiny muted" style="margin:0 0 .3rem">IP License \u00a72(k) \u2014 required where Program Content consisting of text is displayed:</p>
  <p class="small" style="margin:0">${esc(AMAZON_CONTENT_DISCLAIMER)}</p>
</div>
<div class="card card-tight">
  <p class="tiny muted" style="margin:0 0 .3rem">IP License \u00a72(i) \u2014 required adjacent to any pricing or availability display:</p>
  <p class="small" style="margin:0">${esc(AMAZON_PRICE_DISCLAIMER)}</p>
  <p class="tiny muted" style="margin:.5rem 0 0">Every price on this site also carries a date/time stamp in the form Amazon\u2019s own guidance illustrates: \u201cAmazon.com Price: $5.08 (as of 2026-11-20 06:00 UTC \u2014 Details)\u201d.</p>
</div>

<h2>What this site never says</h2>
<ul class="checklist">
  <li>That Amazon sponsors, endorses or supports this site. Operating Agreement \u00a75 forbids misrepresenting or embellishing the relationship.</li>
  <li>That any product was tested, owned or used by anyone here. Nobody tested anything for this site.</li>
  <li>That using these links supports a charity, a cause or a community. Amazon\u2019s guidance prohibits offering any consideration or incentive for using the links.</li>
  <li>Anything about the Operating Agreement beyond the disclosure itself, without advance written permission \u2014 \u00a75 restricts public communication about the Agreement. Quoting it here for operational purposes may itself need permission; that question is left with the owner rather than resolved unilaterally.</li>
</ul>

<h2>Not legal advice</h2>
<p class="small">
  This page records what the source documents say and what this build does about them. It is not legal
  advice. The owner should read the
  ${outbound('https://affiliate-program.amazon.com/help/operating/agreement', 'Operating Agreement', 'source')}
  and the
  ${outbound('https://affiliate-program.amazon.com/help/operating/policies', 'Program Policies', 'source')}
  directly, and take their own advice on the FTC Guides and on applicable data-protection law in every
  jurisdiction their readers are in.
</p>
`,
  };
}

export function associatesPolicyPage(out) {
  return {
    title: 'Associates programme rules applied to this site',
    description:
      'The Operating Agreement and Program Policies requirements that bear on this site, quoted verbatim, with the implementation or the open flag for each.',
    activeKey: 'compliance',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Compliance', 'compliance/index.html'], ['Associates programme rules', null]])}
<p class="kicker">Compliance \u00b7 2</p>
<h1>Associates programme rules applied to this site</h1>
<p class="dek">
  Each row quotes the requirement, names the document and section it comes from, and states what this
  build does about it. Where the answer is "nothing yet", it says so.
</p>

<h2>Link format</h2>
<blockquote class="pull">
  The links must properly use the special \u201ctagged\u201d link formats we provide and comply with this
  Agreement (\u201cSpecial Links\u201d).
  <cite>Operating Agreement \u00a71 \u2014 Description of the Associates Program ${cites(['S01'])}</cite>
</blockquote>
${renderTable({
  head: ['Requirement', 'Source', 'This build', 'State'],
  rows: [
    ['Links use Amazon\u2019s tagged formats', 'Operating Agreement \u00a71', 'No. Product pages link to canonical untagged listings. The candidate tagged format is shown but marked unvalidated', '<span class="chip chip-bad">Open \u2014 F-15</span>'],
    ['Purchases from improperly formatted links are disqualified', 'Commission Income Statement \u00a72(g)', 'Acknowledged: an untagged link cannot attribute. The site does not claim otherwise', '<span class="chip chip-ok">Understood</span>'],
    ['Redirecting Links are disqualified', 'Commission Income Statement \u00a72(e)', 'No redirect is used. Each outbound link requires an affirmative click on this site and goes directly to amazon.com', '<span class="chip chip-ok">Satisfied</span>'],
    ['Links must not be generated or displayed on a search engine', 'Commission Income Statement \u00a72(d)', 'No links are placed on any search engine', '<span class="chip chip-ok">Satisfied</span>'],
    ['No bidding on "amazon", "kindle", Amazon Marks or misspellings', 'Commission Income Statement \u00a72(c)', 'No paid search activity of any kind', '<span class="chip chip-ok">Satisfied</span>'],
  ],
})}

<h2>Attribution windows</h2>
${renderTable({
  head: ['Window', 'As written', 'Consequence'],
  rows: [
    ['Session', 'Begins when a customer clicks through that Special Link and ends upon the first to occur of: 24 hours elapse from that click, the customer places an order for a non-digital Product, or the customer clicks through a Special Link to an Amazon Site that is not your Special Link', 'Last click wins. Another publisher\u2019s link inside your 24 hours ends your session'],
    ['Cart completion', 'Adding a Product to the cart during the Session and completing the order no later than 89 days after the initial click-through', 'A click can earn up to 89 days later, so short-window reporting understates a campaign still in flight'],
    ['Fulfilment', 'Within 180 days of the purchase, the Product is shipped to, streamed or downloaded by, and paid for by the customer', 'An order is not a qualifying purchase until it ships and is paid for'],
    ['Qualifying Revenue', 'The amount actually received, less shipping charges, gift-wrapping fees, handling fees, taxes, service charges, credits, rebates, credit card processing fees and bad debt', 'Never compute commission from a listed price and call it earnings'],
  ],
  note: 'All from the Commission Income Statement \u00a71. ' + cites(['S02']),
})}

<h2>Program Content and the IP License</h2>
${renderTable({
  head: ['Requirement', 'Source', 'This build', 'State'],
  rows: [
    ['Product Advertising Content consisting of an image may not be stored or cached; a LINK to such an image may be stored for up to 24 hours', 'IP License \u00a72(h)', 'No Amazon image is embedded or hotlinked anywhere. A static site cannot refresh within 24 hours, so the only compliant answer is not to use them', '<span class="chip chip-ok">Satisfied \u2014 F-09</span>'],
    ['Other Product Advertising Content may be cached up to 24 hours, then must be refreshed via Creators API, PA-API or a new Data Feed', 'IP License \u00a72(h)', 'Listing titles and attributes are published as dated observations with their capture timestamp, and are never presented as current. No automatic refresh exists', '<span class="chip chip-warn">Mitigated by labelling</span>'],
    ['Individual ASINs may be stored indefinitely', 'IP License \u00a72(h)', 'The three observed ASINs are stored in the register', '<span class="chip chip-ok">Permitted</span>'],
    ['Pricing or availability displays need a date/time stamp plus a specific disclaimer where content comes from Data Feeds or is refreshed less than hourly', 'IP License \u00a72(i)', 'Every price carries "Amazon.com Price: $X (as of 2026-11-20 06:00 UTC \u2014 Details)" and the disclaimer sentence verbatim, both on the page and site-wide in the footer', '<span class="chip chip-ok">Satisfied</span>'],
    ['A specific "comes from Amazon ... subject to change or removal" disclaimer is required in plain view when displaying Program Content consisting of text', 'IP License \u00a72(k)', 'Reproduced verbatim in the footer of every page', '<span class="chip chip-ok">Satisfied</span>'],
    ['No reverse engineering, decompiling, or deriving model parameters from Creators API, PA-API or Data Feeds', 'IP License \u00a72(g)', 'No API is used at all in this build', '<span class="chip chip-ok">Not engaged</span>'],
    ['No exceeding any call-per-second limit; no files larger than 40KB without prior written approval', 'IP License \u00a72(j)', 'No API is used at all in this build', '<span class="chip chip-ok">Not engaged</span>'],
  ],
})}

<h2>Agent Terms \u2014 the awkward one</h2>
<blockquote class="pull">
  No Agent may access, use, or interact with Program Content unless, at all times, it identifies
  itself and operates in strict accordance with the requirements in section 3 of these Agent Terms.
  \u2026 Agents must \u2026 in all HTTP/HTTPS requests, identify that the request is from an Agent and
  disclose the name of the Agent by including the following in the request\u2019s user agent string:
  \u201cAgent/[agent name]\u201d \u2026 Not conceal or obfuscate that any access, use, or interactions are
  from an Agent \u2026 Respond truthfully to any question or prompt seeking to determine if interactions
  are coming from a human or a computer \u2026 Not circumvent or otherwise avoid any measure intended to
  block, limit, modify, or control whether and how Agents access, use, or interact with Program Content.
  <cite>Associates Program Policies, IP License \u00a74 \u2014 Agents ${cites(['S02'])}</cite>
</blockquote>
<div class="callout callout-bad">
  <div class="callout-title">Disclosed, not buried</div>
  <p class="small">
    The research behind this register was performed by an automated agent fetching Amazon pages through
    a retrieval tool. This session cannot see the user-agent string those requests carried, and therefore
    cannot confirm the Agent Terms were satisfied. The agent was also not operating under an enrolled
    Associates account. Rather than present the resulting data as clean, this build publishes the caveat
    wherever the data appears and records it as
    <a href="${link(out, 'flagged/index.html')}#F-08">flag F-08</a> at high severity.
  </p>
  <p class="small" style="margin-bottom:0">
    <strong>Clearing it:</strong> a human re-verifies each of the three listings in a normal signed-out
    browser and re-records the values with a new capture date before any of them is used in promotional
    copy. Any future automated collection should run through PA-API or Creators API under an enrolled
    account, or with a compliant Agent user-agent string.
  </p>
</div>

<h2>Account obligations that sit with the owner</h2>
${renderTable({
  head: ['Obligation', 'Source', 'State'],
  rows: [
    ['Keep the websites and social channels used to drive traffic updated in the Associates account', 'Associates guidance', '<span class="unverified">Unverified \u2014 F-16</span>'],
    ['Sites must have no password restrictions and must be fully functional', 'Associates guidance', '<span class="chip chip-ok">Satisfied \u2014 the site is public and static</span>'],
    ['Provide any information Amazon requests to verify compliance', 'Operating Agreement \u00a72', '<span class="chip chip-neutral">Standing obligation</span>'],
    ['Where an account was rejected for an Operating Agreement violation, revise links with new Tracking IDs when re-applying', 'Associates guidance', '<span class="unverified">Account history unknown \u2014 F-16</span>'],
    ['Treat account information as Confidential Information and do not disclose it', 'Operating Agreement \u00a712', '<span class="chip chip-ok">Satisfied \u2014 no account data is published on this site</span>'],
    ['Do not make public communications about the Agreement without advance written permission, other than the required disclosure', 'Operating Agreement \u00a75', '<span class="chip chip-warn">Needs owner judgement</span>'],
  ],
})}
<p class="small muted">
  On that last row: this compliance page quotes the Operating Agreement for operational purposes.
  Whether that constitutes a "public communication with respect to this Agreement" requiring advance
  written permission is a judgement for the owner, not for this build. It is recorded here rather than
  resolved unilaterally.
</p>
`,
  };
}

export function ftcPage(out) {
  return {
    title: 'FTC endorsement guidance applied to this site',
    description:
      'How 16 CFR Part 255 shapes what this site is allowed to say, and why it makes no experience claim at all.',
    activeKey: 'compliance',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Compliance', 'compliance/index.html'], ['FTC guidance', null]])}
<p class="kicker">Compliance \u00b7 3</p>
<h1>FTC endorsement guidance applied to this site</h1>
<p class="dek">
  The Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, were
  revised in 2023. Three sections shape this site directly, and each one removed something from the copy.
</p>

<h2>\u00a7255.1(a) \u2014 honest experience</h2>
<blockquote class="pull">
  Endorsements must reflect the honest opinions, findings, beliefs, or experience of the endorser.
  Furthermore, an endorsement may not convey any express or implied representation that would be
  deceptive if made directly by the advertiser.
  <cite>16 CFR \u00a7255.1(a) ${cites(['S10'])}</cite>
</blockquote>
<p>
  <strong>What this removed:</strong> every first-person experience claim. There is no "I tested this",
  no "we found", no "in our kitchen", no "after three months of use". No human has used any product in
  this register for this site, so the copy asserts no experience at all. This is enforced mechanically:
  <code class="inline">tools/verify.mjs</code> scans every built page for a fixed list of experience
  phrases and fails the build on a match.
</p>
<p>
  <strong>What it cost:</strong> persuasiveness. Experience copy converts better than criteria copy, and
  this site gives that up deliberately. The guides are written as frameworks a reader can apply, rather
  than as recommendations they can accept.
</p>

<h2>\u00a7255.3 \u2014 expert endorsements</h2>
<p>
  Where an advertisement represents, directly or by implication, that the endorser is an expert on the
  endorsed product, the endorser\u2019s qualifications must actually give them that expertise. ${cites(['S10'])}
</p>
<p>
  <strong>What this removed:</strong> any expert byline. The author of record is
  <strong>${esc(AUTHOR.byline)}</strong>, labelled on every article as
  <em>${esc(AUTHOR.role)}</em>. No credentials are claimed, no <code class="inline">Person</code>
  structured data is emitted, and no biography is invented. Assigning a real named reviewer is the first
  open action on the <a href="${link(out, 'flagged/index.html')}#F-14">Flagged for Review page</a>.
</p>

<h2>\u00a7255.5 \u2014 material connections</h2>
<p>
  A material connection between an endorser and the marketer must be clearly and conspicuously
  disclosed. ${cites(['S10'])} Amazon\u2019s own guidance restates the standard for affiliate links: the
  disclosure must be clear, conspicuous, placed near the link or product review, somewhere customers
  will notice easily \u2014 they should not have to hunt for it. ${cites(['S03'])}
</p>
${renderTable({
  head: ['Placement', 'Implementation', 'Satisfies'],
  rows: [
    ['Above the fold on every page', 'A highlighted strip directly under the masthead carrying the Operating Agreement \u00a75 sentence verbatim', 'Conspicuous \u2014 cannot be missed or hunted for'],
    ['Beside every product link', 'An attribution-status callout adjacent to each outbound button', 'Near the link, as Amazon\u2019s guidance requires'],
    ['In the footer of every page', 'The \u00a75 sentence repeated with an explanation of the sponsored marking', 'Belt and braces'],
    ['In the HTML of every link', 'rel="sponsored nofollow noopener noreferrer"', 'Declares the commercial relationship to machines as well as readers'],
    ['In the RSS feed', 'The \u00a75 sentence in the channel description', 'Reaches readers who never visit the site'],
  ],
})}

<h2>Where the FTC and Amazon requirements differ</h2>
<p class="small">
  They overlap but they are not the same, and satisfying one does not satisfy the other. Amazon\u2019s
  Operating Agreement \u00a75 mandates a <em>specific sentence</em>. The FTC does not mandate wording; it
  mandates that the disclosure be clear and conspicuous in context. Amazon\u2019s guidance adds a
  <em>link-level</em> disclosure on top of the site-level statement, which is the FTC standard restated
  for affiliates. This site implements all three: the exact sentence, above the fold, and repeated next
  to each link.
</p>

<h2>Consumer reviews \u2014 a related rule this site avoids entirely</h2>
<p class="small">
  The FTC also regulates the use of consumer reviews and testimonials, and Amazon\u2019s Operating
  Agreement separately notes that content posted on amazon.com must abide by Amazon\u2019s Community
  Guidelines, including the prohibition on customer reviews created, edited or removed in exchange for
  compensation. ${cites(['S01', 'S11'])} This site quotes no customer review at all, which removes the
  question rather than answering it.
</p>

<h2>Official sources</h2>
<ul class="tight small">
  <li>${cites(['S10'])} ${outbound('https://www.ftc.gov/system/files/ftc_gov/pdf/p204500_endorsement_guides_in_2023.pdf', 'Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255 (2023 revision) \u2014 PDF', 'source')}</li>
  <li>${cites(['S11'])} ${outbound('https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews', 'FTC \u2014 Endorsements, Influencers, and Reviews (business guidance hub)', 'source')}</li>
  <li>${cites(['S03'])} ${outbound('https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98', 'Amazon Associates \u2014 disclosure help topic', 'source')}</li>
</ul>
<p class="small muted">
  This page is not legal advice. It records what the published guidance says and what this build does
  about it. The owner should read the Guides and take their own advice, including on data-protection
  law in every jurisdiction their readers are in.
</p>
`,
  };
}

export function privacyPage(out) {
  return {
    title: 'Privacy',
    description:
      'This site sets no cookies, loads no third-party scripts and collects no personal data. What the first-party counter records, and what it refuses to.',
    activeKey: 'compliance',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Compliance', 'compliance/index.html'], ['Privacy', null]])}
<p class="kicker">Compliance \u00b7 4</p>
<h1>Privacy</h1>
<p class="dek">
  Short version: this site sets no cookies, loads no third-party script, and stores no personal data.
  There is nothing to consent to, so there is no consent banner.
</p>

<h2>What is loaded when you open a page</h2>
${renderTable({
  head: ['Request', 'Destination', 'Data sent'],
  rows: [
    ['The HTML page, the stylesheet, two scripts and one SVG illustration', 'This site only', 'Whatever your browser normally sends a web server. Nothing added by this site'],
    ['Fonts', 'None \u2014 system font stacks only', 'No request is made, so no font provider learns you visited'],
    ['Analytics', 'None, unless a collector endpoint is configured', 'See below'],
    ['Advertising or social scripts', 'None', 'No request is made'],
    ['Images from Amazon', 'None \u2014 deliberately', 'No Amazon image is embedded or hotlinked; see <a href="' + link(out, 'flagged/index.html') + '#F-09">F-09</a> for the licensing reason'],
  ],
})}

<h2>What the first-party counter records</h2>
<p class="small">
  <code class="inline">assets/js/analytics.js</code> counts five events in your own browser. The counts
  are five integers stored under one localStorage key on this origin. They are aggregate counts for
  this browser only, they are not sent anywhere unless a collector endpoint is configured, and they are
  not this site\u2019s totals.
</p>
${renderTable({
  head: ['#', 'Event', 'Recorded detail'],
  rows: EVENTS.map((e, i) => `<tr><td class="num">${i + 1}</td><td class="mono">${esc(e.name)}</td><td>An increment of one integer. Nothing else</td></tr>`),
})}
${renderTable({
  head: ['Never recorded', 'Why not'],
  rows: [
    ['IP address', 'Identifies a household and is personal data. Counting a click does not need it'],
    ['User agent', 'Enables fingerprinting when combined with anything else'],
    ['Cookie or persistent identifier', 'Would make this a tracking technology requiring consent notice under GDPR, the UK GDPR and the Swiss FADP'],
    ['Referrer', 'Would reveal where a reader came from \u2014 third-party data with no basis to hold'],
    ['Full destination URL of an outbound click', 'Only the host and a link id are counted, so query strings carrying personal data are never captured'],
    ['Scroll depth, dwell time, reading position', 'Behavioural profiling, and not needed to answer "did anyone click"'],
    ['Anything cross-site', 'No cross-origin reads, no shared storage, no third-party request'],
  ],
})}

<h2>If a collector endpoint is configured</h2>
<p class="small">
  The reference collector at <code class="inline">analytics/server/index.mjs</code> accepts an event
  name and an optional page path, increments an aggregate counter in a JSON file, discards the request
  body, and logs no IP address and no user agent. It sets no cookie and returns no identifier. It is
  <strong>not deployed</strong> on this site \u2014 GitHub Pages cannot execute server code \u2014 so
  nothing is currently sent anywhere. See <a href="${link(out, 'flagged/index.html')}#F-11">F-11</a>.
</p>

<h2>Reader capture</h2>
<p class="small">
  The subscription form is present on guide pages and the front page but is <strong>inert</strong>: with
  no endpoint configured it displays a notice saying so rather than accepting an address and discarding
  it. No email address submitted on this site is currently received or stored.
</p>
<p class="small">
  Before it is enabled, three things are needed, and they are prerequisites rather than follow-ups: a
  lawful basis for processing, a privacy notice describing it, and a working unsubscribe. The owner is
  in Z\u00fcrich, so readers in Switzerland engage the Swiss FADP, readers in the EU engage GDPR, and
  readers in the UK engage the UK GDPR; marketing email to US readers engages CAN-SPAM. Amazon\u2019s
  Operating Agreement also requires participation to comply with all applicable laws governing
  marketing email. See <a href="${link(out, 'flagged/index.html')}#F-13">F-13</a> and ${cites(['S01'])}.
</p>

<h2>Your controls</h2>
<ul class="tight small">
  <li>Clear this site\u2019s storage in your browser settings to reset the five counters to zero.</li>
  <li>Block localStorage for this origin and the counters will not persist; the site continues to work normally.</li>
  <li>Disable JavaScript and the site remains fully readable. Every page is complete HTML with no client-side rendering, so nothing is hidden behind a script.</li>
</ul>

<h2>No contact address is published</h2>
<p class="small">
  None was supplied and inventing one would create an inbox nobody reads, which is worse than none.
  Corrections are handled in the open through the
  ${outbound(SITE.repo, 'public repository', 'source')}.
</p>
`,
  };
}

/* ------------------------------------------------------------------ */

export function executiveSummaryPage(out) {
  return {
    title: 'Executive summary',
    description:
      'What was built, what was verified, what could not be verified, and the seven decisions that need a human. One page.',
    activeKey: null,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Report',
      headline: 'DIYHOME3 \u2014 Executive summary',
      datePublished: '2026-11-20',
      author: { '@type': 'Organization', name: AUTHOR.byline },
    },
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Executive summary', null]])}
<p class="kicker">Executive summary</p>
<h1>What was built, what was verified, and what needs a human</h1>
<p class="dek">
  A complete, live, compliant Amazon Associates property built around three verified products \u2014 with
  its monetisation deliberately switched off until a human validates the links.
</p>

<h2>The headline</h2>
<div class="callout callout-gate">
  <div class="callout-title">The site is finished and the earning is not</div>
  <p class="small">
    Four links were supplied. Three were unique \u2014 two were byte-identical. All three resolved to real
    Amazon listings, and every listing attribute was read off the page and recorded with its source. But
    <strong>not one of the resolved URLs carried a tracking tag</strong>, and
    <span class="mono">shopnow047c-20</span> does not appear anywhere in the observed redirect chain.
    As published, every click this site sends to Amazon earns nothing.
  </p>
  <p class="small" style="margin-bottom:0">
    That is a one-line fix per product once a human has generated and validated a tagged Special Link in
    Associates Central. It cannot be automated, because it needs an authenticated session and a tracking
    report to confirm against. Rather than fake it, the site ships untagged with the gate visible on
    every product page.
  </p>
</div>

<h2>What was delivered</h2>
${renderTable({
  head: ['Requirement', 'Delivered', 'Where'],
  rows: [
    ['Publication front page leading with products, not with the verification process', 'Yes \u2014 editorial hero, product rail, guide rail, seasons, then flags', '<a href="' + link(out, 'index.html') + '">Front page</a>'],
    ['Every dashboard surface reachable from the footer and a single navigation group', 'Yes \u2014 16 surfaces behind one "Dashboard" nav entry, all listed in the footer group', '<a href="' + link(out, 'dashboard/index.html') + '">Dashboard</a>'],
    ['Subpages organised by category, dashboard-style, with tables', 'Yes \u2014 products, guides, clusters, compare, compliance, flagged, methodology, about', 'Primary navigation'],
    ['Question-shaped guides published', `Yes \u2014 ${guides.length} guides in 3 clusters, 2 of them pillars`, '<a href="' + link(out, 'guides/index.html') + '">Guides</a>'],
    ['Publishing cadence set', 'Yes \u2014 one guide per week on Thursdays, sitemap and feed updated in the same commit by construction', '<a href="' + link(out, 'dashboard/content-pipeline.html') + '">Content pipeline</a>'],
    ['Each new guide added to sitemap and feed', 'Yes \u2014 both are generated from the same registry as the pages; CI fails if a guide is missing from either', '<a href="' + link(out, 'sitemap.xml') + '">sitemap.xml</a> \u00b7 <a href="' + link(out, 'feed.xml') + '">feed.xml</a>'],
    ['Shipped RSS feed (SG-28)', 'Yes \u2014 RSS 2.0 with an atom:link self reference and autodiscovery on every page', '<a href="' + link(out, 'feed.xml') + '">feed.xml</a>'],
    ['Navigation labels (SG-27)', 'Yes \u2014 eight labels with published rationale', '<a href="' + link(out, 'about/index.html') + '">About</a>'],
    ['Reader capture (SG-30)', 'Built and instrumented, but inert until an endpoint exists', '<a href="' + link(out, 'flagged/index.html') + '#F-13">F-13</a>'],
    ['Search Console (SG-29)', 'Site side complete; property verification needs an account this build does not have', '<a href="' + link(out, 'flagged/index.html') + '#F-12">F-12</a>'],
    ['Privacy-preserving outbound-click counter', 'Yes \u2014 no cookies, no identifiers, no IP, no user agent, no third-party request', '<a href="' + link(out, 'dashboard/click-tracking.html') + '">Click tracking</a>'],
    ['Self-hosted analytics endpoint', 'Built and tested; not deployable on GitHub Pages', '<a href="' + link(out, 'flagged/index.html') + '#F-11">F-11</a>'],
    ['The five defined events', 'Implemented \u2014 but the brief did not enumerate them, so the set is a documented assumption', '<a href="' + link(out, 'flagged/index.html') + '#F-21">F-21</a>'],
    ['Disclosure above the fold on every page, repeated in the footer', 'Yes \u2014 rendered by the page shell, so no page can omit it; CI-asserted', 'Every page'],
    ['Every outbound product link marked sponsored', 'Yes \u2014 single emitter; CI fails on any amazon.com href lacking rel="sponsored"', 'Every page'],
    ['Product-intent confirmation record with observed redirects kept separate', 'Yes \u2014 intent and observation are separate objects, separate tables, no merge path', '<a href="' + link(out, 'dashboard/link-intent.html') + '">Link intent</a>'],
    ['Empty but well-defined campaign ledger with dated provenance', 'Yes \u2014 fixed schema, validation rules, provenance trail, zero invented rows', '<a href="' + link(out, 'dashboard/campaign-ledger.html') + '">Campaign ledger</a>'],
    ['No conversion score, no revenue forecast', 'Correct \u2014 neither appears anywhere; supported independently by Operating Agreement \u00a74', '<a href="' + link(out, 'flagged/index.html') + '#F-20">F-20</a>'],
    ['Disclosures and API policy checks in the publishing workflow', 'Yes \u2014 13 automated checks in CI plus 9 documented human checks', '<a href="' + link(out, 'dashboard/compliance-gate.html') + '">Compliance gate</a>'],
    ['Authorship, navigation, brand, imagery, seasons, clusters', 'Yes \u2014 with authorship left as a desk label and imagery original, both for stated compliance reasons', '<a href="' + link(out, 'about/index.html') + '">About</a> \u00b7 <a href="' + link(out, 'clusters/index.html') + '">Clusters</a>'],
    ['Flagged for Review page with source links', 'Yes \u2014 ' + flags.length + ' flags with evidence, impact, required action and sources', '<a href="' + link(out, 'flagged/index.html') + '">Flagged</a>'],
    ['COORDINATION.md task board', 'Yes \u2014 created, claimed, and completed within this session', '<a href="' + SITE.repo + '/blob/main/COORDINATION.md" rel="noopener noreferrer">COORDINATION.md</a>'],
  ],
})}

<h2>What was verified</h2>
${renderTable({
  head: ['Product', 'Observed ASIN', 'Listing', 'Brand store', 'Sold by', 'Stars', 'Ratings', 'Price', 'Anchor'],
  numCols: [5, 6, 7],
  rows: products.map(
    (x) => `<tr>
  <td>${x.submissions.join(', ')}</td>
  <td class="mono">${outbound(x.observed.canonicalListingUrl, esc(x.observed.asin), 'source')}</td>
  <td class="tiny">${esc(x.observed.listingH1)}</td>
  <td>${esc(x.observed.brandStore)}</td>
  <td>${esc(x.observed.soldBy)}</td>
  <td class="num">${x.observed.starRating.toFixed(1)}</td>
  <td class="num">${int(x.observed.ratingsCount)}</td>
  <td class="num">${money(x.observed.priceObserved)}</td>
  <td class="tiny">${esc(x.observed.priceAnchorLabel)} ${money(x.observed.priceAnchor)}${x.observed.primeExclusive ? ' (Prime only)' : ''}</td>
</tr>`
  ),
  note: 'All observed ' + STAMP + ' from amazon.com, signed out, no Associates credentials, delivery location rendered as Herndon 20170. Prices are Black Friday deal prices. ' + cites(['S06', 'S07', 'S08', 'S09']),
})}

<h2>The niche the data actually supports</h2>
<p class="lede">
  <strong>Reversible, low-cost home upgrades for people who cannot or will not make permanent changes.</strong>
</p>
<p class="small">
  Read off the evidence rather than chosen in advance. All three listing titles or subheads carry a
  no-permanent-change signal \u2014 peel-and-stick, self-adhesive, tool-free, no-drill, under-cabinet. The
  set straddles two Amazon top-level departments, which a single-room framing would get wrong, but two
  of three sit in one narrow leaf: Storage &amp; Organization \u203a Racks &amp; Holders. The price band
  is $5.08 to $17.74. The unifying buyer constraint is reversibility, not room and not price.
  ${cites(['S06', 'S07', 'S08'])}
</p>

<h2>What could not be verified</h2>
${renderTable({
  head: ['Item', 'Why not', 'Flag'],
  rows: [
    ['Commission rate for any product', 'Amazon\u2019s standard off-site rate table was not reached; four third-party pages gave five conflicting numbers', 'F-05'],
    ['That the supplied tokens are ASINs', 'They are not \u2014 all three are nine characters with lower-case letters, against Amazon\u2019s ten-character definition', 'F-02'],
    ['That the redirect destinations are stable', 'All three resolved through a search-fallback path with per-request tokens and different search positions', 'F-03'],
    ['That link.amazon is a compliant tagged format', 'It is not referenced in either programme document retrieved. Not called invalid \u2014 unresolved', 'F-04'],
    ['That shopnow047c-20 is active on an approved account', 'Requires an authenticated Associates Central session', 'F-16'],
    ['Which product the owner actually intended', 'Nothing in the supplied material asserted an ASIN, name or category', 'F-02'],
    ['Search volume or keyword difficulty for any title', 'No authorised keyword source was available', 'F-12'],
    ['Any click, session, order or revenue figure', 'No collector deployed, no authorised report available', 'F-11, F-20'],
    ['That the agent-based research satisfied Amazon\u2019s Agent Terms', 'The user-agent string those requests carried is not visible to this session', 'F-08'],
    ['Stock status and variations for two of three listings', 'Not read on the captured portion of the page; not inferred', 'F-19'],
  ],
})}

<h2>The seven decisions that need a human</h2>
<ol class="tight">
  <li><strong>Confirm the three observed ASINs are the products you meant.</strong> Nothing supplied asserted an identity, and all three resolved through a search fallback seeded with "diy home upgrades". If any is wrong, that is the single most important finding in this build. <span class="tiny muted">F-02, F-03</span></li>
  <li><strong>Validate one tagged Special Link per product in Associates Central</strong> and confirm it in the tracking report. Then flip one field per product and rebuild. <span class="tiny muted">F-01, F-15</span></li>
  <li><strong>Confirm shopnow047c-20 is active</strong> and that the live GitHub Pages URL is registered on the account. <span class="tiny muted">F-16</span></li>
  <li><strong>Read the commission rate off the official Appendix</strong> under your own session and enter it. The calculator has no default and will not guess one. <span class="tiny muted">F-05</span></li>
  <li><strong>Assign a named human editor</strong>, have them read all eleven guides, and only then put their name in the byline. <span class="tiny muted">F-14</span></li>
  <li><strong>Deploy the analytics collector</strong> to any Node host and set the endpoint. Until then every count is local to one browser and there is no aggregate measurement. <span class="tiny muted">F-11</span></li>
  <li><strong>Decide what to do with the air-fryer cluster.</strong> The brief supplied those titles; none of the three products is a cooking appliance. They are published quarantined and labelled. <span class="tiny muted">F-06</span></li>
</ol>

<h2>Numbers at a glance</h2>
<div class="metrics">
  <div class="metric"><div class="metric-label">Links supplied</div><div class="metric-value">${submissions.length}</div><div class="metric-sub">3 unique</div></div>
  <div class="metric"><div class="metric-label">Listings resolved</div><div class="metric-value">3 / 3</div><div class="metric-sub">All fetched successfully</div></div>
  <div class="metric"><div class="metric-label">Valid ASIN tokens</div><div class="metric-value">0 / 3</div><div class="metric-sub">All nine characters</div></div>
  <div class="metric"><div class="metric-label">Links with a tag</div><div class="metric-value">0 / 3</div><div class="metric-sub">The blocking fact</div></div>
  <div class="metric"><div class="metric-label">Guides published</div><div class="metric-value">${guides.length}</div><div class="metric-sub">4 hypothesis-only</div></div>
  <div class="metric"><div class="metric-label">Clusters</div><div class="metric-value">${Object.keys(clusters).length}</div><div class="metric-sub">2 live, 1 hypothesis</div></div>
  <div class="metric"><div class="metric-label">Official sources cited</div><div class="metric-value">${sources.filter((s) => s.official).length}</div><div class="metric-sub">+ ${sources.filter((s) => !s.official).length} third-party, recorded as conflict evidence only</div></div>
  <div class="metric"><div class="metric-label">Flags raised</div><div class="metric-value">${flagCounts.total}</div><div class="metric-sub">${flagCounts.critical || 0} critical \u00b7 ${flagCounts.high || 0} high</div></div>
  <div class="metric"><div class="metric-label">Dashboard surfaces</div><div class="metric-value">16</div><div class="metric-sub">One nav group, all in the footer</div></div>
  <div class="metric"><div class="metric-label">Automated compliance checks</div><div class="metric-value">13</div><div class="metric-sub">Fail the build on violation</div></div>
  <div class="metric"><div class="metric-label">Cookies set</div><div class="metric-value">0</div><div class="metric-sub">No third-party scripts either</div></div>
  <div class="metric"><div class="metric-label">Revenue forecast</div><div class="metric-value">None</div><div class="metric-sub">Prohibited, and unsupported by S01 \u00a74</div></div>
</div>

<h2>One structural idea worth keeping</h2>
<p class="small">
  Every page, the sitemap, the feed, the register and the dashboard are generated from three data files.
  Correcting a fact is one edit and it propagates everywhere at once, including into the compliance
  assertions. Adding a product is one object; adding a guide is one object. That is what makes the
  compliance gate travel with the content instead of sitting beside it \u2014 and it is the part of this
  build that will still be useful when the register holds fifty products instead of three.
</p>

<p class="small muted" style="margin-top:2rem;border-top:1px solid var(--rule);padding-top:1rem">
  Prepared ${STAMP.slice(0, 10)} by ${esc(AUTHOR.byline)} from ${sources.length} recorded sources.
  Full detail: <a href="${link(out, 'methodology/index.html')}">verification method</a> \u00b7
  <a href="${link(out, 'methodology/sources.html')}">source register</a> \u00b7
  <a href="${link(out, 'flagged/index.html')}">all ${flags.length} flags</a>.
  Also available as <a href="${SITE.repo}/blob/main/EXECUTIVE-SUMMARY.md" rel="noopener noreferrer">EXECUTIVE-SUMMARY.md</a> in the repository.
</p>
`,
  };
}

/* ------------------------------------------------------------------ */

export function notFoundPage(out) {
  return {
    title: 'Page not found',
    description:
      'Nothing was found at that address on DIYHOME3. Use the links below to reach the product register, the guides, or the Flagged for Review page.',
    activeKey: null,
    body: `
<p class="kicker">404</p>
<h1>That page is not here</h1>
<p class="dek">Nothing was found at that address. It may have been renamed, or it may never have existed.</p>
<p class="small">
  <strong>${esc(AMAZON_DISCLOSURE)}</strong> \u2014 this notice appears on every page of this site,
  including this one, because it is part of the page shell rather than something a page has to remember
  to include.
</p>
<div class="grid grid-3" style="margin-top:1.5rem">
  <a class="tile" href="${link(out, 'index.html')}"><span class="tile-title">Front page</span><span class="tile-meta">Start here</span></a>
  <a class="tile" href="${link(out, 'products/index.html')}"><span class="tile-title">Product register</span><span class="tile-meta">The three verified listings</span></a>
  <a class="tile" href="${link(out, 'guides/index.html')}"><span class="tile-title">Guides</span><span class="tile-meta">${guides.length} question-shaped articles</span></a>
  <a class="tile" href="${link(out, 'flagged/index.html')}"><span class="tile-title">Flagged for Review</span><span class="tile-meta">${flags.length} items with evidence</span></a>
  <a class="tile" href="${link(out, 'methodology/sources.html')}"><span class="tile-title">Source register</span><span class="tile-meta">${sources.length} sources, official and third-party</span></a>
  <a class="tile" href="${link(out, 'sitemap.xml')}"><span class="tile-title">Sitemap</span><span class="tile-meta">Every published URL</span></a>
</div>
`,
  };
}
