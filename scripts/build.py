#!/usr/bin/env python3
"""Render dependency-free Pages output and fail closed on commerce evidence."""
import argparse
import json
import re
import sys
from datetime import date, datetime, timezone
from email.utils import format_datetime
from html import escape as e
from pathlib import Path
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'source'))
from content import DATE, TRACKING_ID, DISCLOSURE, SOURCES, PRODUCTS, SUBMISSIONS, SPECIAL_LINKS, GUIDES

PAGES_URL = 'https://kanlerxz87-cyber.github.io/DIYHOME3/'
BRAND = 'DIY Home Upgrades'
DESK = {'executive-summary/': 'Executive summary', 'product-register/': 'Product register', 'flagged-for-review/': 'Flagged for Review', 'measurement/': 'Measurement', 'sources/': 'Source library'}
SHOP = {'': 'Home', 'shop/': 'Shop', 'guides/': 'Guides'}
GUIDE = {g['slug']: g for g in GUIDES}
LEGACY = {
    'about.html': ('About the home edit', 'executive-summary/'),
    'disclosure.html': ('Disclosure and publishing standards', 'flagged-for-review/'),
    'products/': ('Shop the home edit', 'shop/'),
    'products/wallpaper-tools.html': ('Wallpaper tools', 'guides/wallpaper-tools/'),
    'products/kitchen-organization.html': ('Kitchen organization', 'shop/'),
    'products/art3d-smoothing-tool-kit.html': ('Wallpaper smoothing kits', 'guides/wallpaper-tools/'),
    'products/niffgaff-paper-towel-holder.html': ('Under-cabinet paper towel holders', 'guides/paper-towel-holder/'),
    'products/ordora-pots-pans-organizer.html': ('Adjustable cookware racks', 'guides/cookware-racks/'),
    'guides/peel-and-stick-wallpaper-tools.html': ('Peel-and-stick wallpaper tools', 'guides/wallpaper-tools/'),
    'guides/under-cabinet-paper-towel-holder.html': ('Under-cabinet paper towel holders', 'guides/paper-towel-holder/'),
    'guides/pots-pans-organizer-cabinet-fit.html': ('Cookware rack cabinet fit', 'guides/cookware-racks/'),
    'verify/': ('Editorial desk', 'sources/'),
    'verify/link-register.html': ('Link register', 'product-register/'),
    'verify/campaign-ledger.html': ('Campaign ledger', 'measurement/'),
    'verify/flagged.html': ('Flagged for Review', 'flagged-for-review/'),
}
ARROW = '<span aria-hidden="true">↗</span>'
ICON = '<svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor"/><path d="M9 8v5m0-8v1" stroke="currentColor" stroke-width="1.5"/></svg>'


def validate(profile):
    product_ids = {p['id'] for p in PRODUCTS}
    assert len(product_ids) == len(PRODUCTS) and len(GUIDE) == len(GUIDES)
    assert all(x['product'] in product_ids and x['observation_source'] in SOURCES and x['observed_redirect_target'] == SOURCES[x['observation_source']][1] for x in SUBMISSIONS)
    assert all(s in SOURCES for g in GUIDES for _, _, s in g['sections'])
    assert not (set(SPECIAL_LINKS) - product_ids)
    if profile == 'pages' and SPECIAL_LINKS:
        raise ValueError('Commercial links cannot be built in the Pages profile.')
    for product_id, approved in SPECIAL_LINKS.items():
        rows = [r for r in SUBMISSIONS if r['product'] == product_id]
        url = urlsplit(approved['url'])
        asin = url.path.removeprefix('/dp/')
        required = ('intended_asin', 'official_listing_url', 'confirmed_on', 'confirmation_source')
        if not all(all(r.get(k) for k in required) and r['intended_asin'] == asin and r['official_listing_url'] == f'https://www.amazon.com/dp/{asin}' and r['confirmation_source'] in SOURCES and date.fromisoformat(r['confirmed_on']) <= date.today() for r in rows):
            raise ValueError(f'Missing or inconsistent intent evidence for {product_id}')
        if url.scheme != 'https' or url.netloc != 'www.amazon.com' or not re.fullmatch(r'[A-Z0-9]{10}', asin) or not url.path.startswith('/dp/') or parse_qs(url.query).get('tag') != [TRACKING_ID]:
            raise ValueError(f'Unsafe or mismatched Special Link for {product_id}')
        if not all(approved.get(k) for k in ('destination_checked_on', 'report_checked_on', 'report_reference', 'policy_reviewed_on', 'reviewer')) or any(date.fromisoformat(approved[k]) > date.today() for k in ('destination_checked_on', 'report_checked_on', 'policy_reviewed_on')):
            raise ValueError(f'Missing release sign-off for {product_id}')


