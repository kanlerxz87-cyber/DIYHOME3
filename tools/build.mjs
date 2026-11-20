#!/usr/bin/env node
/**
 * BUILD — renders the whole site from site/data/*.mjs.
 *
 * One registry \u2192 every artefact. HTML pages, sitemap.xml, feed.xml, robots.txt
 * and the machine-readable JSON are all derived from the same source, so adding a
 * guide or correcting a product cannot leave the sitemap, the feed or a dashboard
 * table out of step. That is the whole point of the design.
 *
 *   node tools/build.mjs
 *
 * Then:
 *   node tools/verify.mjs      compliance and data gate
 *   node tools/linkcheck.mjs   internal link crawl
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page, SITE, esc, link } from '../site/layout.mjs';
import { products, submissions, clusters, TRACKING_ID, OBSERVED_AT, OBSERVED_FROM } from '../site/data/products.mjs';
import { guides, seasons, AUTHOR, cadence } from '../site/data/guides.mjs';
import { flags, flagCounts } from '../site/data/flags.mjs';
import { sources } from '../site/data/sources.mjs';
import { dashboardSurfaces, EVENTS } from '../site/pages/dashboard.mjs';
import {
  frontPage, productsIndex, productPage, guidesIndex, guidePage, clustersIndex,
  comparePage, flaggedPage,
} from '../site/pages/editorial.mjs';
import {
  aboutPage, methodologyPage, sourcesPage,
  complianceIndex, disclosurePage, associatesPolicyPage, ftcPage, privacyPage,
  executiveSummaryPage, notFoundPage,
} from '../site/pages/static.mjs';
import { renderBlocks, breadcrumbs, AMAZON_DISCLOSURE } from '../site/layout.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DATE = '2026-11-20';
const OUT = [];

function write(relPath, content) {
  const abs = join(ROOT, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, 'utf8');
  OUT.push(relPath);
}

const surfaces = dashboardSurfaces();

/* ------------------------------------------------------------------ */
/* 1. Assemble the page list                                            */
/* ------------------------------------------------------------------ */

const pages = [];

// Front page
{
  const d = frontPage('index.html');
  pages.push({
    out: 'index.html',
    title: d.title,
    description: d.description,
    activeKey: 'home',
    body: d.body,
    priority: '1.0',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.base,
      description: d.description,
      publisher: { '@type': 'Organization', name: SITE.name },
    },
  });
}

// Products index
{
  const d = productsIndex('products/index.html');
  pages.push({ out: 'products/index.html', ...d, priority: '0.9' });
}

// Product pages
for (const x of products) {
  const out = `products/${x.slug}.html`;
  const d = productPage(x, out);
  pages.push({
    out,
    ...d,
    priority: '0.8',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': ['Article', 'BreadcrumbList'],
    },
  });
}

// Guides index
{
  const out = 'guides/index.html';
  const d = guidesIndex(out);
  pages.push({ out, ...d, priority: '0.9' });
}

// Guide pages
for (const g of guides) {
  const out = `guides/${g.slug}.html`;
  const d = guidePage(g, out);
  pages.push({ out, ...d, priority: '0.8' });
}

// Clusters
{
  const out = 'clusters/index.html';
  pages.push({ out, ...clustersIndex(out), priority: '0.7' });
}

// Compare
{
  const out = 'reviews/index.html';
  pages.push({ out, ...comparePage(out), priority: '0.7' });
}

// Flagged
{
  const out = 'flagged/index.html';
  pages.push({ out, ...flaggedPage(out), priority: '0.8' });
}

// Compliance hub + children
{
  const out = 'compliance/index.html';
  pages.push({ out, ...complianceIndex(out), priority: '0.6' });
}
for (const [slug, fn, pr] of [
  ['disclosure', disclosurePage, '0.7'],
  ['associates-policy', associatesPolicyPage, '0.6'],
  ['ftc', ftcPage, '0.6'],
  ['privacy', privacyPage, '0.6'],
]) {
  const out = `compliance/${slug}.html`;
  pages.push({ out, ...fn(out), priority: pr });
}

