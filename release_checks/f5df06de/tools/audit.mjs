#!/usr/bin/env node
/**
 * INDEPENDENT AUDIT of the integrated publication on `main`.
 *
 * This session built a competing 46-page baseline in isolation from the empty
 * initial commit and discovered the integrated site only when it fetched
 * origin/main. That baseline is RETIRED, not published. What survives here is
 * the part that is genuinely additive: a verification gate pointed at somebody
 * else's live site.
 *
 * The gate was written to police this session's own output. Running it against a
 * publication it did not generate is a stronger test of the gate, and it is the
 * pattern the board already established for late-arriving sessions
 * (release_checks/e10111d6/, verification/).
 *
 *   node release_checks/f5df06de/tools/audit.mjs
 *
 * Exits non-zero on any finding, so it is usable as a CI check. It MODIFIES
 * NOTHING: read-only across the whole tree.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');           // repository root = the published site
const SCOPE = relative(ROOT, resolve(HERE, '..')); // this session's own directory, excluded

const results = [];
function check(group, name, ok, detail) {
  results.push({ group, name, ok: Boolean(ok), detail: ok ? '' : detail || '' });
}

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    if (e === '.git' || e === 'node_modules' || e === '.arena') continue;
    const full = join(dir, e);
    const r = relative(ROOT, full).split('\\').join('/');
    if (r === SCOPE || r.startsWith(SCOPE + '/')) continue; // never audit our own retired scope
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const allFiles = walk(ROOT);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const read = (f) => readFileSync(f, 'utf8');

/* ---- the verbatim strings Amazon requires ---- */
const DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.';
const PRICE_DISCLAIMER = 'Product prices and availability are accurate as of the date/time indicated and are subject to change.';
const CONTENT_DISCLAIMER = 'THIS CONTENT IS PROVIDED';

/** Text a reader actually sees, so copy checks are not tripped by the pages
 *  that DOCUMENT the rules. Tags, code samples and quoted examples are removed. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/"[^"\n]{0,200}?"/g, ' ')
    .replace(/\u201c[^\u201d\n]{0,200}?\u201d/g, ' ')
    .replace(/\s+/g, ' ');
}

/* ---- the site's own origin, read from its canonical tags ---- */
const OWN_ORIGIN = (() => {
  for (const f of htmlFiles) {
    const m = read(f).match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
    if (m) { try { return new URL(m[1]).origin; } catch { /* keep looking */ } }
  }
  return null;
})();

/**
 * A link is a PAID PLACEMENT only if it is a product/short link. Amazon also
 * owns documentation properties (affiliate-program.amazon.com, sell.amazon.com)
 * and browse-node pages (/b?node=...), which are cited as sources rather than
 * monetised. Google's guidance is to mark "links that are advertisements or paid
 * placements" — marking a policy citation sponsored would misdescribe it, so the
 * test is deliberately narrow and path-aware.
 */
