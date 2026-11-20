/**
 * LAYOUT — the page shell shared by every page on the site.
 *
 * Three things here are compliance machinery, not decoration:
 *
 *  1. disclosureStrip() renders the Operating Agreement \u00a75 sentence verbatim,
 *     directly under the masthead, on every page. It is not optional and no page
 *     can opt out of it \u2014 it is part of the shell.
 *  2. footer() repeats the same sentence, plus the two verbatim Amazon IP License
 *     disclaimers required by \u00a72(i) and \u00a72(k).
 *  3. outbound() is the ONLY function allowed to emit an <a> that leaves this
 *     origin. It always writes rel="sponsored nofollow noopener noreferrer".
 *     tools/verify.mjs greps the built output for outbound links missing it.
 */

import { sources, byId } from './data/sources.mjs';

export const SITE = {
  name: 'DIYHOME3',
  tagline: 'Home upgrades, verified before they are recommended',
  base: 'https://kanlerxz87-cyber.github.io/DIYHOME3/',
  repo: 'https://github.com/kanlerxz87-cyber/DIYHOME3',
  lang: 'en-GB',
  buildDate: '2026-11-20',
  trackingId: 'shopnow047c-20',
};

export const AMAZON_DISCLOSURE = 'As an Amazon Associate I earn from qualifying purchases.';

export const AMAZON_CONTENT_DISCLAIMER =
  'CERTAIN CONTENT THAT APPEARS ON THIS SITE COMES FROM AMAZON. THIS CONTENT IS PROVIDED \u2018AS IS\u2019 AND IS SUBJECT TO CHANGE OR REMOVAL AT ANY TIME.';

export const AMAZON_PRICE_DISCLAIMER =
  'Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on amazon.com at the time of purchase will apply to the purchase of this product.';

/** SG-27 \u2014 the navigation label set, published so the choice is reviewable. */
export const NAV = [
  { label: 'Front page', href: 'index.html', key: 'home' },
  { label: 'Products', href: 'products/index.html', key: 'products' },
  { label: 'Guides', href: 'guides/index.html', key: 'guides' },
  { label: 'Clusters', href: 'clusters/index.html', key: 'clusters' },
  { label: 'Compare', href: 'reviews/index.html', key: 'compare' },
  { label: 'Compliance', href: 'compliance/index.html', key: 'compliance' },
  { label: 'Flagged', href: 'flagged/index.html', key: 'flagged' },
  { label: 'Dashboard', href: 'dashboard/index.html', key: 'dashboard' },
];

export const NAV_LABEL_RATIONALE = [
  ['Front page', 'Not "Home". The brief asks for a publication front page; the label should read like one.'],
  ['Products', 'The register of what is actually being marketed, with its verification status.'],
  ['Guides', 'Question-shaped editorial. Plural, because it is a growing set on a cadence.'],
  ['Clusters', 'Topic clusters and the seasonal calendar, kept separate from Guides so the structure is visible.'],
  ['Compare', 'Not "Reviews". This site publishes comparison criteria, not verdicts, so the label must not promise a rating.'],
  ['Compliance', 'The disclosure, the programme rules and the FTC guidance in one reachable place.'],
  ['Flagged', 'The Flagged for Review page. Deliberately in the primary navigation rather than hidden in the footer.'],
  ['Dashboard', 'One label, one entry. All sixteen operational surfaces sit behind it and are also listed in the footer, per the brief.'],
];

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** How many directory levels deep a page sits, so links can be made relative. */
export function depthOf(out) {
  const parts = out.split('/').filter(Boolean);
  return Math.max(0, parts.length - 1);
}

/** Relative prefix from a page to the site root. GitHub Pages serves under /DIYHOME3/. */
export function root(out) {
  const d = depthOf(out);
  return d === 0 ? './' : '../'.repeat(d);
}

