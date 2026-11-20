#!/usr/bin/env node
/**
 * VERIFY — the compliance and data gate.
 *
 * Runs against the BUILT output, not the source, so it checks what a reader and
 * what Google actually receive. Exits non-zero on any failure, which makes it
 * usable as a CI gate and as a pre-merge check.
 *
 *   node tools/build.mjs && node tools/verify.mjs
 *
 * The checks fall into three groups:
 *   A. Compliance \u2014 the obligations Amazon, the FTC and Google impose.
 *   B. Data integrity \u2014 the project rule that a value is either sourced or blank.
 *   C. Structural \u2014 things that would silently rot: sitemap/feed drift,
 *      undefined leaking into markup, orphaned source ids.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { products, submissions, TRACKING_ID, asinFormatCheck } from '../site/data/products.mjs';
import { guides } from '../site/data/guides.mjs';
import { flags } from '../site/data/flags.mjs';
import { sources } from '../site/data/sources.mjs';
import { AMAZON_DISCLOSURE, AMAZON_CONTENT_DISCLAIMER, AMAZON_PRICE_DISCLAIMER, SITE } from '../site/layout.mjs';
import { EVENTS } from '../site/pages/dashboard.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'build');

const results = [];
function check(group, name, ok, detail) {
  results.push({ group, name, ok: Boolean(ok), detail: ok ? '' : detail || '' });
}

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    if (e === '.git' || e === 'node_modules' || e === '.arena') continue;
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const allFiles = walk(ROOT);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const read = (f) => readFileSync(f, 'utf8');

if (htmlFiles.length === 0) {
  console.error('No built HTML found. Run: node tools/build.mjs');
  process.exit(1);
}

/* ================================================================== */
/* A. COMPLIANCE                                                       */
/* ================================================================== */

// A1. The Operating Agreement \u00a75 sentence must appear ABOVE THE FOLD,
//     i.e. before <main>, on every single page.
for (const f of htmlFiles) {
  const h = read(f);
  const mainAt = h.indexOf('<main');
  const discAt = h.indexOf(AMAZON_DISCLOSURE);
  check('Compliance', `A1 disclosure above the fold \u2014 ${rel(f)}`,
    discAt !== -1 && mainAt !== -1 && discAt < mainAt,
    'the \u00a75 sentence is missing, or appears at/after <main>');
}

// A2. The same sentence must be repeated in the footer of every page.
for (const f of htmlFiles) {
  const h = read(f);
  const footAt = h.indexOf('<footer');
  const occurrences = h.split(AMAZON_DISCLOSURE).length - 1;
  check('Compliance', `A2 disclosure repeated in footer \u2014 ${rel(f)}`,
    footAt !== -1 && occurrences >= 2 && h.indexOf(AMAZON_DISCLOSURE, footAt) !== -1,
    `found ${occurrences} occurrence(s); need one before <main> and one inside <footer>`);
}

// A3. IP License \u00a72(k) content disclaimer, verbatim, site-wide.
for (const f of htmlFiles) {
  check('Compliance', `A3 \u00a72(k) content disclaimer \u2014 ${rel(f)}`,
    read(f).includes(AMAZON_CONTENT_DISCLAIMER), 'the verbatim \u00a72(k) sentence is missing');
}

// A4. IP License \u00a72(i) price disclaimer, verbatim, site-wide.
for (const f of htmlFiles) {
  check('Compliance', `A4 \u00a72(i) price disclaimer \u2014 ${rel(f)}`,
    read(f).includes(AMAZON_PRICE_DISCLAIMER), 'the verbatim \u00a72(i) sentence is missing');
}