const PRODUCT_HOSTS = ['www.amazon.com', 'amazon.com', 'smile.amazon.com', 'link.amazon', 'amzn.to', 'a.co'];
const DOC_HOSTS = ['affiliate-program.amazon.com', 'sell.amazon.com', 'developer.amazon.com', 'www.aboutamazon.com'];
function classify(href) {
  let u;
  try { u = new URL(href, 'http://x'); } catch { return 'other'; }
  const h = u.hostname.toLowerCase();
  if (DOC_HOSTS.some((d) => h === d || h.endsWith('.' + d))) return 'documentation';
  if (!PRODUCT_HOSTS.some((s) => h === s || h.endsWith('.' + s))) return 'other';
  // Browse-node and help pages on a shopping host are citations, not placements.
  if (/^\/b\b/.test(u.pathname) || u.pathname.startsWith('/gp/help')) return 'documentation';
  if (/^\/(dp|gp\/product)\//.test(u.pathname) || h === 'link.amazon' || h === 'amzn.to' || h === 'a.co') return 'product';
  return 'other';
}
const isShopping = (href) => classify(href) === 'product';

/** An absolute URL pointing at this site's own origin is an INTERNAL link. */
function isSameOrigin(href) {
  if (!OWN_ORIGIN) return false;
  try { return new URL(href, 'http://x').origin === OWN_ORIGIN; } catch { return false; }
}

console.log(`\nAUDIT of the integrated publication`);
console.log(`  root      ${ROOT}`);
console.log(`  scope     ${SCOPE}/ (this session's retired baseline \u2014 excluded)\n`);

/* ================================================================== */
/* A. DISCLOSURE PLACEMENT                                             */
/* ================================================================== */

// A1 \u2014 Operating Agreement \u00a75 sentence present, and ABOVE THE FOLD.
{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    const at = h.indexOf(DISCLOSURE);
    if (at === -1) { bad.push(`${rel(f)}: sentence absent`); continue; }
    const mainAt = h.search(/<main[\s>]/);
    const bodyAt = h.search(/<body[\s>]/);
    const marker = mainAt !== -1 ? mainAt : bodyAt;
    if (marker !== -1 && at > marker) bad.push(`${rel(f)}: sentence appears after the content start`);
  }
  check('Disclosure', `A1 \u00a75 sentence present and above the fold on all ${htmlFiles.length} pages`,
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

// A2 \u2014 the sentence appears at least twice per page (strip + footer).
{
  const bad = [];
  for (const f of htmlFiles) {
    const n = read(f).split(DISCLOSURE).length - 1;
    if (n < 2) bad.push(`${rel(f)}: ${n} occurrence(s)`);
  }
  check('Disclosure', 'A2 disclosure repeated (strip + footer) on every page',
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

// A3 \u2014 IP License \u00a72(i)/(k) disclaimers where Amazon content is shown.
{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    if (!/\$\d/.test(h)) continue;               // only pages that display a price
    if (!h.includes(PRICE_DISCLAIMER)) bad.push(`${rel(f)}: shows a price without the \u00a72(i) disclaimer`);
  }
  check('Disclosure', 'A3 \u00a72(i) price disclaimer on every page that displays a price',
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

/* ================================================================== */
/* B. LINK MARKING AND ATTRIBUTION                                     */
/* ================================================================== */

// B1 \u2014 every shopping-host link carries rel="sponsored".
{
  const RE = /<a\b[^>]*>/gi;
  let total = 0; const bad = [];
  for (const f of htmlFiles) {
    const h = read(f); let m;
    while ((m = RE.exec(h)) !== null) {
      const tag = m[0];
      const href = (tag.match(/href="([^"]+)"/) || [])[1] || '';
      if (!isShopping(href)) continue;
      total++;
      const r = (tag.match(/\brel="([^"]*)"/i) || [])[1];
      if (!r || !/\bsponsored\b/.test(r)) bad.push(`${rel(f)} -> ${href} (rel="${r || 'MISSING'}")`);
    }
  }
  check('Links', `B1 every shopping-host link is rel="sponsored" (${total} checked)`,
    bad.length === 0, bad.slice(0, 8).join('\n       '));
}

// B2 \u2014 no tagged CTA is live while attribution remains unvalidated.
//      The board records this as a remediation request to the owning session
//      (release_checks/e10111d6/ \u2192 "correct enabled unvalidated tagged CTAs").
//      This check confirms whether it was carried out.
{
  const bad = [];
  let tagged = 0;
  // PUBLISHED artefacts only. Pipeline tooling under scripts/ is *meant* to
  // construct tagged links — that is its job — so scanning it would report the
  // tool for existing. The control that matters is that no tagged link reaches a
  // page a reader or a crawler can fetch.
  const published = allFiles.filter((x) => /\.(html|xml)$/.test(x));
  for (const f of published) {
    const m = read(f).match(/[?&]tag=[A-Za-z0-9_-]+/g);
    if (m) { tagged += m.length; bad.push(`${rel(f)}: ${[...new Set(m)].join(', ')}`); }
  }
  check('Links', `B2 no tagged affiliate CTA in any published artefact (${published.length} files)`,
    tagged === 0, `${tagged} tagged link(s) found:\n       ${bad.slice(0, 8).join('\n       ')}`);
}

// B3 \u2014 intent and observed-redirect identity must stay separate.
{
  const csv = join(ROOT, 'data/products.csv');
  const json = join(ROOT, 'data/products.json');
  if (existsSync(csv)) {
    const head = read(csv).split('\n')[0];
    const hasIntent = /intent/i.test(head);
    const hasObserved = /observ|redirect|resolved|destination/i.test(head);
    check('Data', 'B3 products.csv keeps intent and observed-redirect columns distinct',
      hasIntent && hasObserved, `header: ${head}`);
  } else if (existsSync(json)) {
    const rows = JSON.parse(read(json));
    const arr = Array.isArray(rows) ? rows : (rows.products || []);
    const keys = arr[0] ? Object.keys(arr[0]).join(',') : '';
    check('Data', 'B3 products.json keeps intent and observed-redirect fields distinct',
      /intent/i.test(keys) && /observ|redirect|resolved|destination/i.test(keys), `keys: ${keys}`);
  } else {
    check('Data', 'B3 a product register exists to audit', false, 'neither data/products.csv nor data/products.json found');
  }
}

/* ================================================================== */
/* C. COPY RULES                                                       */
/* ================================================================== */

const EXPERIENCE = ['i tested', 'we tested', 'i tried', 'we tried', 'in my experience',
  'in our experience', 'we found that', 'i have used', 'we have used', 'i bought this',
  'we bought this', 'i recommend', 'we recommend', 'in my kitchen', 'in our kitchen',
  'i own this', 'we own this'];

const SUPERLATIVE = [/#1\b/, /\bnumber one\b/, /\btop-rated\b/, /\btop rated\b/,
  /\bbest\b(?!\s+practice)/i, /\bworld-class\b/, /\bunbeatable\b/, /\bguaranteed\b/i,
  /\bmarket-leading\b/, /\bclass-leading\b/];

const VOLUME = /(?<![\w-])\d[\d,]*(?:\.\d+)?\s*(?:monthly\s+|daily\s+|annual\s+)?(?:searches|search volume|searches per month|impressions|pageviews|page views|keyword difficulty|clicks per month|visits per month|unique visitors)\b/i;

const FORECAST = /revenue forecast|conversion score|projected earnings|estimated earnings|forecasted revenue|predicted revenue|earnings projection/i;
const FORECAST_OK = /not publish|do not publish|must not|never publish|avoid publish|prohibit|neither appears|does not exist|forbidden|absent|never|unsupported|no revenue forecast|no conversion score|not offered|none|blank|withdrawn|gated|not claimed|not asserted/i;

for (const [name, list] of [['C1 no first-person experience claims', EXPERIENCE]]) {
  const bad = [];
  for (const f of htmlFiles) {
    const t = visibleText(read(f)).toLowerCase();
    for (const ph of list) if (t.includes(ph)) bad.push(`${rel(f)}: "${ph}"`);
  }
  check('Copy', name, bad.length === 0, bad.slice(0, 8).join('\n       '));
}

{
  const bad = [];
  for (const f of htmlFiles) {
    const t = visibleText(read(f));
    for (const re of SUPERLATIVE) {
      const m = t.match(re);
      if (m) bad.push(`${rel(f)}: ${JSON.stringify(m[0])} \u2026 "${t.slice(Math.max(0, m.index - 40), m.index + 50).trim()}"`);
    }
  }
  check('Copy', 'C2 no superlatives or product rankings', bad.length === 0, bad.slice(0, 10).join('\n       '));
}

{
  const bad = [];
  for (const f of htmlFiles) {
    const t = visibleText(read(f));
    const m = t.match(VOLUME);
    if (m) bad.push(`${rel(f)}: ${JSON.stringify(m[0])}`);
  }
  check('Copy', 'C3 no fabricated search-volume or traffic figures', bad.length === 0, bad.slice(0, 8).join('\n       '));
}

{
  const bad = [];
  for (const f of htmlFiles) {
    const t = visibleText(read(f));
    const hits = t.match(new RegExp(`.{0,220}(?:${FORECAST.source}).{0,220}`, 'gi')) || [];
    const unq = hits.filter((x) => !FORECAST_OK.test(x));
    if (unq.length) bad.push(`${rel(f)}: ${unq[0].trim().slice(0, 140)}`);
  }
  check('Copy', 'C4 no revenue forecast or conversion score presented as a figure', bad.length === 0, bad.slice(0, 6).join('\n       '));
}

// C5 \u2014 positive controls. A detector that never fired may be broken rather than
//      satisfied, so each rule is proved against a sample that MUST trip it.
{
  const CASES = [
    ['experience', '<p>After three months I tested this rack in my kitchen and we found it held up.</p>',
      (t) => EXPERIENCE.some((p) => t.toLowerCase().includes(p))],
    ['superlative', '<p>This is the best pot rack and our number one pick, top-rated by buyers.</p>',
      (t) => SUPERLATIVE.some((re) => re.test(t))],
    ['volume', '<p>This keyword gets 12,000 monthly searches and 4,500 impressions.</p>',
      (t) => VOLUME.test(t)],
    ['forecast', '<p>At a 4% rate we project estimated earnings of $1,200 next quarter.</p>',
      (t) => {
        const h = t.match(new RegExp(`.{0,220}(?:${FORECAST.source}).{0,220}`, 'gi')) || [];
        return h.some((x) => !FORECAST_OK.test(x));
      }],
  ];
  const bad = [];
  for (const [label, sample, detector] of CASES) {
    if (!detector(visibleText(sample))) bad.push(`detector "${label}" did NOT fire on a known violation`);
  }
  // And must stay quiet on legitimate prose.
  const GOOD = 'No search-volume figure is published; a revenue forecast is not offered and no conversion score appears anywhere.';
  if (VOLUME.test(visibleText(GOOD))) bad.push('volume detector fired on legitimate prose');
  check('Copy', 'C5 positive controls \u2014 every copy detector fires on a violation',
    bad.length === 0, bad.join('\n       '));
}

/* ================================================================== */
/* D. IMAGERY, TRACKERS, RENDERING                                     */
/* ================================================================== */

{
  const RE = /(?:src|href)\s*=\s*"[^"]*(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com|images-eu\.ssl-images-amazon\.com|images-fe\.ssl-images-amazon\.com)/i;
  const bad = htmlFiles.filter((f) => RE.test(read(f))).map(rel);
  check('Assets', 'D1 no Amazon product imagery hotlinked (IP License \u00a72(h) 24-hour cache limit)',
    bad.length === 0, bad.slice(0, 8).join(', '));
}

{
  const bad = [];
  const RE = /<(script|img|iframe|link)\b([^>]*)>/gi;
  for (const f of htmlFiles) {
    const h = read(f); let m;
    while ((m = RE.exec(h)) !== null) {
      const tag = m[1].toLowerCase(), attrs = m[2];
      if (tag === 'link' && !/rel\s*=\s*"(?:stylesheet|preload|prefetch|modulepreload|icon|manifest)"/i.test(attrs)) continue;
      const u = (attrs.match(/(?:src|href)\s*=\s*"([^"]+)"/i) || [])[1] || '';
      // An absolute URL to this site's own origin is a same-origin subresource,
      // not a third-party request. A 404 page in particular MUST use absolute
      // URLs, because it is served at arbitrary depth where relative paths break.
      if (isSameOrigin(u)) continue;
      if (/^https?:|^\/\//.test(u)) bad.push(`${rel(f)} -> <${tag}> ${u}`);
    }
    if (/googletagmanager|google-analytics|gtag\(|fbq\(|doubleclick|hotjar|clarity\.ms|jsdelivr|unpkg\.com|cdnjs/i.test(h)) {
      bad.push(`${rel(f)} -> tracker or CDN signature`);
    }
  }
  check('Assets', 'D2 no third-party subresource or tracker', bad.length === 0, [...new Set(bad)].slice(0, 8).join('\n       '));
}

{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    if ((h.match(/<h1[\s>]/g) || []).length !== 1) bad.push(`${rel(f)}: h1 count is not 1`);
    if (!/<meta charset/i.test(h)) bad.push(`${rel(f)}: no charset`);
    if (!/<meta name="viewport"/i.test(h)) bad.push(`${rel(f)}: no viewport`);
    if (!/<html[^>]*\blang=/i.test(h)) bad.push(`${rel(f)}: no lang`);
    if (!/<meta name="description" content="[^"]{40,}"/i.test(h)) bad.push(`${rel(f)}: missing or thin description`);
  }
  check('Rendering', 'D3 every page has exactly one h1, charset, viewport, lang and a real description',
    bad.length === 0, [...new Set(bad)].slice(0, 10).join('\n       '));
}

{
  const bad = [];
  for (const f of htmlFiles) {
    const h = read(f);
    for (const p of [/\[object Object\]/, />null</, />undefined</, />NaN</, />Infinity</]) {
      const m = h.match(p);
      if (m) bad.push(`${rel(f)}: ${JSON.stringify(h.slice(Math.max(0, m.index - 50), m.index + 50))}`);
    }
    for (const t of ['TODO', 'FIXME', 'Lorem ipsum', 'PLACEHOLDER']) if (h.includes(t)) bad.push(`${rel(f)}: "${t}"`);
  }
  check('Rendering', 'D4 no leaked nulls, placeholders or authoring leftovers',
    bad.length === 0, [...new Set(bad)].slice(0, 8).join('\n       '));
}

/* ================================================================== */
/* E. FINDABILITY                                                      */
/* ================================================================== */

const smPath = join(ROOT, 'sitemap.xml');
const sm = existsSync(smPath) ? read(smPath) : null;

{
  if (!sm) {
    check('Findability', 'E1 sitemap.xml exists', false, 'missing');
  } else {
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const bad = locs.filter((u) => {
      const p = u.replace(/^https?:\/\/[^/]+\/(?:DIYHOME3\/)?/, '');
      return p && !existsSync(join(ROOT, p)) && !existsSync(join(ROOT, p, 'index.html'));
    });
    check('Findability', `E1 all ${locs.length} sitemap URLs resolve to a real file`,
      bad.length === 0, `no file for: ${bad.slice(0, 8).join(', ')}`);

    // Coverage is reported, not enforced. A sitemap should list the canonical
    // indexable set; legacy handoff routes and utility/dashboard pages are
    // legitimately excluded, and only the owning session knows which is which.
    const listed = htmlFiles.map(rel).filter((p) => sm.includes(p) || sm.includes(p.replace(/index\.html$/, '')));
    console.log(`  sitemap covers ${listed.length} of ${htmlFiles.length} published pages (by design: legacy handoffs and dashboards are excluded)`);
  }
}

{
  const feedPath = join(ROOT, 'feed.xml');
  if (!existsSync(feedPath)) {
    check('Findability', 'E3 feed.xml exists', false, 'missing');
  } else {
    const feed = read(feedPath);
    check('Findability', 'E3 feed is RSS 2.0 with a self link',
      /<rss[^>]*version="2\.0"/.test(feed) && /atom:link[^>]*rel="self"/.test(feed),
      'missing rss version or atom:link rel="self"');
    const items = (feed.match(/<item>/g) || []).length;
    // Count only CURRENT guides: the ones the sitemap declares. Legacy *.html
    // handoff routes are retained for old URLs and are deliberately not guides.
    const declared = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes('/guides/') && !u.endsWith('/guides/'));
    check('Findability', `E4 feed carries an item for every declared guide (${items} items, ${declared.length} declared)`,
      items >= declared.length && declared.length > 0, `${items} feed items vs ${declared.length} declared guides`);
    check('Findability', 'E5 feed carries the disclosure',
      feed.includes(DISCLOSURE), 'the \u00a75 sentence is absent from the channel description');
    const ad = htmlFiles.filter((f) => !/<link[^>]*rel="alternate"[^>]*rss/i.test(read(f))).map(rel);
    check('Findability', 'E6 every page declares feed autodiscovery', ad.length === 0, ad.slice(0, 8).join(', '));
  }
}

{
  const rp = join(ROOT, 'robots.txt');
  check('Findability', 'E7 robots.txt declares the sitemap',
    existsSync(rp) && /Sitemap:/i.test(read(rp)), existsSync(rp) ? 'no Sitemap line' : 'robots.txt missing');
}

/* ================================================================== */
/* F. LINK INTEGRITY                                                   */
/* ================================================================== */

{
  const ids = new Map();
  for (const f of htmlFiles) ids.set(rel(f), new Set([...read(f).matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));

  const broken = []; const targets = new Set(); const external = new Set();
  const RE = /<a\b[^>]*href="([^"]*)"[^>]*>/gi;
  for (const f of htmlFiles) {
    const h = read(f); let m;
    while ((m = RE.exec(h)) !== null) {
      const raw = m[1];
      if (!raw || /^(mailto:|tel:|javascript:)/.test(raw)) continue;
      // Absolute URLs to our own origin are internal links and must be resolved
      // as such, or every page linked that way looks like an orphan.
      let local = raw;
      if (/^https?:/.test(raw)) {
        if (!isSameOrigin(raw)) { external.add(raw); continue; }
        try { local = new URL(raw).pathname.replace(/^\/DIYHOME3\//, ''); } catch { external.add(raw); continue; }
      }
      const [path, hash] = local.split('#');
      if (!path) {
        if (hash && !(ids.get(rel(f)) || new Set()).has(decodeURIComponent(hash))) {
          broken.push(`${rel(f)} -> #${hash} (no such id on the page)`);
        }
        continue;
      }
      const t = resolve(dirname(f), decodeURIComponent(path));
      if (!existsSync(t)) { broken.push(`${rel(f)} -> ${raw} (no file)`); continue; }
      const tRel = relative(ROOT, t).split('\\').join('/');
      if (statSync(t).isDirectory()) {
        if (!existsSync(join(t, 'index.html'))) broken.push(`${rel(f)} -> ${raw} (directory with no index.html)`);
        else targets.add(relative(ROOT, join(t, 'index.html')).split('\\').join('/'));
      } else targets.add(tRel);
      if (hash && t.endsWith('.html') && !(ids.get(tRel) || new Set()).has(decodeURIComponent(hash))) {
        broken.push(`${rel(f)} -> ${raw} (no id "${hash}" in ${tRel})`);
      }
    }
  }
  check('Links', `F1 every internal link and in-page anchor resolves (${targets.size} targets)`,
    broken.length === 0, [...new Set(broken)].slice(0, 12).join('\n       '));

  // Legacy handoff routes are deliberately retained for old URLs and are
  // intentionally unlinked — this site marks them data-page="archive" and says
  // "This page has moved". They are not orphans by accident, so they are
  // excluded. Everything else should be reachable from the navigation.
  const isArchive = (f) => /data-page="archive"/.test(read(f));
  const archived = htmlFiles.filter(isArchive).map(rel);
  const orphans = htmlFiles.map(rel)
    .filter((p) => p !== '404.html' && p !== 'index.html' && !targets.has(p)
      && !isArchive(join(ROOT, p)));
  console.log(`  legacy archive routes excluded from the orphan check: ${archived.length}`);
  check('Links', 'F2 no orphan pages among current (non-archive) routes',
    orphans.length === 0, orphans.slice(0, 10).join(', '));

  const missingAsset = [];
  const ARE = /<(?:img|script|link)\b[^>]*(?:src|href)="([^"]+)"/gi;
  for (const f of htmlFiles) {
    const h = read(f); let m;
    while ((m = ARE.exec(h)) !== null) {
      const u = m[1];
      if (/^https?:|^\/\/|^data:/.test(u)) continue;
      if (!existsSync(resolve(dirname(f), decodeURIComponent(u)))) missingAsset.push(`${rel(f)} -> ${u}`);
    }
  }
  check('Links', 'F3 every referenced asset exists', missingAsset.length === 0,
    [...new Set(missingAsset)].slice(0, 8).join('\n       '));

  console.log(`  external destinations referenced: ${external.size}`);
}

/* ================================================================== */
/* Report                                                              */
/* ================================================================== */

const groups = ['Disclosure', 'Links', 'Copy', 'Assets', 'Rendering', 'Findability', 'Data'];
const fails = results.filter((r) => !r.ok);

console.log(`\n${results.length} checks against ${htmlFiles.length} published pages\n`);
for (const g of groups) {
  const rs = results.filter((r) => r.group === g);
  if (!rs.length) continue;
  const n = rs.filter((r) => !r.ok).length;
  console.log(`  ${g.padEnd(14)} ${String(rs.length).padStart(3)} checks   ${n === 0 ? 'all passing' : n + ' FINDING(S)'}`);
}

if (fails.length) {
  console.log(`\n\u2717 ${fails.length} finding(s):\n`);
  for (const f of fails) console.log(`  [${f.group}] ${f.name}\n      ${f.detail}\n`);
  console.log('Findings are reported, not fixed: this session does not own the published tree.');
  console.log('Each is logged in COORDINATION.md as a request to the owning session.');
  process.exit(1);
}

console.log('\n\u2713 No findings. The integrated publication satisfies every check in this gate.');
process.exit(0);