def src(key):
    name, url = SOURCES[key]
    rel = ' rel="sponsored noopener noreferrer"' if key in {'S10','S11','S12','S13','S14'} else ''
    return f'<a href="{e(url, quote=True)}"{rel}>{e(name)}</a>'


def table(headers, rows):
    return '<div class="table-wrap" role="region" aria-label="Scrollable reference table" tabindex="0"><table><thead><tr>' + ''.join(f'<th scope="col">{e(h)}</th>' for h in headers) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{cell}</td>' for cell in row) + '</tr>' for row in rows) + '</tbody></table></div>'


def head(kicker, title, lead):
    return f'<div class="page-head"><p class="eyebrow line">{e(kicker)}</p><h1>{e(title)}</h1><p class="lead">{e(lead)}</p></div>'


def output(path, text):
    out = ROOT / path
    out.parent.mkdir(parents=True, exist_ok=True)
    if CHECK:
        if not out.exists() or out.read_bytes() != text.encode():
            raise SystemExit(f'Stale output: {path}; run python scripts/build.py')
    else:
        out.write_text(text, encoding='utf-8')


def route(path, title, description, body, *, guide='', hidden=False, notfound=False):
    pre = CANON if notfound else '../' * path.count('/')
    home = pre or './'
    key = guide or ('archive' if path in LEGACY else path.strip('/') or 'home')
    brand = f'<a class="brand" href="{home}"><span class="mark"><img src="{pre}assets/mark.svg" alt="" width="39" height="39"></span><span>DIY Home Upgrades<small>The practical home edit</small></span></a>'
    nav = ''.join(f'<a href="{pre+p if p else home}"'+ (' aria-current="page"' if p == path else '') + f'>{t}</a>' for p,t in SHOP.items())
    desktop = ''.join(f'<a href="{pre+p}">{t}</a>' for p,t in DESK.items())
    foot = ''.join(f'<a href="{pre+p}">{t}</a>' for p,t in {**DESK, 'feed.xml': 'RSS', 'privacy/': 'Privacy'}.items())
    canonical = '' if notfound else f'<link rel="canonical" href="{CANON+path}">'
    if hidden: canonical += '<meta name="robots" content="noindex,follow">'
    schema = ''
    if guide:
        published_on = GUIDE[guide].get('published_on', DATE)
        schema = '<script type="application/ld+json">'+json.dumps({'@context': 'https://schema.org','@type': 'Article','headline': title,'datePublished': published_on,'author': {'@type': 'Organization','name': BRAND},'mainEntityOfPage': CANON+path}).replace('<','\\u003c')+'</script>'
    output('404.html' if notfound else path if path.endswith('.html') else path + 'index.html', f'''<!doctype html>
<html lang="en" data-page="{key}"{' data-guide="'+guide+'"' if guide else ''}{' data-analytics="on"' if PROFILE == 'editorial' else ''}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title if path == '' and not notfound else title+' | '+BRAND)}</title><meta name="description" content="{e(description,quote=True)}">{canonical}
<meta property="og:title" content="{e(title,quote=True)}"><meta property="og:description" content="{e(description,quote=True)}"><meta property="og:image" content="{CANON}assets/hero.jpg"><link rel="alternate" type="application/rss+xml" title="{BRAND}" href="{pre}feed.xml"><link rel="icon" href="{pre}assets/mark.svg"><link rel="stylesheet" href="{pre}assets/site.css">{schema}<script defer src="{pre}assets/analytics.js"></script></head>
<body><a class="skip" href="#main">Skip to content</a><header class="mast"><div class="wrap mast-inner">{brand}<nav class="main-nav" aria-label="Main navigation">{nav}<details class="desk"><summary>Editorial desk</summary><div class="desk-menu">{desktop}</div></details></nav></div></header>
<aside class="disclosure" aria-label="Affiliate disclosure">{ICON}{DISCLOSURE}</aside>
<main id="main">{body}</main>
<footer class="footer"><div class="wrap"><div class="footer-top">{brand}<nav class="footer-links" aria-label="Footer navigation">{foot}</nav></div><p>{DISCLOSURE} · Independent editorial project.</p></div></footer></body></html>
''')
    if not hidden:
        INDEX.append(path)
    TARGETS['page_view'].append(key)
    if guide:
        TARGETS['guide_view'].append(guide)