// About, methodology, sources
{
  const out = 'about/index.html';
  pages.push({ out, ...aboutPage(out), priority: '0.5' });
}
{
  const out = 'methodology/index.html';
  pages.push({ out, ...methodologyPage(out), priority: '0.6' });
}
{
  const out = 'methodology/sources.html';
  pages.push({ out, ...sourcesPage(out), priority: '0.6' });
}

// Executive summary
{
  const out = 'executive-summary.html';
  pages.push({ out, ...executiveSummaryPage(out), priority: '0.9' });
}

// Dashboard hub
{
  const out = 'dashboard/index.html';
  const s = surfaces[0];
  pages.push({
    out,
    title: s.title,
    description: s.description,
    activeKey: 'dashboard',
    priority: '0.7',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Dashboard', null]])}
<div class="pill-nav">
  ${surfaces.map((x) => `<a href="${link(out, 'dashboard/' + x.slug + '.html')}"${x.slug === 'index' ? ' aria-current="page"' : ''}>${esc(x.navLabel)}</a>`).join('\n  ')}
</div>
${renderBlocks(s.blocks, out)}
<hr class="rule"/>
<h2>All surfaces</h2>
<div class="grid grid-3">
  ${surfaces.map((x) => `<a class="tile" href="${link(out, 'dashboard/' + x.slug + '.html')}">
    <span class="tile-title">${esc(x.navLabel)}</span>
    <span class="tile-meta">${esc(x.description)}</span>
  </a>`).join('\n  ')}
</div>
`,
  });
}

// Dashboard surfaces (skip index, already emitted)
for (const s of surfaces.slice(1)) {
  const out = `dashboard/${s.slug}.html`;
  pages.push({
    out,
    title: s.title,
    description: s.description,
    activeKey: 'dashboard',
    priority: '0.6',
    body: `
${breadcrumbs(out, [['Front page', 'index.html'], ['Dashboard', 'dashboard/index.html'], [s.navLabel, null]])}
<div class="pill-nav">
  ${surfaces.map((x) => `<a href="${link(out, 'dashboard/' + x.slug + '.html')}"${x.slug === s.slug ? ' aria-current="page"' : ''}>${esc(x.navLabel)}</a>`).join('\n  ')}
</div>
${renderBlocks(s.blocks, out)}
<hr class="rule"/>
<p class="tiny muted">
  Part of the <a href="${link(out, 'dashboard/index.html')}">operational dashboard</a>.
  Data on this surface is generated from the same register as the public pages.
  Anything that could not be confirmed from an official source is shown as a blank, not as an estimate.
</p>
`,
  });
}

// 404 (excluded from the sitemap deliberately)
const nf = notFoundPage('404.html');
pages.push({ out: '404.html', ...nf, activeKey: nf.activeKey, priority: null, noSitemap: true });

/* ------------------------------------------------------------------ */
/* 2. Render HTML                                                       */
/* ------------------------------------------------------------------ */

for (const pg of pages) {
  const html = page({
    out: pg.out,
    title: pg.title,
    description: pg.description,
    activeKey: pg.activeKey ?? null,
    body: pg.body,
    dashSurfaces: surfaces,
    jsonLd: pg.jsonLd ?? null,
  });
  write(pg.out, html);
}

/* ------------------------------------------------------------------ */
/* 3. sitemap.xml                                                       */
/* ------------------------------------------------------------------ */

const sitemapPages = pages.filter((p) => !p.noSitemap);

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (p) => `  <url>
    <loc>${SITE.base}${p.out}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${p.out.startsWith('guides/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p.priority || '0.5'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
);

/* ------------------------------------------------------------------ */
/* 4. feed.xml — RSS 2.0 (SG-28: the shipped RSS feed)                  */
/* ------------------------------------------------------------------ */

const xmlEsc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

write(
  'feed.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${xmlEsc(SITE.name)} \u2014 guides</title>
  <link>${xmlEsc(SITE.base)}guides/index.html</link>
  <atom:link href="${xmlEsc(SITE.base)}feed.xml" rel="self" type="application/rss+xml"/>
  <description>${xmlEsc(
    `Question-shaped buyer guides for reversible, low-cost home upgrades. ${AMAZON_DISCLOSURE} No superlatives, no rankings, no search-volume claims and no first-person experience claims, because no human has tested these products for this site.`
  )}</description>
  <language>en-GB</language>
  <lastBuildDate>${new Date(BUILD_DATE + 'T06:00:00Z').toUTCString()}</lastBuildDate>
  <docs>https://www.rssboard.org/rss-specification</docs>
  <generator>DIYHOME3 static build ${BUILD_DATE}</generator>
  <managingEditor>editorial@invalid.example (not configured \u2014 see flag F-13)</managingEditor>
  <webMaster>webmaster@invalid.example (not configured \u2014 see flag F-13)</webMaster>
${guides
  .map((g) => {
    const c = clusters[g.cluster];
    return `  <item>
    <title>${xmlEsc(g.title)}</title>
    <link>${xmlEsc(SITE.base)}guides/${g.slug}.html</link>
    <guid isPermaLink="true">${xmlEsc(SITE.base)}guides/${g.slug}.html</guid>
    <description>${xmlEsc(g.dek)}</description>
    <pubDate>${new Date(BUILD_DATE + 'T06:00:00Z').toUTCString()}</pubDate>
    <category>${xmlEsc(c ? c.name : g.cluster)}</category>
    <author>${xmlEsc(AUTHOR.byline)} (${xmlEsc(AUTHOR.role)})</author>
  </item>`;
  })
  .join('\n')}
</channel>
</rss>
`
);

/* ------------------------------------------------------------------ */
/* 5. robots.txt                                                        */
/* ------------------------------------------------------------------ */

write(
  'robots.txt',
  `# ${SITE.name} \u2014 everything on this site is intended to be indexed.
# Nothing is disallowed because nothing needs hiding: the Flagged for Review
# page is deliberately public.
User-agent: *
Allow: /

Sitemap: ${SITE.base}sitemap.xml
`
);

/* ------------------------------------------------------------------ */
/* 6. Machine-readable data                                             */
/* ------------------------------------------------------------------ */

write(
  'data/products.json',
  JSON.stringify(
    {
      $schema: 'diyhome3/product-register/v1',
      generated: BUILD_DATE,
      generatedFrom: 'site/data/products.mjs',
      trackingId: TRACKING_ID,
      observedAt: OBSERVED_AT,
      observedFrom: OBSERVED_FROM,
      submissions,
      products: products.map((x) => ({
        slug: x.slug,
        cluster: x.cluster,
        intent: x.intent,
        observed: x.observed,
        commissionRate: x.commissionRate,
        commissionRateStatus: 'unverified-null-see-flag-F-05',
      })),
      clusters,
      note:
        'intent and observed are separate objects by design and must never be merged. A null value means "no official source confirmed this"; it never means zero.',
    },
    null,
    2
  ) + '\n'
);

write(
  'data/flags.json',
  JSON.stringify(
    {
      $schema: 'diyhome3/flag-register/v1',
      generated: BUILD_DATE,
      counts: { ...flagCounts, bySeverity: flags.reduce((a, f) => ((a[f.severity] = (a[f.severity] || 0) + 1), a), {}) },
      flags,
    },
    null,
    2
  ) + '\n'
);

write(
  'data/campaign-ledger.json',
  JSON.stringify(
    {
      $schema: 'diyhome3/campaign-ledger/v1',
      generated: BUILD_DATE,
      entries: [],
      schema: {
        entry_id: { type: 'string', required: true, rule: 'Immutable, assigned on entry, never reused' },
        period_start: { type: 'ISO 8601 date', required: true },
        period_end: { type: 'ISO 8601 date', required: true, rule: 'Must be >= period_start' },
        recorded_at: { type: 'ISO 8601 timestamp', required: true, rule: 'When the row was entered, not when the period ended' },
        campaign: { type: 'string', required: true, rule: 'Must exist in campaigns; free text rejected' },
        channel: { type: 'enum', required: true, values: ['organic-search', 'direct', 'rss', 'email', 'social', 'referral', 'unknown'] },
        source_report: { type: 'string', required: true, rule: 'Exact report name the figures came from' },
        source_export_date: { type: 'ISO 8601 date', required: true, rule: 'A figure without an export date is rejected' },
        tracking_id: { type: 'string', required: true, rule: 'Must match the register tracking ID' },
        eligible_sessions: { type: 'integer >= 0 or null', required: false, rule: 'null = not reported; 0 = reported as zero. Never interchangeable' },
        clicks: { type: 'integer >= 0 or null', required: false, rule: 'As above' },
        reported_orders: { type: 'integer >= 0 or null', required: false, rule: 'As above' },
        qualifying_revenue: { type: 'number >= 0 or null', required: false, rule: 'As defined by Amazon, net of the Commission Income Statement deductions' },
        commission_income: { type: 'number >= 0 or null', required: false, rule: 'As reported. Never computed here from a rate' },
        notes: { type: 'string', required: false },
      },
      forbiddenFields: {
        conversion_score: 'Prohibited by the project brief.',
        revenue_forecast: 'Prohibited by the project brief, and unsupported by Operating Agreement Section 4.',
      },
      campaigns: [],
      provenance: [
        { date: '2026-11-20', event: 'Ledger schema defined and published', outcome: 'Committed with an empty entries array' },
        { date: '2026-11-20', event: 'Search for authorised first-party report data', outcome: 'None available. No Associates Central access in this session' },
        { date: '2026-11-20', event: 'Considered a third-party conversion estimate as a placeholder', outcome: 'Rejected. A placeholder estimate becomes indistinguishable from a real figure' },
        { date: null, event: 'First authorised report import', outcome: 'Not yet occurred' },
      ],
      note: 'Empty by design. Rows are added only from an authorised first-party report, with its name and export date recorded.',
    },
    null,
    2
  ) + '\n'
);

write(
  'data/events.json',
  JSON.stringify(
    {
      $schema: 'diyhome3/analytics-events/v1',
      generated: BUILD_DATE,
      definedIn: 'site/pages/dashboard.mjs',
      status:
        'The project brief instructed "record the five defined events" without enumerating them. This set is the build\u2019s documented reading of that instruction and is flagged as an assumption at F-21.',
      events: EVENTS,
      privacy: {
        cookiesSet: 0,
        thirdPartyScripts: 0,
        personalDataFields: [],
        neverRecorded: [
          'IP address',
          'user agent',
          'cookie or persistent identifier',
          'referrer',
          'full destination URL of an outbound click',
          'scroll depth, dwell time or reading position',
          'anything cross-site',
        ],
        storage: 'Five integers under one localStorage key on this origin. Aggregate counts only.',
      },
      collector: {
        implementation: 'analytics/server/index.mjs',
        routes: ['POST /collect', 'GET /stats', 'GET /healthz'],
        deployed: false,
        reasonNotDeployed:
          'GitHub Pages serves static files and executes nothing server-side. See flag F-11.',
      },
    },
    null,
    2
  ) + '\n'
);

/* ------------------------------------------------------------------ */
/* 7. Static bits                                                       */
/* ------------------------------------------------------------------ */

write('.nojekyll', '');

/* ------------------------------------------------------------------ */

console.log(`Built ${pages.length} pages.`);
console.log(`  sitemap.xml: ${sitemapPages.length} URLs`);
console.log(`  feed.xml:    ${guides.length} items`);
console.log(`  data/*.json: 4 files`);
console.log(`  products: ${products.length} | guides: ${guides.length} | flags: ${flags.length} | sources: ${sources.length}`);
console.log(`  dashboard surfaces: ${surfaces.length}`);