export function link(out, target) {
  if (/^(https?:|mailto:|#)/.test(target)) return target;
  const t = target.replace(/^\//, '');
  const d = depthOf(out);
  if (d === 0) return './' + t;
  return '../'.repeat(d) + t;
}

/**
 * Hosts that are SHOPPING destinations. A link to one of these is a product link
 * in the eyes of both the brief and Google Search Central, whether the anchor
 * text says "buy" or says "source".
 *
 * Note what is deliberately absent: affiliate-program.amazon.com and
 * sell.amazon.com. Those are documentation properties, not shops, and links to
 * them are citations rather than commercial placements.
 */
const SHOPPING_HOSTS = ['amazon.com', 'www.amazon.com', 'smile.amazon.com', 'link.amazon', 'amzn.to', 'a.co'];

export function isShoppingHost(href) {
  try {
    const h = new URL(href, 'http://x').hostname.toLowerCase();
    return SHOPPING_HOSTS.some((s) => h === s || h.endsWith('.' + s));
  } catch {
    return false;
  }
}

/**
 * The ONLY sanctioned way to emit an outbound link.
 *
 * The rel value is not left to the caller's judgement. If the destination is a
 * shopping host the link is sponsored, full stop \u2014 declaring intent: 'source'
 * does not opt out. That makes the site-wide rule structural rather than
 * something every author has to remember, and tools/verify.mjs asserts it
 * against the built output.
 */
export function outbound(href, text, intent = 'source', extra = {}) {
  const shopping = isShoppingHost(href);
  const rel = shopping || intent === 'product'
    ? 'sponsored nofollow noopener noreferrer'
    : 'noopener noreferrer';
  const cls = extra.class ? ` class="${esc(extra.class)}"` : '';
  const title = extra.title ? ` title="${esc(extra.title)}"` : '';
  const id = extra.id ? ` id="${esc(extra.id)}"` : '';
  const data = extra.dataAttrs
    ? Object.entries(extra.dataAttrs).map(([k, v]) => ` data-${esc(k)}="${esc(v)}"`).join('')
    : '';
  return `<a${id}${cls} href="${esc(href)}" rel="${rel}" target="_blank"${title}${data}>${text}</a>`;
}

export function citeChip(id) {
  const s = byId[id];
  if (!s) throw new Error(`Unknown source id ${id}`);
  return outbound(s.url, id, 'source', {
    class: 'src',
    title: `${s.owner} \u2014 ${s.title} (checked ${s.checked})`,
  });
}

export function cites(ids) {
  if (!ids || !ids.length) return '';
  return `<span class="nowrap">${ids.map(citeChip).join(' ')}</span>`;
}

/** null renders as an explicit UNVERIFIED chip. A value renders with its sources. */
export function cell(value, { sourceIds = [], fmt = null, blankLabel = 'UNVERIFIED' } = {}) {
  if (value === null || value === undefined || value === '') {
    return `<span class="unverified" title="No official source confirmed this value in the 2026-11-20 verification pass. Left blank deliberately; never inferred.">${blankLabel}</span>`;
  }
  const shown = fmt ? fmt(value) : esc(value);
  return `${shown}${sourceIds.length ? ' ' + cites(sourceIds) : ''}`;
}

export const money = (n) => '$' + Number(n).toFixed(2);
export const int = (n) => Number(n).toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/* Brand mark: inline SVG. No external request, no Amazon imagery.     */
/* ------------------------------------------------------------------ */
export function brandMark(size = 34) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="DIYHOME3 mark" focusable="false">
  <rect x="1" y="1" width="62" height="62" rx="9" fill="#16181c"/>
  <path d="M12 33 L32 15 L52 33" fill="none" stroke="#b4552d" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 32.5 V49 H47 V32.5" fill="none" stroke="#f7f7f5" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="32" cy="41" r="4.6" fill="#0f5c4a"/>
  <path d="M32 45.6 V51" stroke="#0f5c4a" stroke-width="3.4" stroke-linecap="round"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

export function disclosureStrip(out) {
  return `<div class="disclosure" id="disclosure-strip" data-event="disclosure_view">
  <div class="disclosure-inner">
    <span class="d-mark">Disclosure</span>
    <span><strong>${esc(AMAZON_DISCLOSURE)}</strong> Product links on this site carry a commercial relationship and are marked <code class="inline">rel="sponsored"</code>. Attribution is currently <strong>not active</strong> \u2014 see <a href="${link(out, 'compliance/disclosure.html')}">the full disclosure</a> and <a href="${link(out, 'flagged/index.html')}">flag F-01</a>.</span>
  </div>
</div>`;
}

export function masthead(out) {
  const r = root(out);
  return `<header class="masthead">
  <div class="masthead-inner">
    <a class="wordmark" href="${r}index.html">
      ${brandMark(38)}
      <span class="wordmark-text">
        <span class="wordmark-name">DIYHOME3</span>
        <span class="wordmark-tag">${esc(SITE.tagline)}</span>
      </span>
    </a>
    <div class="masthead-date">
      Verification pass ${SITE.buildDate}<br/>
      Tracking ID <span class="mono">${esc(SITE.trackingId)}</span> \u00b7 <span class="chip chip-warn">unverified</span>
    </div>
  </div>
</header>`;
}

export function nav(out, activeKey) {
  return `<nav class="nav" aria-label="Primary">
  <div class="nav-inner">
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <div class="nav-links" id="nav-links">
      ${NAV.map(
        (n) =>
          `<a href="${link(out, n.href)}"${n.key === activeKey ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
      ).join('\n      ')}
    </div>
  </div>
</nav>`;
}

/** Dashboard surfaces, listed in full in the footer so none is orphaned. */
export function footer(out, dashSurfaces) {
  const r = root(out);
  const groups = [
    {
      h: 'Read',
      items: [
        ['Front page', 'index.html'],
        ['Products', 'products/index.html'],
        ['Guides', 'guides/index.html'],
        ['Clusters & seasons', 'clusters/index.html'],
        ['Compare', 'reviews/index.html'],
        ['Executive summary', 'executive-summary.html'],
      ],
    },
    {
      h: 'Trust',
      items: [
        ['Flagged for Review', 'flagged/index.html'],
        ['Verification method', 'methodology/index.html'],
        ['Source register', 'methodology/sources.html'],
        ['Compliance hub', 'compliance/index.html'],
        ['Disclosure', 'compliance/disclosure.html'],
        ['About & authorship', 'about/index.html'],
      ],
    },
    {
      h: 'Dashboard',
      items: dashSurfaces.map((s) => [s.navLabel || s.title, `dashboard/${s.slug}.html`]),
    },
    {
      h: 'Machine-readable',
      items: [
        ['sitemap.xml', 'sitemap.xml'],
        ['RSS feed', 'feed.xml'],
        ['robots.txt', 'robots.txt'],
        ['Product register JSON', 'data/products.json'],
        ['Flag register JSON', 'data/flags.json'],
        ['Campaign ledger JSON', 'data/campaign-ledger.json'],
        ['Repository', SITE.repo],
      ],
    },
  ];

  return `<footer class="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      ${groups
        .map(
          (g) => `<div>
        <h4>${esc(g.h)}</h4>
        <ul>
          ${g.items
            .map(([label, href]) => {
              const isExt = /^https?:/.test(href);
              return `<li>${
                isExt
                  ? outbound(href, esc(label), 'source')
                  : `<a href="${link(out, href)}">${esc(label)}</a>`
              }</li>`;
            })
            .join('\n          ')}
        </ul>
      </div>`
        )
        .join('\n      ')}
    </div>

    <div class="footer-disclosure">
      <p><strong>${esc(AMAZON_DISCLOSURE)}</strong></p>
      <p class="small">
        This site participates in the Amazon Associates programme. Every outbound product-intent link is
        marked <code class="inline">rel="sponsored"</code>. Affiliate attribution is
        <strong>not currently active</strong>: no published link carries a tracking tag, because the
        tagged Special Links have not yet been validated in Associates Central.
        See <a href="${link(out, 'flagged/index.html')}">Flagged for Review</a> (F-01, F-15).
      </p>
    </div>

    <div class="footer-legal">
      <p>${esc(AMAZON_CONTENT_DISCLAIMER)}</p>
      <p>${esc(AMAZON_PRICE_DISCLAIMER)}</p>
      <p>
        Amazon, the Amazon logo, Amazon\u2019s Choice and ASIN are trademarks of Amazon.com, Inc. or its
        affiliates, used here for identification only. Product names and listing titles are reproduced
        as observed on amazon.com for the purpose of identification. No Amazon product imagery is
        displayed on this site \u2014 see flag F-09 for the licensing reason.
      </p>
      <p>
        This site sets no cookies, loads no third-party scripts and sends no data to any tracker.
        Its own analytics are first-party, aggregate and cookieless \u2014
        see <a href="${link(out, 'compliance/privacy.html')}">privacy</a>.
      </p>
      <p>
        \u00a9 ${SITE.buildDate.slice(0, 4)} ${esc(SITE.name)}. Built ${SITE.buildDate}.
        Source and verification history: <a href="${SITE.repo}" rel="noopener noreferrer">${SITE.repo}</a>.
      </p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ */
/* Shared block renderer (guides, dashboard surfaces, static pages)     */
/* ------------------------------------------------------------------ */

export function renderTable(t, { compact = false, caption = null } = {}) {
  const cap = caption ? `<caption>${esc(caption)}</caption>` : '';
  // A row may be either an array of cell values or a pre-rendered <tr> string.
  // Both are supported so callers can build complex cells inline.
  const body = t.rows
    .map((r) => {
      if (typeof r === 'string') return r;
      return `<tr>${r
        .map((c, i) => `<td${t.numCols && t.numCols.includes(i) ? ' class="num"' : ''}>${c}</td>`)
        .join('')}</tr>`;
    })
    .join('\n');
  return `<div class="tablewrap"><table class="${compact ? 'compact' : ''}">
${cap}<thead><tr>${t.head.map((h, i) => `<th${t.numCols && t.numCols.includes(i) ? ' class="num"' : ''} scope="col">${h}</th>`).join('')}</tr></thead>
<tbody>${body}</tbody>
</table></div>${t.note ? `<p class="table-note">${t.note}</p>` : ''}`;
}

export function renderBlocks(blocks, out) {
  return blocks
    .map((b) => {
      let html = '';
      if (b.h1) html += `<h1>${b.h1}</h1>`;
      if (b.h2) html += `<h2>${b.h2}</h2>`;
      if (b.h3) html += `<h3>${b.h3}</h3>`;
      if (b.kicker) html += `<p class="kicker">${esc(b.kicker)}</p>`;
      if (b.p) {
        const arr = Array.isArray(b.p) ? b.p : [b.p];
        html += arr.map((x) => `<p>${x}</p>`).join('\n');
      }
      if (b.lede) html += `<p class="lede">${b.lede}</p>`;
      if (b.list) {
        const tag = b.ordered ? 'ol' : 'ul';
        html += `<${tag} class="tight">${b.list.map((i) => `<li>${i}</li>`).join('')}</${tag}>`;
      }
      if (b.checklist) {
        html += `<ul class="checklist">${b.checklist.map((i) => `<li>${i}</li>`).join('')}</ul>`;
      }
      if (b.table) html += renderTable(b.table, { compact: b.compact, caption: b.caption });
      if (b.metrics) {
        html += `<div class="metrics">${b.metrics
          .map(
            (m) => `<div class="metric${m.value === null ? ' metric-blank' : ''}">
      <div class="metric-label">${esc(m.label)}</div>
      <div class="metric-value">${m.value === null ? '<span class="unverified">UNVERIFIED</span>' : esc(m.value)}</div>
      ${m.sub ? `<div class="metric-sub">${m.sub}</div>` : ''}
    </div>`
          )
          .join('')}</div>`;
      }
      if (b.quote) {
        html += `<blockquote class="pull">\u201c${b.quote.text}\u201d<cite>\u2014 ${b.quote.attribution}${
          b.quote.sourceIds ? ' ' + cites(b.quote.sourceIds) : ''
        }</cite></blockquote>`;
      }
      if (b.observation) {
        html += `<div class="callout callout-info">
      <div class="callout-title">Observed \u00b7 point-in-time record</div>
      <p class="small">${b.observation.text} ${cites(b.observation.sourceIds)}</p>
    </div>`;
      }
      if (b.callout) {
        const kind = b.callout.kind ? ` callout-${b.callout.kind}` : '';
        html += `<div class="callout${kind}">
      ${b.callout.title ? `<div class="callout-title">${esc(b.callout.title)}</div>` : ''}
      ${(Array.isArray(b.callout.text) ? b.callout.text : [b.callout.text])
        .map((t) => `<p class="small">${t}</p>`)
        .join('')}
      ${b.callout.sourceIds ? `<p class="small">${cites(b.callout.sourceIds)}</p>` : ''}
    </div>`;
      }
      if (b.gate) {
        html += `<div class="callout callout-gate">
      <div class="callout-title">\u26a0 Human gate \u2014 not automatable</div>
      <p class="small">${b.gate.text}</p>
      ${b.gate.action ? `<p class="small"><strong>Required action:</strong> ${b.gate.action}</p>` : ''}
      ${b.gate.flag ? `<p class="small"><a href="${link(out, 'flagged/index.html')}#${esc(b.gate.flag)}">Flag ${esc(b.gate.flag)}</a></p>` : ''}
    </div>`;
      }
      if (b.html) html += b.html;
      if (b.note) html += `<p class="table-note">${b.note}</p>`;
      return html;
    })
    .join('\n');
}

/* ------------------------------------------------------------------ */
/* Full page                                                           */
/* ------------------------------------------------------------------ */

export function page({
  out,
  title,
  description,
  activeKey,
  body,
  dashSurfaces,
  canonical = null,
  extraHead = '',
  bodyClass = '',
  jsonLd = null,
  showToc = false,
}) {
  const r = root(out);
  const canon = canonical || SITE.base + out;
  const fullTitle = title === SITE.name ? title : `${title} \u00b7 ${SITE.name}`;

  return `<!DOCTYPE html>
<html lang="${SITE.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canon)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="generator" content="DIYHOME3 static build ${SITE.buildDate}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canon)}">
<meta name="twitter:card" content="summary">
<link rel="alternate" type="application/rss+xml" title="${esc(SITE.name)} \u2014 guides" href="${r}feed.xml">
<link rel="sitemap" type="application/xml" href="${r}sitemap.xml">
<link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}assets/css/site.css">
<script>window.DIYHOME3 = { page: ${JSON.stringify(out)}, siteBase: ${JSON.stringify(SITE.base)}, endpoint: null };</script>
<script src="${r}assets/js/analytics.js" defer></script>
<script src="${r}assets/js/ui.js" defer></script>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
${extraHead}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${masthead(out)}
${disclosureStrip(out)}
${nav(out, activeKey)}
<main id="main" class="wrap${bodyClass.includes('narrow') ? ' wrap-narrow' : ''}">
${body}
</main>
${footer(out, dashSurfaces)}
</body>
</html>
`;
}

export function breadcrumbs(out, trail) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${trail
    .map(([label, href]) =>
      href
        ? `<li><a href="${link(out, href)}">${esc(label)}</a></li>`
        : `<li aria-current="page">${esc(label)}</li>`
    )
    .join('')}</ol></nav>`;
}

export function sourceTableRows() {
  return sources.map(
    (s) =>
      `<tr>
  <td class="mono nowrap">${esc(s.id)}</td>
  <td>${s.official ? '<span class="verified">Official</span>' : '<span class="unverified">Third party</span>'}</td>
  <td>${esc(s.owner)}</td>
  <td>${outbound(s.url, esc(s.title), 'source')}</td>
  <td class="nowrap">${esc(s.docDate)}</td>
  <td class="nowrap">${esc(s.checked)}</td>
</tr>`
  );
}