def cta(product):
    active = SPECIAL_LINKS.get(product['id'])
    if not active: return ''
    pid = product['id']
    TARGETS['outbound_click'].append(pid)
    TARGETS['reported_order'].append(pid)
    return f'<div class="release-cta"><a class="button" href="{e(active["url"],quote=True)}" rel="sponsored noopener noreferrer" data-event="outbound_click" data-target="{pid}">See on Amazon · paid link {ARROW}</a></div>'


def cards(pre):
    return '<div class="grid">' + ''.join(f'''<article class="card"><a class="card-media" href="{pre}guides/{p['guide']}/"><img src="{pre}assets/{p['image']}.jpg" alt="{e(p['alt'])}" width="580" height="340" loading="lazy"><span class="badge">Project guide</span></a><div class="card-copy"><p class="label">{e(p['category'])}</p><h3><a href="{pre}guides/{p['guide']}/">{e(p['title'])}</a></h3><p>{e(p['blurb'])}</p>{cta(p) or f'<a class="text-link" href="{pre}guides/{p["guide"]}/">What to look for {ARROW}</a>'}</div></article>''' for p in PRODUCTS) + '</div>'


def guide_list(collection, pre):
    return '<div class="guide-list">' + ''.join(f'<article class="guide-row"><p class="label">{e(g["category"])}</p><div><h3><a href="{pre}{g["slug"]}/">{e(g["title"])}</a></h3><p>{e(g["intro"])}</p></div><a class="text-link" href="{pre}{g["slug"]}/" aria-label="Read: {e(g["title"],quote=True)}">{ARROW}</a></article>' for g in collection) + '</div>'