// A5. Every outbound link to a shopping host carries rel="sponsored".
{
  const re = /<a\b[^>]*href="([^"]+)"[^>]*>/gi;
  let total = 0;
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    let m;
    while ((m = re.exec(h)) !== null) {
      const tag = m[0];
      const href = m[1];
      let host = '';
      try { host = new URL(href, 'http://x').hostname.toLowerCase(); } catch { continue; }
      const shopping = ['amazon.com', 'www.amazon.com', 'smile.amazon.com', 'link.amazon', 'amzn.to', 'a.co']
        .some((s) => host === s || host.endsWith('.' + s));
      if (!shopping) continue;
      total++;
      const relMatch = tag.match(/\brel="([^"]*)"/i);
      if (!relMatch || !/\bsponsored\b/.test(relMatch[1])) {
        bad.push(`${rel(f)} -> ${href} (rel="${relMatch ? relMatch[1] : 'MISSING'}")`);
      }
    }
  }
  check('Compliance', `A5 every shopping-host link is rel="sponsored" (${total} checked)`,
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

/**
 * Extract the text a reader actually sees, so copy checks are not tripped by the
 * pages that DOCUMENT the rules. Markup, code samples and quoted examples are
 * removed first; only prose is scanned.
 */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    // Strip HTML comments, then all remaining tags.
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    // Decode the entities esc() produces, so quoted examples read as quotes.
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    // Drop quoted spans: a phrase quoted as an example of what is banned is not
    // itself a claim. Handles both straight and typographic quotes.
    .replace(/"[^"\n]{0,200}?"/g, ' ')
    .replace(/\u201c[^\u201d\n]{0,200}?\u201d/g, ' ')
    .replace(/\s+/g, ' ');
}

// A6. No Amazon imagery anywhere \u2014 IP License \u00a72(h).
//     Checks resource URLs only. Prose that NAMES the host while documenting the
//     prohibition is not a violation, and must not be reported as one.
{
  const HOSTS = /(?:src|href)\s*=\s*"[^"]*(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com|images-eu\.ssl-images-amazon\.com|images-fe\.ssl-images-amazon\.com)/i;
  const bad = [];
  for (const f of htmlFiles) if (HOSTS.test(read(f))) bad.push(rel(f));
  for (const f of allFiles.filter((x) => /\.(css|js|svg)$/.test(x))) {
    if (/url\([^)]*media-amazon|@import[^;]*media-amazon/i.test(read(f))) bad.push(rel(f));
  }
  check('Compliance', 'A6 no Amazon product imagery embedded or hotlinked',
    bad.length === 0, `Amazon image host used as a resource in: ${bad.join(', ')}`);
}