def render():
    route('', BRAND+' | Small changes, better spaces', 'Practical buying guides for wallpaper tools, kitchen organization, cookware storage and countertop appliances.', f'''
<div class="wrap"><section class="hero" aria-labelledby="headline"><div class="hero-copy"><p class="eyebrow line">The home edit &nbsp; / &nbsp; No. 01</p><h1 id="headline">Small changes,<br><em>better spaces.</em></h1><p>Practical upgrades and honest buying guides for a home that works a little better every day.</p><div class="actions"><a class="button" href="shop/">Explore the shop <span aria-hidden="true">→</span></a><a class="text-link" href="guides/">Read buying guides {ARROW}</a></div></div><div class="hero-visual"><img fetchpriority="high" src="assets/hero.jpg" alt="Warm oak kitchen countertop with ceramic vase, linen and cutting boards" width="768" height="540"><span class="photo-note">The everyday kitchen</span></div></section>
<section class="section" id="edits"><div class="section-head"><div><p class="eyebrow line">The shortlist</p><h2>Shop the home edit</h2><p>Three small projects that earn their space.</p></div><a class="text-link" href="shop/">Explore all categories <span aria-hidden="true">→</span></a></div>{cards('')}<p class="caption">Category illustrations, not product photos. Buying links are withheld until validated.</p></section>
<section class="section reading"><div class="section-head"><div><p class="eyebrow line">Late autumn / Countertop appliances</p><h2>Before you buy</h2><p>Kitchen questions worth answering before you make room on the counter.</p></div><a class="text-link" href="guides/">All buying guides <span aria-hidden="true">→</span></a></div>{guide_list(GUIDES[3:6], 'guides/')}</section>
<section class="feed-band"><div><h2>Follow the home edit</h2><p>Get new guides in your feed reader. No newsletter sign-up required.</p></div><a class="button" href="feed.xml" data-event="feed_click" data-target="rss">Get the RSS feed {ARROW}</a></section></div>''')
    route('shop/', 'Shop the home edit', 'Compare supplies for walls and finishes, kitchen organization and cookware storage.', '<div class="wrap">'+head('The shortlist','Shop the home edit','Start with the small upgrade you want to make. These guides show what to check before buying.')+cards('../')+'<p class="caption">Category illustrations, not product photos. Buying links are withheld until validated.</p><p class="release-cta"><a class="text-link" href="../product-register/">See listing observations and link status →</a></p></div>')
    route('guides/', 'Buying guides', 'Question-led buying guides for everyday DIY projects and countertop appliances.', '<div class="wrap">'+head('The reading room','Buying guides','Questions to ask before you buy, grouped by the room and the job.')+'<nav class="pill-nav" aria-label="Guide clusters"><a href="#home-projects">Small home projects</a><a href="#appliances">Countertop appliances</a></nav><h2 id="home-projects">Small home projects</h2>'+guide_list(GUIDES[:3],'')+'<div class="section"><h2 id="appliances">Countertop appliances</h2>'+guide_list(GUIDES[3:],'')+'</div></div>')
    for g in GUIDES:
        pic = next((p for p in PRODUCTS if p['guide']==g['slug']),None)
        picture = f'<img src="../../assets/{pic["image"]}.jpg" alt="{e(pic["alt"])}" width="800" height="340"><p class="caption">Illustration of the category, not the observed listing.</p>' if pic else ''
        paragraphs = ''.join(f'<section><h2>{e(h)}</h2><p>{e(text)}</p><div class="source-link">{src(source)}</div></section>' for h,text,source in g['sections'])
        related = [v for v in GUIDES if v['slug'] != g['slug'] and (v in GUIDES[:3]) == (g in GUIDES[:3])][:2]
        guide_date = date.fromisoformat(g.get('published_on', DATE))
        label_date = guide_date.strftime('%B') + f' {guide_date.day}, {guide_date.year}'
        route('guides/'+g['slug']+'/',g['title'],g['intro'],f'<article class="article">{head(g["category"],g["title"],g["intro"])}<p class="byline">By the DIY Home Upgrades editorial desk · <time datetime="{guide_date}">{label_date}</time> · Desk research, not hands-on testing</p>{picture}<div class="prose">{paragraphs}{cta(pic) if pic else ""}</div><div class="section reading"><h2>Keep reading</h2>{guide_list(related,"../")}</div></article>',guide=g['slug'])
    desk_pages()
    for old, (title, new) in LEGACY.items():
        pre = '../' * old.count('/')
        lead = 'This page has moved. The current edition no longer includes unvalidated affiliate offers or listing snapshots.'
        route(old, title, lead, '<div class="wrap">'+head('From the archive', title, lead)+f'<a class="button" href="{pre+new}">Open the current page {ARROW}</a></div>', hidden=True)


def desk_page(path, title, lead, body):
    route(path+'/',title,lead,'<div class="wrap">'+head('Editorial desk',title,lead)+body+'</div>',hidden=True)