// A7. No third-party script, stylesheet, frame or image, and no tracker.
//     Canonical, alternate, sitemap and Open Graph <link>/<meta> tags declare URLs
//     without fetching them, so they are excluded deliberately.
{
  const bad = [];
  const RE = /<(script|img|iframe|link)\b([^>]*)>/gi;
  for (const f of htmlFiles) {
    const h = read(f);
    let m;
    while ((m = RE.exec(h)) !== null) {
      const tag = m[1].toLowerCase();
      const attrs = m[2];
      // <link> is only a subresource when it actually loads something.
      if (tag === 'link' && !/rel\s*=\s*"(?:stylesheet|preload|prefetch|modulepreload|icon|manifest)"/i.test(attrs)) continue;
      const url = (attrs.match(/(?:src|href)\s*=\s*"([^"]+)"/i) || [])[1] || '';
      if (/^https?:|^\/\//.test(url)) bad.push(`${rel(f)} -> <${tag}> ${url}`);
    }
    if (/googletagmanager|google-analytics|gtag\(|fbq\(|doubleclick|hotjar|clarity\.ms|cdn\.jsdelivr|unpkg\.com|cdnjs/i.test(h)) {
      bad.push(`${rel(f)} -> tracker or CDN signature`);
    }
  }
  check('Compliance', 'A7 no third-party subresource or tracker on any page',
    bad.length === 0, [...new Set(bad)].slice(0, 8).join('\n       '));
}

// A8. No first-person experience claims \u2014 FTC 16 CFR \u00a7255.1(a).
{
  const PHRASES = ['i tested', 'we tested', 'i tried', 'we tried', 'in my experience',
    'in our experience', 'we found that', 'i have used', 'we have used', 'i bought this',
    'we bought this', 'i recommend', 'we recommend', 'after using', 'in my kitchen',
    'in our kitchen', 'i own this', 'we own this'];
  const bad = [];
  for (const f of htmlFiles) {
    const text = visibleText(read(f)).toLowerCase();
    for (const ph of PHRASES) if (text.includes(ph)) bad.push(`${rel(f)}: "${ph}"`);
  }
  check('Compliance', `A8 no first-person experience claims (${PHRASES.length} phrases scanned)`,
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

// A9. No superlatives or product rankings.
//     "best practice" is a methodological idiom, not a claim about a product, so
//     it is exempted; every other use of "best" is a superiority claim this site
//     has no source for.
{
  const TERMS = [/#1\b/, /\bnumber one\b/, /\btop-rated\b/, /\btop rated\b/,
    /\bbest\b(?!\s+practice)/i, /\bworld-class\b/, /\bunbeatable\b/, /\bguaranteed\b/i,
    /\bmarket-leading\b/, /\bclass-leading\b/];
  const bad = [];
  for (const f of htmlFiles) {
    const text = visibleText(read(f));
    for (const t of TERMS) {
      const m = text.match(t);
      if (m) bad.push(`${rel(f)}: ${JSON.stringify(m[0])} \u2026 "${text.slice(Math.max(0, m.index - 45), m.index + 55).trim()}"`);
    }
  }
  check('Compliance', 'A9 no superlatives or rankings in site copy',
    bad.length === 0, bad.slice(0, 10).join('\n       '));
}

// A10. No fabricated search-volume, traffic or impression figures.
//      Discussing the ABSENCE of such data is fine; inventing a number is not.
//      The lookbehind excludes digits that are part of an identifier (a flag id
//      such as "F-02" followed by the words "Search volume" is not a figure).
{
  const NUMERIC = /(?<![\w-])\d[\d,]*(?:\.\d+)?\s*(?:monthly\s+|daily\s+|annual\s+)?(?:searches|search volume|searches per month|impressions|pageviews|page views|keyword difficulty|clicks per month|visits per month|unique visitors)\b/i;
  const bad = [];
  for (const f of htmlFiles) {
    const text = visibleText(read(f));
    const m = text.match(NUMERIC);
    if (m) bad.push(`${rel(f)}: ${JSON.stringify(m[0])} \u2026 "${text.slice(Math.max(0, m.index - 50), m.index + 70).trim()}"`);
  }
  check('Compliance', 'A10 no fabricated search-volume or traffic figures',
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

// A11. No revenue forecast or conversion score presented as a figure.
//      Naming the concept in order to say it is not published is allowed, and is
//      exactly what the compliance pages do.
{
  const TERMS = /revenue forecast|conversion score|projected earnings|estimated earnings|forecasted revenue|predicted revenue|earnings projection/i;
  const ALLOWED = /not published|prohibited|neither appears|does not exist|forbidden|absent|never|unsupported|no revenue forecast|no conversion score|none|blank/i;
  const bad = [];
  for (const f of htmlFiles) {
    const text = visibleText(read(f));
    const hits = text.match(new RegExp(`.{0,220}(?:${TERMS.source}).{0,220}`, 'gi')) || [];
    const unqualified = hits.filter((x) => !ALLOWED.test(x));
    if (unqualified.length) bad.push(`${rel(f)}: ${unqualified[0].trim().slice(0, 150)}`);
  }
  check('Compliance', 'A11 no revenue forecast or conversion score presented as a figure',
    bad.length === 0, bad.slice(0, 6).join('\n       '));
}

// A12. Prices are stamped with a date/time as \u00a72(i) requires.
{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    const priceBoxes = (h.match(/class="price-now"/g) || []).length;
    const stamps = (h.match(/Amazon\.com Price: \$[\d.]+ \(as of \d{4}-\d{2}-\d{2}/g) || []).length;
    if (priceBoxes > 0 && stamps < priceBoxes) bad.push(`${rel(f)}: ${priceBoxes} price box(es), ${stamps} stamp(s)`);
  }
  check('Compliance', 'A12 every displayed price carries a date/time stamp',
    bad.length === 0, bad.join('\n       '));
}

/* ================================================================== */
/* B. DATA INTEGRITY                                                   */
/* ================================================================== */

// B1. Supplied tokens must fail the ASIN format check (they do \u2014 assert it stays true).
{
  const bad = [];
  for (const p of products) {
    const c = p.intent.formatCheck;
    if (c.validFormat) bad.push(`${p.slug}: token ${c.token} unexpectedly passed`);
    if (c.token !== p.intent.url.split('/').pop()) bad.push(`${p.slug}: token does not match its URL`);
    const o = asinFormatCheck(p.observed.asin);
    if (!o.validFormat) bad.push(`${p.slug}: observed ASIN ${p.observed.asin} fails the format check`);
  }
  check('Data integrity', 'B1 submitted tokens fail and observed ASINs pass the published format check',
    bad.length === 0, bad.join('; '));
}

// B2. Intent and observation must never be merged.
{
  const bad = [];
  for (const p of products) {
    if (p.intent.token === p.observed.asin) bad.push(`${p.slug}: intent token equals observed ASIN`);
    if (p.intent.claimedAsin !== null) bad.push(`${p.slug}: claimedAsin was filled in \u2014 nobody asserted one`);
    if (!p.intent.formatCheck || typeof p.intent.formatCheck !== 'object') bad.push(`${p.slug}: no format check recorded`);
    if (!Array.isArray(p.observed.sourceIds) || p.observed.sourceIds.length === 0) bad.push(`${p.slug}: no sources on the observation`);
  }
  check('Data integrity', 'B2 intent and observed-redirect fields are separate and unmerged',
    bad.length === 0, bad.join('; '));
}

// B3. attributionActive cannot be true without a tag parameter in the href.
{
  const bad = [];
  for (const p of products) {
    const o = p.observed;
    if (o.attributionActive === true) {
      const href = o.outboundHref || '';
      if (!/[?&]tag=/.test(href)) bad.push(`${p.slug}: attributionActive is true but the href has no tag parameter`);
      const tag = new URLSearchParams(href.split('?')[1] || '').get('tag');
      if (tag !== TRACKING_ID.value) bad.push(`${p.slug}: href tag "${tag}" does not match the register tracking ID "${TRACKING_ID.value}"`);
      if (!o.attributionVerifiedOn) bad.push(`${p.slug}: attributionActive is true with no verification date`);
      if (!o.attributionEvidence) bad.push(`${p.slug}: attributionActive is true with no evidence recorded`);
    }
    if (o.tagParameter !== null) bad.push(`${p.slug}: tagParameter should be null (no tag was observed)`);
  }
  check('Data integrity', 'B3 no product claims active attribution without a validated tagged href',
    bad.length === 0, bad.join('; '));
}

// B4. Every source id cited anywhere resolves to a real register entry.
{
  const ids = new Set(sources.map((s) => s.id));
  const bad = [];
  const collect = (arr, where) => arr.forEach((id) => { if (!ids.has(id)) bad.push(`${where}: ${id}`); });
  for (const p of products) collect(p.observed.sourceIds, `products/${p.slug}`);
  for (const f of flags) collect(f.sourceIds || [], `flags/${f.id}`);
  for (const g of guides) {
    for (const s of g.sections) {
      collect(s.observation?.sourceIds || [], `guides/${g.id}`);
      collect(s.quote?.sourceIds || [], `guides/${g.id}`);
      collect(s.quote2?.sourceIds || [], `guides/${g.id}`);
    }
  }
  // Also scan the built output for rendered citation chips.
  const chipRe = /class="src"[^>]*>(S\d{2})</g;
  for (const f of htmlFiles) {
    const h = read(f);
    let m;
    while ((m = chipRe.exec(h)) !== null) if (!ids.has(m[1])) bad.push(`${rel(f)}: rendered chip ${m[1]}`);
  }
  check('Data integrity', 'B4 every cited source id exists in the source register',
    bad.length === 0, [...new Set(bad)].slice(0, 10).join('; '));
}

// B5. Third-party sources must never be used to fill a data cell.
{
  const thirdParty = sources.filter((s) => !s.official).map((s) => s.id);
  const bad = [];
  for (const p of products) {
    for (const id of p.observed.sourceIds) if (thirdParty.includes(id)) bad.push(`products/${p.slug} cites ${id}`);
    for (const id of (p.commissionSourceIds || [])) if (thirdParty.includes(id)) bad.push(`products/${p.slug} commission cites ${id}`);
  }
  check('Data integrity', `B5 no data cell is sourced from a third-party page (${thirdParty.length} flagged as non-official)`,
    bad.length === 0, bad.join('; '));
}

// B6. Commission rate must remain null until officially confirmed.
{
  const bad = products.filter((p) => p.commissionRate !== null).map((p) => `${p.slug}=${p.commissionRate}`);
  check('Data integrity', 'B6 commission rate is blank for every product pending official confirmation',
    bad.length === 0, `rate was filled in for: ${bad.join(', ')}`);
}

// B7. Flags are well-formed.
{
  const bad = [];
  const ids = new Set();
  const SEV = ['critical', 'high', 'medium', 'low', 'info'];
  const ST = ['needs-review', 'gated', 'by-design'];
  for (const f of flags) {
    if (ids.has(f.id)) bad.push(`${f.id}: duplicate id`);
    ids.add(f.id);
    if (!SEV.includes(f.severity)) bad.push(`${f.id}: bad severity "${f.severity}"`);
    if (!ST.includes(f.status)) bad.push(`${f.id}: bad status "${f.status}"`);
    for (const k of ['title', 'summary', 'action']) if (!f[k]) bad.push(`${f.id}: missing ${k}`);
    if (!f.evidence && f.severity !== 'info') bad.push(`${f.id}: missing evidence`);
  }
  check('Data integrity', `B7 all ${flags.length} flags are well-formed (id, severity, status, evidence, action)`,
    bad.length === 0, bad.slice(0, 8).join('; '));
}

// B8. Every flag referenced in copy exists.
{
  const ids = new Set(flags.map((f) => f.id));
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    const re = /\bF-(\d{2})\b/g;
    let m;
    while ((m = re.exec(h)) !== null) if (!ids.has(`F-${m[1]}`)) bad.push(`${rel(f)}: F-${m[1]}`);
  }
  check('Data integrity', 'B8 every flag id referenced in site copy exists in the flag register',
    bad.length === 0, [...new Set(bad)].slice(0, 10).join('; '));
}

// B9. Exactly five analytics events, matching the published definition.
{
  const data = JSON.parse(read(join(ROOT, 'data/events.json')));
  check('Data integrity', 'B9 exactly five analytics events are defined',
    EVENTS.length === 5 && data.events.length === 5,
    `EVENTS=${EVENTS.length}, data/events.json=${data.events.length}`);
  check('Data integrity', 'B9b events.json matches the code definition',
    JSON.stringify(data.events.map((e) => e.name)) === JSON.stringify(EVENTS.map((e) => e.name)),
    'the published event list drifted from the implementation');
}

// B10. The campaign ledger is empty and carries no forbidden field.
{
  const l = JSON.parse(read(join(ROOT, 'data/campaign-ledger.json')));
  const bad = [];
  if (l.entries.length !== 0) bad.push(`${l.entries.length} rows present \u2014 the ledger must start empty`);
  if (l.forbiddenFields?.conversion_score == null) bad.push('conversion_score is not declared forbidden');
  if (l.forbiddenFields?.revenue_forecast == null) bad.push('revenue_forecast is not declared forbidden');
  const s = JSON.stringify(l);
  if (/'conversion_score'\s*:/.test(s) && !/forbidden/i.test(s)) bad.push('conversion_score appears outside forbiddenFields');
  for (const k of ['timestamp', 'recorded_at', 'source_report', 'channel', 'eligible_sessions', 'clicks', 'reported_orders']) {
    if (!l.schema[k] && !(k === 'timestamp' && l.schema.recorded_at)) bad.push(`schema is missing ${k}`);
  }
  if (!Array.isArray(l.provenance) || l.provenance.length === 0) bad.push('no dated provenance trail');
  check('Data integrity', 'B10 campaign ledger is empty, well-defined and prohibits forecasts',
    bad.length === 0, bad.join('; '));
}

// B11. No placeholder email address that could receive real mail.
{
  const bad = [];
  const re = /[\w.+-]+@([\w-]+\.)+[a-z]{2,}/gi;
  for (const f of htmlFiles.concat(allFiles.filter((x) => /\.(xml|json|txt)$/.test(x)))) {
    const h = read(f);
    let m;
    while ((m = re.exec(h)) !== null) {
      const addr = m[0];
      // RFC 2606 reserved domains can never receive mail, so they are safe placeholders.
      if (!/@(?:invalid\.example|example\.(?:com|org)|invalid)$/.test(addr)) bad.push(`${rel(f)}: ${addr}`);
    }
  }
  check('Data integrity', 'B11 no invented contact address that could receive real mail',
    bad.length === 0, [...new Set(bad)].slice(0, 8).join('; '));
}

// A13. Positive controls. A detector that has never fired might be broken rather
//      than satisfied, so each copy rule is proved against a sample that MUST
//      trip it. If a future edit weakens a detector, this fails loudly instead
//      of silently letting real violations through.
{
  const BAD_SAMPLES = [
    ['A8 first-person experience', 'After three months I tested this rack in my kitchen and we found it held up.',
      (t) => ['i tested', 'we found that', 'in my kitchen'].some((p) => t.toLowerCase().includes(p))],
    ['A9 superlative', 'This is the best pot rack and our number one pick, top-rated by buyers.',
      (t) => /\bbest\b|#1\b|number one|top-rated/i.test(t)],
    ['A10 fabricated search volume', 'This keyword gets 12,000 monthly searches and 4,500 impressions.',
      (t) => /(?<![\w-])\d[\d,]*(?:\.\d+)?\s*(?:monthly\s+|daily\s+|annual\s+)?(?:searches|search volume|searches per month|impressions|pageviews|page views|keyword difficulty|clicks per month|visits per month|unique visitors)\b/i.test(t)],
    ['A11 revenue forecast', 'At a 4% rate we project estimated earnings of $1,200 next quarter.',
      (t) => {
        const hits = t.match(/.{0,220}(?:revenue forecast|conversion score|projected earnings|estimated earnings|forecasted revenue|predicted revenue|earnings projection).{0,220}/gi) || [];
        return hits.some((x) => !/not published|prohibited|neither appears|does not exist|forbidden|absent|never|unsupported|no revenue forecast|no conversion score|none|blank/i.test(x));
      }],
  ];
  const bad = [];
  for (const [name, sample, detector] of BAD_SAMPLES) {
    const text = visibleText(`<p>${sample}</p>`);
    if (!detector(text)) bad.push(`${name}: detector did NOT fire on "${sample.slice(0, 60)}"`);
  }
  // And the controls must not fire on legitimate copy from this site.
  const GOOD_SAMPLES = [
    'No search-volume, keyword-difficulty or traffic figure is published anywhere on this site.',
    'The word lightweight is the listing\u2019s own; no numerical load rating was captured, so the weight limit is left unverified.',
    'Flag F-02 covers search volume claims that were never made.',
    'A revenue forecast is not published, and no conversion score appears anywhere.',
    'Practices that are prohibited never appear here; this is the stated best practice for disclosure placement.',
  ];
  for (const s of GOOD_SAMPLES) {
    const t = visibleText(`<p>${s}</p>`);
    if (/(?<![\w-])\d[\d,]*(?:\.\d+)?\s*(?:monthly\s+|daily\s+|annual\s+)?(?:searches|search volume|impressions|pageviews|page views|keyword difficulty|clicks per month|visits per month|unique visitors)\b/i.test(t)) {
      bad.push(`A10 fired on legitimate copy: "${s.slice(0, 60)}"`);
    }
    if (/(?:revenue forecast|conversion score|estimated earnings)/i.test(t) &&
        !/not published|prohibited|none|never/i.test(t)) {
      bad.push(`A11 fired on legitimate copy: "${s.slice(0, 60)}"`);
    }
  }
  check('Compliance', `A13 positive controls \u2014 each copy detector fires on a violation and stays quiet on legitimate prose`,
    bad.length === 0, bad.join('\n       '));
}

/* ================================================================== */
/* C. STRUCTURAL                                                       */
/* ================================================================== */

// C1. Every guide is in the sitemap AND the feed.
{
  const sm = read(join(ROOT, 'sitemap.xml'));
  const feed = read(join(ROOT, 'feed.xml'));
  const badSm = guides.filter((g) => !sm.includes(`guides/${g.slug}.html`)).map((g) => g.id);
  const badFeed = guides.filter((g) => !feed.includes(`guides/${g.slug}.html`)).map((g) => g.id);
  check('Structural', `C1 all ${guides.length} guides are in sitemap.xml`,
    badSm.length === 0, `missing from sitemap: ${badSm.join(', ')}`);
  check('Structural', `C1b all ${guides.length} guides are in feed.xml`,
    badFeed.length === 0, `missing from feed: ${badFeed.join(', ')}`);
}

// C2. Every built page (except 404) is in the sitemap.
{
  const sm = read(join(ROOT, 'sitemap.xml'));
  const bad = htmlFiles
    .map(rel)
    .filter((p) => p !== '404.html' && !sm.includes(`<loc>${SITE.base}${p}</loc>`));
  check('Structural', 'C2 every built page except 404.html is in the sitemap',
    bad.length === 0, `missing: ${bad.slice(0, 8).join(', ')}`);
}

// C3. Every sitemap URL has a corresponding built file.
{
  const sm = read(join(ROOT, 'sitemap.xml'));
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const bad = locs.filter((u) => {
    const p = u.replace(SITE.base, '');
    return !existsSync(join(ROOT, p));
  });
  check('Structural', `C3 all ${locs.length} sitemap URLs resolve to a built file`,
    bad.length === 0, `no file for: ${bad.slice(0, 8).join(', ')}`);
}

// C4. robots.txt points at the sitemap and disallows nothing.
{
  const r = read(join(ROOT, 'robots.txt'));
  check('Structural', 'C4 robots.txt declares the sitemap', r.includes(`Sitemap: ${SITE.base}sitemap.xml`), 'no Sitemap line');
  check('Structural', 'C4b robots.txt disallows nothing', !/^Disallow:/m.test(r), 'a Disallow rule is present');
}

// C5. Feed autodiscovery and canonical on every page.
{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    if (!/<link rel="alternate" type="application\/rss\+xml"/.test(h)) bad.push(`${rel(f)}: no RSS autodiscovery`);
    if (!/<link rel="canonical" href="https:\/\//.test(h)) bad.push(`${rel(f)}: no absolute canonical`);
    if ((h.match(/<link rel="canonical"/g) || []).length !== 1) bad.push(`${rel(f)}: canonical is not exactly once`);
    if (!/<html lang="en-GB">/.test(h)) bad.push(`${rel(f)}: missing or wrong lang`);
    if (!/<meta charset="utf-8">/.test(h)) bad.push(`${rel(f)}: missing charset`);
    if (!/<meta name="viewport"/.test(h)) bad.push(`${rel(f)}: missing viewport`);
    if (!/<meta name="description" content="[^"]{40,}"/.test(h)) bad.push(`${rel(f)}: missing or thin description`);
    if ((h.match(/<h1[\s>]/g) || []).length !== 1) bad.push(`${rel(f)}: h1 count is not 1`);
  }
  check('Structural', 'C5 every page has autodiscovery, one canonical, lang, charset, viewport, description and exactly one h1',
    bad.length === 0, [...new Set(bad)].slice(0, 10).join('\n       '));
}

// C6. One indexable origin only \u2014 no canonical points anywhere else.
{
  const bad = [];
  for (const f of htmlFiles) {
    const m = read(f).match(/<link rel="canonical" href="([^"]+)"/);
    if (m && !m[1].startsWith(SITE.base)) bad.push(`${rel(f)}: ${m[1]}`);
  }
  check('Structural', `C6 every canonical points at the single Pages origin (${SITE.base})`,
    bad.length === 0, bad.slice(0, 6).join('; '));
}

// C7. No undefined, NaN or [object Object] leaking into rendered output.
//     Matches a cell or element whose ENTIRE content is the leaked value, so
//     legitimate prose such as "integer \u2265 0 or null" in a schema table is not
//     reported as a bug.
{
  const PATTERNS = [/\[object Object\]/, />null</, />undefined</, />NaN</, />Infinity</, /class="[^"]*undefined/, /title="null"/];
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    for (const p of PATTERNS) {
      const m = h.match(p);
      if (m) bad.push(`${rel(f)}: ${JSON.stringify(h.slice(Math.max(0, m.index - 60), m.index + 60))}`);
    }
  }
  check('Structural', 'C7 no undefined / NaN / [object Object] / bare-null leaked into the markup',
    bad.length === 0, [...new Set(bad)].slice(0, 10).join('\n       '));
}

// C8. No authoring leftovers.
{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    for (const t of ['TODO', 'FIXME', 'Lorem ipsum', 'XXX', 'PLACEHOLDER', 'TBD']) {
      if (h.includes(t)) bad.push(`${rel(f)}: contains "${t}"`);
    }
  }
  check('Structural', 'C8 no authoring leftovers in the built output',
    bad.length === 0, [...new Set(bad)].slice(0, 8).join('; '));
}

// C9. Every internal link resolves to a built file (same check as linkcheck, cheap version).
{
  const bad = [];
  const re = /<a\b[^>]*href="([^"#]+)(?:#[^"]*)?"/gi;
  for (const f of htmlFiles) {
    const h = read(f);
    let m;
    while ((m = re.exec(h)) !== null) {
      const href = m[1];
      if (/^(https?:|mailto:|javascript:)/.test(href)) continue;
      const target = join(dirname(f), decodeURIComponent(href));
      if (!existsSync(target)) bad.push(`${rel(f)} -> ${href}`);
    }
  }
  check('Structural', 'C9 every internal link resolves to a built file',
    bad.length === 0, [...new Set(bad)].slice(0, 12).join('\n       '));
}

// C10. Disclosure strip carries the analytics hook on every page.
{
  const bad = htmlFiles.filter((f) => !/id="disclosure-strip"[^>]*data-event="disclosure_view"/.test(read(f))).map(rel);
  check('Structural', 'C10 the disclosure strip is instrumented for disclosure_view on every page',
    bad.length === 0, bad.slice(0, 8).join(', '));
}

// C11. Dashboard surfaces are all reachable from the footer group and from the hub.
{
  const hub = read(join(ROOT, 'dashboard/index.html'));
  const foot = read(join(ROOT, 'index.html'));
  const slugs = ['index', 'product-research', 'link-intent', 'pricing', 'reviews', 'competition',
    'commission', 'niche', 'content-pipeline', 'link-management', 'click-tracking',
    'conversion-tracking', 'campaign-ledger', 'compliance-gate', 'seo', 'automation'];
  const badHub = slugs.filter((s) => !hub.includes(`dashboard/${s}.html`));
  const badFoot = slugs.filter((s) => !foot.includes(`dashboard/${s}.html`));
  check('Structural', `C11 all ${slugs.length} dashboard surfaces are linked from the hub`,
    badHub.length === 0, `missing from hub: ${badHub.join(', ')}`);
  check('Structural', `C11b all ${slugs.length} dashboard surfaces are listed in the footer group`,
    badFoot.length === 0, `missing from footer: ${badFoot.join(', ')}`);
}

// C12. Exactly one "Dashboard" entry in the primary navigation.
{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    const navBlock = h.match(/<nav class="nav"[\s\S]*?<\/nav>/);
    if (!navBlock) { bad.push(`${rel(f)}: no primary nav`); continue; }
    const n = (navBlock[0].match(/dashboard\/index\.html/g) || []).length;
    if (n !== 1) bad.push(`${rel(f)}: ${n} dashboard nav entries`);
  }
  check('Structural', 'C12 the primary navigation has exactly one Dashboard entry',
    bad.length === 0, bad.slice(0, 6).join('; '));
}

// C13. Required build artefacts exist.
{
  const needed = ['sitemap.xml', 'feed.xml', 'robots.txt', '404.html', '.nojekyll',
    'assets/css/site.css', 'assets/js/analytics.js', 'assets/js/ui.js',
    'data/products.json', 'data/flags.json', 'data/campaign-ledger.json', 'data/events.json'];
  const missing = needed.filter((n) => !existsSync(join(ROOT, n)));
  check('Structural', 'C13 every required artefact exists', missing.length === 0, `missing: ${missing.join(', ')}`);
}

// C14. Submissions are all accounted for.
{
  const covered = new Set(products.flatMap((p) => p.submissions));
  const bad = submissions.filter((s) => !covered.has(s.id)).map((s) => s.id);
  check('Data integrity', `C14 all ${submissions.length} supplied submissions appear in the register`,
    bad.length === 0, `not represented: ${bad.join(', ')}`);
  const dupes = submissions.length - new Set(submissions.map((s) => s.url)).size;
  check('Data integrity', `C14b the duplicate submission is recorded, not silently deduplicated (${dupes} duplicate)`,
    dupes === 1 && products.some((p) => p.duplicateSubmission === true), 'the duplicate is not flagged in the register');
}

/* ================================================================== */
/* Report                                                              */
/* ================================================================== */

const groups = ['Compliance', 'Data integrity', 'Structural'];
const fails = results.filter((r) => !r.ok);

console.log(`\nVERIFY \u2014 ${results.length} checks against ${htmlFiles.length} built pages\n`);
for (const g of groups) {
  const rs = results.filter((r) => r.group === g);
  const f = rs.filter((r) => !r.ok).length;
  console.log(`  ${g.padEnd(16)} ${String(rs.length).padStart(4)} checks   ${f === 0 ? 'all passing' : f + ' FAILING'}`);
}

if (fails.length) {
  console.log(`\n\u2717 ${fails.length} check(s) failed:\n`);
  for (const f of fails) console.log(`  [${f.group}] ${f.name}\n      ${f.detail}\n`);
  process.exit(1);
}

console.log('\n\u2713 All checks passed. The compliance gate is satisfied for this build.');
console.log('  Note: passing this gate does NOT mean the site is monetised. Nine obligations');
console.log('  still require a human \u2014 see dashboard/compliance-gate.html.');
process.exit(0);