def desk_pages():
    desk_page('executive-summary','Executive summary','Launch decision: publish the editorial project; hold the affiliate rollout until the evidence and hosting are in place.', table(('Area','Finding','Official source'),[
        ('Catalog','Four submissions, three unique links. The observations are wallpaper tools, a towel holder and a cookware rack; none confirms intended product identity.', ' · '.join(src(s) for s in ('S12','S13','S14'))),
        ('Affiliate release',f'Requested tracking ID: <code>{TRACKING_ID}</code>. Enrollment, tracking attribution and compliance of the supplied short links are unverified. No paid links are live.',src('S01')+' · '+src('S02')),
        ('Hosting','GitHub Pages carries the non-transactional editorial site only. Do not launch the affiliate business on Pages; migrate the public canonical to an eligible host before commercial release.',src('S04')),
        ('Research','The seven guides are editorial starting points, not rankings or tests. Price, reviews, commissions, search demand and competitive performance are not published without authorized evidence.',src('S03')+' · '+src('S08')),
        ('Publishing','Review possible guide topics every other Thursday, starting December 3, 2026. Publish only when evidence and review are ready. The sitemap and RSS update together from the guide register.',src('S06')),
        ('Measurement','The collector is implemented and tested locally; GitHub Pages does not run it. Search Console ownership and Amazon reporting have not been verified.',src('S08')+' · '+src('S02')),
        ('Automation','Implemented: deterministic register, disclosure, Special Link, event-schema and ledger gates, plus a query-report shortlist planner. Not implemented or live: AI product discovery or article generation, automated Amazon catalog/review/price collection, competition or conversion optimization, and autonomous publishing. The shortlist requires a first-party report supplied by an operator.', '<a href="https://github.com/kanlerxz87-cyber/DIYHOME3/blob/main/scripts/affiliate_pipeline.py">Project compliance pipeline</a> · <a href="https://github.com/kanlerxz87-cyber/DIYHOME3/blob/main/scripts/plan.py">Project query planner</a> · '+src('S16')),
        ('AI and Amazon data','Do not treat the requested AI platform as an operating capability. Amazon API access has account prerequisites, and Program Content is gated from AI use without required permission; no API credentials or approval are present in this repository.',src('S16')+' · '+src('S03')),
        ('Disclosure','The Associates statement appears under the masthead and in the footer. Any released Special Link also gets adjacent paid-link text and a sponsored attribute.',src('S24')+' · '+src('S07')+' · '+src('S05')),
    ])+'<p><a class="text-link" href="../flagged-for-review/">Open flagged items →</a></p>')
    details = []
    for r in SUBMISSIONS:
        val = lambda k: e(str(r[k])) if r[k] else ''
        details.append((str(r['row']), f'<code>{e(r["submitted_url"])}</code>',
                        f'<a href="{e(r["observed_redirect_target"])}" rel="sponsored noopener noreferrer">{e(r["observed_asin"])}</a><br>{r["observed_on"]}',
                        val('intended_asin'),val('official_listing_url'),val('confirmed_on'),
                        src(r['confirmation_source']) if r['confirmation_source'] else '',
                        ('Unverified intent; duplicate of #2' if r['duplicate_of'] else 'Unverified intent') if not r['confirmed_on'] else 'Intent confirmed', src(r['observation_source'])))
    desk_page('product-register','Product register','The observed destination is a dated Amazon listing snapshot, not a confirmation of what the submitter intended.',
        '<p class="notice">Submitted short links are preserved as text only. Observed targets are the final listing paths, with query strings removed. Prices, ratings, commission and availability are omitted.</p>'+table(('Row','Submitted URL','Observed redirect / date','Intended ASIN','Official listing URL','Confirmed on','Confirmation source','Status','Observation source'), details))
    desk_page('flagged-for-review','Flagged for Review','These open items do not block the editorial site. They do block unsupported claims, affiliate publishing or production measurement.',table(('Flag','What is known','Release gate','Official source'),[
        ('Intended products','Observed redirects show home-upgrade items, not the brief’s air-fryer hypotheses. The towel-holder URL was submitted twice.','Keep all four rows. Confirm intended ASIN and official URL separately.',src('S02')+' · '+src('S12')+' · '+src('S13')+' · '+src('S14')),
        ('Special Links','Format, enrollment and attribution for the requested tag remain unresolved; the short links are not declared invalid.','Generate one Special Link per confirmed product in Associates Central. Verify destination and report attribution before any scale-up. Do not make a self-purchase.',src('S01')+' · '+src('S02')+' · '+src('S03')),
        ('Commercial hosting','Pages is for the editorial release only.','Use hosting that permits the affiliate business before enabling shopping links.',src('S04')),
        ('Price, reviews and commission','No authorized product feeds or reports in this session; official fixed standard rates list Kitchen at 4.50% and Tools / Home Improvement at 3.00%, while Creators API requires Associates enrollment and at least 10 qualifying sales in 30 days.','Review current Creators API license, credentials, approvals, allowed data uses and display freshness; do not publish static prices/ratings, conversion scores or revenue forecasts, and do not send Program Content to AI without permission.',src('S03')+' · '+src('S15')+' · '+src('S16')),
        ('Listing & manufacturer discrepancies','Official pages disagree: Art3d A17999 lists 4.2 oz, Metal and 4 blades (no tape measure), whereas Amazon B08FKW9JRM lists 3.52 oz, Plastic, a tape measure, and both 4 and 5 blades in separate sections. Amazon B08DY9HRWD states up to 11 in cookware in its title vs 12 in in its bullets and links newer heavy-duty model B0BYYTQMTR. Amazon B0BSKQW2T2 omits model number, country of origin and date first available.','Leave unconfirmed fields blank; never merge conflicting specs or infer origin or hands-on test results.',src('S11')+' · '+src('S12')+' · '+src('S13')+' · '+src('S14')),
        ('SG-29 · Search Console','No verified property or query report.','Verify the canonical URL-prefix property, submit the sitemap and review the Performance report; no ranking or indexing guarantee.',src('S08')+' · '+src('S06')),
        ('Production analytics','No persistent approved deployment for the event service or enrolled report access.','Deploy the aggregate service and verify consent/privacy and log configuration before collection; ingest only authorized aggregate reports.',src('S04')+' · '+src('S02')),
    ]))
    events = [
        ('page_view','Page initialized; not a unique visitor or session.',src('S04')),
        ('guide_view','A guide initialized; also emits a page view.',src('S08')),
        ('outbound_click','A validated, marked product link was activated. No redirects or interception; not an Amazon-reported click.',src('S01')+' · '+src('S05')),
        ('feed_click','RSS button activated. Not a subscription or a feed open.',src('S06')),
        ('reported_order','Authorized aggregate order count from Associates reporting only; never browser-derived.',src('S02')),
    ]
    desk_page('measurement','Measurement','The self-hosted collector has five event types. The Pages edition does not send events or report conversions.',table(('Event','Definition','Official reference'),events)+
        '<h2>Campaign ledger</h2><p>No authorized observations loaded. Blank means no report, not zero.</p>'+table(('Timestamp (UTC)','Source / report reference','Channel','Eligible sessions','Clicks','Reported orders'),[( '', ' · '.join((src('S02'),src('S08'))),'','','','')])+
        '<div class="prose"><h2>What to publish next</h2><p>During the fortnightly editorial review, compare query and landing-page impressions and clicks in Search Console. Pick one question where a guide can add a useful answer. Compare equivalent periods and label small samples; avoid interpreting onsite counts as sales. Reconcile orders separately against the enrolled Tracking ID report.</p><p>No conversion score or revenue forecast is presented.</p></div>')
    labels = [('SG-27','Navigation labels: Shop, Guides and a single Editorial desk menu.','S08'),('SG-28','RSS ships and is discoverable in the masthead metadata and footer.','S06'),('SG-29','Search Console is pending verified ownership.','S08'),('SG-30','RSS is the reader follow option; no email address capture.','S06')]
    desk_page('sources','Source library','Official sources and a dated verification record. References support the specific claim alongside them, not assumptions about the products.',table(('Ref.','Publisher / document','Reviewed'),[(s,src(s),DATE) for s in SOURCES])+ '<h2>Publication checklist</h2>'+table(('Row','Disposition','Reference'),[(i,e(a),src(s)) for i,a,s in labels]))
    route('privacy/','Privacy','Event collection and privacy for the editorial release.', '<div class="wrap">'+head('Publication notes','Privacy','The GitHub Pages editorial release does not send custom analytics events or collect email addresses.')+'<div class="prose"><h2>RSS</h2><p>The feed can be read without signing up. Your feed reader may apply its own privacy terms.</p><h2>Optional first-party measurement</h2><p>On a configured self-hosted edition, the collector stores counts by UTC day, event type and fixed content ID. It does not store IP addresses, cookies, device IDs, user agents, referrers or full URLs. The browser honors Global Privacy Control and Do Not Track.</p><p>The static host may apply its own privacy practices. <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub General Privacy Statement</a>.</p></div></div>',hidden=True)
    route('404','Page not found','Return to the home edit or browse the buying guides.', '<div class="wrap">'+head('Not found','That page has moved','Try the home edit or look for another guide.')+f'<a class="button" href="{CANON}">Back to the home edit</a></div>',hidden=True,notfound=True)


def finish():
    urls = ''.join(f'  <url><loc>{e(CANON+p)}</loc></url>\n' for p in INDEX)
    output('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'</urlset>\n')
    items = ''
    for g in sorted(GUIDES, key=lambda g: g.get('published_on', DATE), reverse=True):
        link = e(CANON+'guides/'+g['slug']+'/')
        published = format_datetime(datetime.fromisoformat(g.get('published_on', DATE)).replace(tzinfo=timezone.utc))
        items += f'<item><title>{e(g["title"])}</title><link>{link}</link><guid>{link}</guid><description>{e(g["intro"]+" "+DISCLOSURE)}</description><pubDate>{published}</pubDate></item>\n'
    output('feed.xml', f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>{BRAND}</title><link>{CANON}</link><description>Practical buying guides for the everyday home. {DISCLOSURE}</description><atom:link href="{CANON}feed.xml" rel="self" type="application/rss+xml"/>\n{items}</channel></rss>\n')
    output('robots.txt',f'User-agent: *\nAllow: /\nSitemap: {CANON}sitemap.xml\n')
    output('.nojekyll','')
    output('data/products.json',json.dumps({'tracking_id_requested': TRACKING_ID, 'submissions': SUBMISSIONS, 'special_links': {}}, indent=2)+'\n')
    output('analytics/targets.json',json.dumps({k:sorted(set(v)) for k,v in TARGETS.items()},indent=2)+'\n')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    ap.add_argument('--profile', choices=('pages','editorial'), default='pages')
    ap.add_argument('--url', default=PAGES_URL)
    args = ap.parse_args()
    CHECK, PROFILE, CANON = args.check, args.profile, args.url
    parts = urlsplit(CANON)
    if parts.scheme != 'https' or not re.fullmatch(r'[a-zA-Z0-9.-]+(?::\d+)?', parts.netloc) or not re.fullmatch(r'/(?:[a-zA-Z0-9_-]+/)*',parts.path) or parts.query or parts.fragment or (PROFILE == 'editorial' and (parts.hostname.endswith('github.io') or parts.path != '/')) or (PROFILE == 'pages' and CANON != PAGES_URL):
        ap.error('Use the default Pages URL, or a non-Pages HTTPS origin ending in / for editorial.')
    INDEX = []
    TARGETS = {e: [] for e in ('page_view','guide_view','outbound_click','feed_click','reported_order')}
    TARGETS['feed_click'].append('rss')
    validate(PROFILE)
    render()
    finish()
