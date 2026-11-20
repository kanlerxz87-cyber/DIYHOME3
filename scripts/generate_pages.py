#!/usr/bin/env python3
"""Generate the static site in docs/ from data/products.csv + data/sources.csv.
Run: python3 scripts/generate_pages.py  (stdlib only; deterministic output)."""
import csv, html, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")
BASE = "https://kanlerxz87-cyber.github.io/DIYHOME3/"
DATE = "2026-11-20"

def read_csv(p):
    with open(os.path.join(ROOT, p), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

PRODUCTS = read_csv("data/products.csv")
SOURCES = read_csv("data/sources.csv")
SRC = {s["source_id"]: s for s in SOURCES}

SHORT = {
    "P-01": "Art3d Smoothing Tool Kit for Peel &amp; Stick Wallpaper",
    "P-02": "Paper Towel Holder, Under-Cabinet (Matte Black)",
    "P-03": "ORDORA Pots &amp; Pans Organizer, Under-Cabinet 8-Tier",
}
CAT = {"P-01": ("wallpaper-tools", "Wallpaper tools"), "P-02": ("kitchen-storage", "Kitchen storage &amp; organization"), "P-03": ("kitchen-storage", "Kitchen storage &amp; organization")}

def header(prefix, title, desc, path, page_type="page"):
    canonical = BASE + path
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · DIY Home Upgrades</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{title} · DIY Home Upgrades">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website"><meta property="og:url" content="{canonical}">
<link rel="alternate" type="application/rss+xml" title="DIY Home Upgrades — new guides" href="{BASE}feed.xml">
<link rel="stylesheet" href="{prefix}assets/style.css">
<script>window.DIY_ANALYTICS_ENDPOINT="";</script>
</head><body data-page-type="{page_type}">
<header class="masthead"><div class="wrap">
<a class="brand" href="{prefix}index.html">DIY HOME <span>upgrades</span></a>
<span class="tagline">Small fixes, honestly labelled.</span>
<nav class="primary" aria-label="Primary">
<a href="{prefix}index.html">Shop</a>
<a href="{prefix}categories/kitchen-storage.html">Kitchen storage</a>
<a href="{prefix}categories/wallpaper-tools.html">Wallpaper tools</a>
<a href="{prefix}guides.html">Guides</a>
<details><summary>Records ▾</summary><div class="menu">
<a href="{prefix}dashboard.html">Dashboard</a>
<a href="{prefix}register.html">Product register</a>
<a href="{prefix}flagged.html">Flagged for review</a>
<a href="{prefix}analytics.html">Analytics &amp; events</a>
<a href="{prefix}ledger.html">Campaign ledger</a>
<a href="{prefix}sources.html">Sources</a>
<a href="{prefix}executive-summary.html">Executive summary</a>
</div></details></nav></div></header>
<div class="disclosure" role="note"><div class="wrap"><strong>Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Every outbound product link on this site is marked <strong>Sponsored</strong>. Until a link is marked “Validated” in the <a href="{prefix}register.html">product register</a>, it carries no Associates tracking tag and earns us nothing. Prices and ratings are not published here — check Amazon for current terms. <a href="{prefix}disclosure-privacy.html">Full disclosure &amp; privacy</a></div></div>
<main class="wrap">
"""

def footer(prefix):
    return f"""
</main><footer><div class="wrap">
<div class="cols">
<div><strong>Shop by category</strong><ul>
<li><a href="{prefix}categories/kitchen-storage.html">Kitchen storage &amp; organization</a></li>
<li><a href="{prefix}categories/wallpaper-tools.html">Wallpaper tools</a></li>
<li><a href="{prefix}index.html">All products</a></li></ul></div>
<div><strong>Guides</strong><ul>
<li><a href="{prefix}guides.html">All buying-question guides</a></li>
<li><a href="{prefix}feed.xml">New guides by RSS</a></li>
<li><a href="{prefix}sitemap.xml">Sitemap</a></li></ul></div>
<div><strong>Records &amp; dashboards</strong><ul>
<li><a href="{prefix}dashboard.html">Dashboard</a></li>
<li><a href="{prefix}register.html">Product-intent register</a></li>
<li><a href="{prefix}flagged.html">Flagged for review</a></li>
<li><a href="{prefix}analytics.html">Analytics &amp; the five events</a></li>
<li><a href="{prefix}ledger.html">Campaign ledger</a></li>
<li><a href="{prefix}sources.html">Sources</a></li>
<li><a href="{prefix}executive-summary.html">Executive summary</a></li></ul></div>
<div><strong>About this publication</strong><ul>
<li><a href="{prefix}disclosure-privacy.html">Disclosure &amp; privacy</a></li>
<li><a href="{prefix}guides.html#cadence">Publishing cadence</a></li></ul>
<p class="small">Edited by the DIY Home Upgrades editorial desk. No product is recommended as “best” — we publish what can be checked, and flag the rest.</p></div>
</div>
<p class="small"><strong>Disclosure, repeated:</strong> As an Amazon Associate I earn from qualifying purchases. Outbound product links are marked Sponsored and use <code>rel="sponsored nofollow noopener"</code>. DIY Home Upgrades is a participant in the Amazon Services LLC Associates Program. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. · Tracking ID on file (owner-supplied, pending validation): <code>shopnow047c-20</code> · Last updated {DATE}</p>
</div></footer>
<script src="{prefix}assets/app.js"></script></body></html>
"""

def card(p, prefix):
    cid, clabel = CAT[p["record_id"]]
    return f"""<article class="card" data-product-id="{p['record_id']}" data-category="{cid}">
<span class="chip">{clabel}</span>
<h3>{SHORT[p['record_id']]}</h3>
<p class="meta">Record <b>{p['record_id']}</b> · Observed listing (2026-11-20): “{html.escape(p['observed_listing_title_2026_11_20'])}”</p>
<p class="meta">Price: <b>— not published</b> (check Amazon) · Rating: <b>— not published</b></p>
<p class="meta">Affiliate link status: <b>Not validated</b> — no Special Link is published for this product yet.</p>
<div class="spacer"></div>
<span class="sponsored">Sponsored · external link to Amazon</span>
<a class="btn secondary" data-outbound="product" data-product-id="{p['record_id']}" rel="sponsored nofollow noopener" target="_blank" href="{html.escape(p['observed_redirect_url_2026_11_20'])}">Check the observed listing on Amazon ↗</a>
<a href="{prefix}register.html#{p['record_id']}">See the verification record →</a>
</article>"""

def write(path, content):
    full = os.path.join(DOCS, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f: f.write(content)
    print("wrote", path)

cards_all = "\n".join(card(p, "") for p in PRODUCTS)
kitchen = "\n".join(card(p, "../") for p in PRODUCTS if CAT[p["record_id"]][0] == "kitchen-storage")
wall = "\n".join(card(p, "../") for p in PRODUCTS if CAT[p["record_id"]][0] == "wallpaper-tools")

# ---------- index ----------
write("index.html", header("", "Shop small home upgrades", "A small, honestly labelled shop for DIY home upgrades: kitchen storage and wallpaper tools, each with a public verification record.", "index.html") + f"""
<section class="hero" style="margin:0 -18px;padding:0 18px"><div class="wrap" style="padding-left:0;padding-right:0">
<div><p class="chip">New publication · First records published {DATE}</p>
<h1>Small home upgrades, sold straight.</h1>
<p class="lede">Three submitted products, organised by what they do — not by what we could earn. Every card shows exactly what has been checked on Amazon, what is still unverified, and whether an affiliate link is live (right now: none are).</p>
<p class="byline">By the DIY Home Upgrades editorial desk · {DATE} · <a href="guides.html">Read the buying-question guides</a> · <a href="feed.xml">Follow by RSS</a></p>
<p><a class="btn" href="#shop">Browse the products</a> <a class="btn secondary" href="flagged.html">What’s flagged &amp; why</a></p></div>
<div><img src="assets/hero.jpg" alt="A tidy DIY workspace with wallpaper tools and kitchen-storage parts on a wooden counter"></div>
</div></section>
<h2 id="shop">Shop the first records</h2>
<form class="searchbar" id="shop-tools"><input id="product-search" type="search" placeholder="Search products…" aria-label="Search products">
<select id="category-filter" aria-label="Filter by category"><option value="">All categories</option><option value="kitchen-storage">Kitchen storage</option><option value="wallpaper-tools">Wallpaper tools</option></select></form>
<div class="grid">{cards_all}</div>
<div class="notice"><strong>Why is there no “Buy with our affiliate link” button yet?</strong> The links supplied for these products could not be confirmed as validated Special Links for tracking ID <code>shopnow047c-20</code>. Rather than guess, each card links — marked Sponsored — to the Amazon listing the supplied link resolved to on {DATE}, with no tracking tag attached. The gate, and what would unlock it, is written down in the <a href="register.html">product register</a> and <a href="flagged.html">Flagged for Review</a>.</div>
<h2>Start with a question, not a ranking</h2>
<p>We publish question-shaped guides (no “best ever” lists, no invented scores). Newest first — each one is added to the <a href="sitemap.xml">sitemap</a> and <a href="feed.xml">RSS feed</a> on publication.</p>
<ul>
<li><a href="guides/wallpaper-smoothing-kit-questions.html">What should you compare before buying a peel-and-stick wallpaper smoothing kit?</a></li>
<li><a href="guides/under-cabinet-storage-questions.html">Under-cabinet storage: what should you measure before you buy?</a></li>
<li><a href="guides/no-hype-air-fryer-capacity-checklist.html">A no-hype checklist for comparing air fryer capacity</a></li>
<li><a href="guides.html">All guides →</a></li></ul>
""" + footer(""))

# ---------- categories ----------
write("categories/kitchen-storage.html", header("../", "Kitchen storage & organization", "Under-cabinet kitchen storage records: paper towel holder and pots-and-pans organizer, with verification status.", "categories/kitchen-storage.html") + f"""
<h1>Kitchen storage &amp; organization</h1>
<p class="lede">Two of the three submitted products resolved (on {DATE}) to under-cabinet kitchen-storage listings. “Resolved to” is an observation, not a confirmed product intent — see each record.</p>
<div class="grid">{kitchen}</div>
<p><a href="../guides/under-cabinet-storage-questions.html">Guide: what to measure before you buy under-cabinet storage →</a></p>
""" + footer("../"))

write("categories/wallpaper-tools.html", header("../", "Wallpaper tools", "Peel-and-stick wallpaper smoothing tool record, with verification status.", "categories/wallpaper-tools.html") + f"""
<h1>Wallpaper tools</h1>
<p class="lede">One submitted product resolved (on {DATE}) to a peel-and-stick wallpaper smoothing-tool listing. That is an observation, not a confirmed product intent — see the record.</p>
<div class="grid">{wall}</div>
<p><a href="../guides/wallpaper-smoothing-kit-questions.html">Guide: what to compare before buying a smoothing kit →</a></p>
""" + footer("../"))

# ---------- guides ----------
GUIDES = [
 ("basket-or-oven-style-air-fryer", "Basket or oven-style air fryer: what should you compare?",
  "A working-title editorial hypothesis from the project brief. No air-fryer product is in the register, so this guide compares formats — it recommends no product.",
  ["Which format fits the food you actually cook most weeks — single items that benefit from shaking/tossing, or trays cooked in layers?",
   "What usable capacity does the manufacturer state, and is it stated the same way across the models you are comparing? Check the official listing or manual for each model.",
   "How much counter depth and door/basket clearance does each format need in your kitchen? Measure before comparing features.",
   "Which parts are removable for washing, per the official care instructions?",
   "What does the warranty cover, per the manufacturer's own page?"]),
 ("no-hype-air-fryer-capacity-checklist", "A no-hype checklist for comparing air fryer capacity",
  "A working-title editorial hypothesis from the project brief. Capacity numbers are not compared here — this is the checklist to apply on official listings.",
  ["Is capacity quoted in litres/quarts, and is it basket volume or usable cooking volume? Note the definition each brand uses.",
   "What is the largest single item you cook (whole chicken, pizza, tray)? Compare its dimensions to the stated interior dimensions.",
   "Does the stated capacity assume one layer? If you regularly cook for more people, how would a second batch change your cooking time?",
   "Are accessories (racks, trays) included or sold separately, per the official 'what's in the box' list?"]),
 ("cleanup-counter-space-air-fryer", "How to assess cleanup and counter-space trade-offs",
  "A working-title editorial hypothesis from the project brief. Questions only — verify every answer on the official listing or manual.",
  ["Which parts are dishwasher-safe according to the manufacturer — basket, tray, door, filters?",
   "How far must the unit sit from the wall for ventilation, per the manual? Add that to the counter depth you measured.",
   "Where will it live between uses? Measure the cupboard or counter spot before comparing models.",
   "How are grease and crumbs removed from the interior, per the official care guide?"]),
 ("questions-before-multi-function-appliance", "Questions to ask before buying a multi-function kitchen appliance",
  "A working-title editorial hypothesis from the project brief. A pre-purchase question list, not a product ranking.",
  ["Which functions would replace an appliance you already own — and which would duplicate it?",
   "What is the stated footprint and weight, and can your counter and storage take both?",
   "Which attachments are included, and which cost extra, per the official listing?",
   "What do the warranty and returns terms actually say on the retailer's or manufacturer's page?"]),
 ("wallpaper-smoothing-kit-questions", "What should you compare before buying a peel-and-stick wallpaper smoothing kit?",
  "Written for the wallpaper-tools category in the register. No kit is scored or ranked; confirm each answer on the official Amazon listing before buying.",
  ["What tools are actually in the kit, per the listing's contents description — smoother, blade, measuring aids?",
   "What surfaces does the seller say the tools are intended for, and are yours among them?",
   "Are replacement blades or edges available, per the listing?",
   "What do the seller's own instructions say about use on fresh paint or delicate vinyl? If the listing is silent, treat that as unanswered — not as a yes."]),
 ("under-cabinet-storage-questions", "Under-cabinet storage: what should you measure before you buy?",
  "Written for the kitchen-storage category in the register (paper towel holder; pots-and-pans organizer). Measure first; confirm mounting details on the official listing.",
  ["What is the under-cabinet depth and the clearance to your worktop or hob? Compare with the product's stated dimensions on the listing.",
   "Does the product mount by adhesive, screws, or both — per the listing — and is your cabinet material suitable for that method?",
   "For organisers: what is the stated shelf/rack height range, and do your tallest pans fit it?",
   "What weight does the seller state it holds, if any? If no figure is stated on the listing, record it as unverified rather than assuming."]),
]
guide_items = ""
for slug, title, intro, qs in GUIDES:
    lis = "\n".join(f"<li>{q}</li>" for q in qs)
    write(f"guides/{slug}.html", header("../", title, intro, f"guides/{slug}.html", "guide") + f"""
<h1>{title}</h1>
<p class="byline">By the DIY Home Upgrades editorial desk · Published {DATE} · Guide (no products are ranked in this article)</p>
<p class="lede">{intro}</p>
<h2>Questions to work through</h2>
<ol class="checklist">{lis}</ol>
<div class="notice"><strong>How to use this guide:</strong> answer each question from the official Amazon listing or the manufacturer's own documentation, and write the answer down with its source. If a listing does not state a figure, leave it blank and treat it as unverified — exactly as we do in the <a href="../register.html">product register</a>. Any Amazon link you follow from this site is marked Sponsored; see the disclosure strip at the top of this page.</div>
<p><a href="../guides.html">← All guides</a> · <a href="../index.html">Shop the records</a></p>
""" + footer("../"))
    guide_items += f'<li><a href="guides/{slug}.html">{title}</a><br><span class="small">{intro}</span></li>\n'

write("guides.html", header("", "Buying-question guides", "Question-shaped guides with checklists. No rankings, no invented scores; each answer is checked against an official listing.", "guides.html") + f"""
<h1>Guides: start with the question</h1>
<p class="lede">Each guide is a set of buyer questions and what to check on an official listing — nothing is scored, and no product is called “best”.</p>
<ul>{guide_items}</ul>
<h2 id="cadence">Publishing cadence &amp; how the next topic is chosen</h2>
<ul class="checklist">
<li><strong>Cadence:</strong> one new or revised guide most Tuesdays, starting 2026-11-24. Each is added to the <a href="sitemap.xml">sitemap</a> and <a href="feed.xml">RSS feed</a> the same day (feed is live now — subscribe to follow).</li>
<li><strong>Topic choice:</strong> from measured queries, not instinct — once the Search Console property for this site is verified by the site owner (pending, see <a href="flagged.html">Flagged F-08</a>), topics are picked from real impressions/queries; until then, topics come only from the register's categories.</li>
<li><strong>Measurement first:</strong> the five analytics events (see <a href="analytics.html">Analytics</a>) were switched on before any further guides are written, so the next topic can be chosen from observed guide views and outbound clicks.</li>
<li><strong>Reader capture:</strong> RSS (above) — no email list is operated and no email address is collected by this site.</li>
</ul>
""" + footer(""))

# ---------- register ----------
rows = ""
for p in PRODUCTS:
    rows += f"""<tr id="{p['record_id']}"><td><b>{p['record_id']}</b></td>
<td><code>{html.escape(p['submitted_url_verbatim'])}</code><br><span class="small">Token <code>{html.escape(p['submitted_token'])}</code> ({p['submitted_token_length']} characters) · submitted ×{p['submission_count_in_brief']} · {html.escape(p['submitted_provenance'])}</span></td>
<td>{html.escape(p['intended_asin']) or '— <b>blank (unverified)</b>'}</td>
<td>{html.escape(p['intended_official_listing_url']) or '— blank'}</td>
<td>{html.escape(p['intended_confirmation_date']) or '— blank'}</td>
<td>{html.escape(p['intended_confirmation_source']) or '— blank'}</td>
<td><b>{html.escape(p['product_intent_status'])}</b></td>
<td><a data-outbound="product" data-product-id="{p['record_id']}" rel="sponsored nofollow noopener" target="_blank" href="{html.escape(p['observed_redirect_url_2026_11_20'])}">{html.escape(p['observed_redirect_url_2026_11_20'])}</a><br><span class="small">ASIN in observed URL: <code>{html.escape(p['observed_asin_in_redirect'])}</code> · Title: “{html.escape(p['observed_listing_title_2026_11_20'])}” · Category: {html.escape(p['observed_category_path_2026_11_20'])} · Observed {p['observed_date']} by: {html.escape(p['observed_method'])}</span></td>
<td><b>{html.escape(p['special_link_status'])}</b><br><span class="small">Tracking ID on file: <code>{html.escape(p['tracking_id_owner_supplied'])}</code> (owner-supplied, not yet verified in Associates Central)</span></td>
<td>{html.escape(p['gate_action'])}<br><span class="small">Flags: {html.escape(p['flag_ids'])}</span></td></tr>\n"""
write("register.html", header("", "Product-intent confirmation record", "For each submitted link: the intended ASIN, official listing, confirmation date and source — kept strictly separate from observed redirect targets.", "register.html") + f"""
<h1>Product-intent confirmation record</h1>
<p class="lede">The gate in table form. <strong>Intended</strong> fields (what the owner meant to submit) are never filled from <strong>observed</strong> fields (where a link happened to resolve). An ASIN is a 10-character identifier assigned by Amazon (source <a href="sources.html">S-05</a>); every submitted token is 9 characters, so no intended ASIN can be recorded yet.</p>
<div class="tablewrap"><table><thead><tr><th>Record</th><th>Submitted link (verbatim, not published as a clickable ad)</th><th>Intended ASIN</th><th>Intended official listing URL</th><th>Confirmation date</th><th>Confirmation source</th><th>Product-intent status</th><th>Observed redirect target (separate field — observed {DATE})</th><th>Special Link status</th><th>Gate action</th></tr></thead><tbody>{rows}</tbody></table></div>
<div class="notice"><strong>How a record gets validated (one link per product, before scaling):</strong> (1) owner confirms the intended ASIN and official listing; (2) a Special Link is generated for that listing inside the enrolled Associates workflow for tracking ID <code>shopnow047c-20</code> (Special Links must use the assigned ID/tag — source S-01/S-02); (3) that single link is clicked and its destination and the Associates tracking report are checked; only then is <code>special_link_url</code> filled and the shop card switched to a tracked CTA. Hand-built tagged URLs are not published. Machine-readable record: <a href="https://github.com/kanlerxz87-cyber/DIYHOME3/blob/main/data/products.csv"><code>data/products.csv</code></a>.</div>
<p class="small">Prices and ratings are intentionally blank site-wide: they change, could not be confirmed as stable facts from an official source, and are therefore never published (source rule: if a value can't be confirmed, leave it blank and flag it — see F-06).</p>
""" + footer(""))

# ---------- flagged ----------
FLAGS = [
 ("F-01","Submitted tokens are 9 characters; an ASIN is 10","Every supplied token (<code>B0hmGG4m2</code>, <code>B03QDuGdo</code>, <code>B0hpD2JGQ</code>) is 9 characters. Amazon defines an ASIN as a 10-character alphanumeric identifier. No token is therefore recorded as an ASIN.","S-05","Owner to supply the intended 10-character ASIN per product, or confirm it from the official listing."),
 ("F-02","Intended product ≠ observed redirect (fields kept separate)","Following each short link on 2026-11-20 landed on an amazon.com/dp page whose ASIN differs from the submitted token. That destination is recorded only as an observation. It is <b>not</b> treated as the intended product, and the fields are not merged.","S-09–S-11","Owner confirms intended ASIN + official listing URL per record (P-01…P-03) in the register."),
 ("F-03","Duplicate submission","<code>https://link.amazon/B03QDuGdo</code> was submitted twice in the brief. Deduplicated to one record (P-02) with submission count 2.","— (project brief)","None — handled; kept visible for provenance."),
 ("F-04","Short-link compliance status is unresolved","The brief's supplied short links are <b>not</b> claimed to be invalid. Amazon's Participation Requirements require that link use not make it unclear the reader is linking to Amazon; whether these links meet that test inside the enrolled Associates workflow is unresolved. They are not published as clickable outbound ads on this site.","S-02","Test one link per product in the enrolled Associates workflow; record destination + tracking report before any scaling."),
 ("F-05","Tracking ID not yet verified in Associates Central","<code>shopnow047c-20</code> is owner-supplied. This session has no Associates Central access, so the ID, account enrolment and site approval could not be verified. No tagged (Special) link is published until then.","S-01, S-02","Owner verifies the ID in Associates Central and generates one Special Link per confirmed product."),
 ("F-06","Prices and ratings left blank","Prices/ratings seen while observing listings are volatile and could not be confirmed as stable facts; per the verification rule they are left blank site-wide and readers are sent to Amazon for current terms.","S-03 (substantiation principle)","No action; revisit only with a dated, sourced price-check process."),
 ("F-07","Suggested air-fryer guide topics vs DIY products","The brief's suggested working titles concern air fryers; the submitted products are kitchen-storage and wallpaper tools. The four titles are published as question checklists with no product claims, and are labelled working-title hypotheses — no popularity, search-volume or superiority claim is made.","— (project brief)","Owner confirms whether air-fryer content is in scope or the titles were illustrative."),
 ("F-08","Accounts this session cannot access","Search Console verification, Associates reports, any Product Advertising API credentials and a hosted analytics endpoint all need the owner's accounts/keys. Until supplied: analytics counts locally in the visitor's browser only, the campaign ledger stays empty, and no trending/commission/conversion claim is made anywhere on this site.","S-07, S-08","Owner: verify Search Console, supply endpoint URL (analytics/), and export Associates reports to fill the ledger."),
 ("F-09","No product images published","Product images are Amazon Program Content; none are republished here. Cards are typographic until images are obtained through the Associates workflow for validated products. The hero image is a generic workspace photograph, not a product depiction.","S-02","Add Program Content images only for validated records."),
]
flag_rows = "\n".join(f'<tr id="{i}"><td><b>{i}</b></td><td><b>{t}</b><br>{d}</td><td>{s}</td><td>{a}</td></tr>' for i,t,d,s,a in FLAGS)
write("flagged.html", header("", "Flagged for review", "Every irregularity and unverified item, with its official source and the action that would clear it. Nothing here blocks publication.", "flagged.html") + f"""
<h1>Flagged for review</h1>
<p class="lede">Published, labelled, and non-blocking. If a value could not be confirmed from an official source it was left blank and listed here — never filled in by inference.</p>
<div class="tablewrap"><table><thead><tr><th>ID</th><th>Irregularity / unverified item</th><th>Source</th><th>Action to clear</th></tr></thead><tbody>{flag_rows}</tbody></table></div>
<p class="small">Source IDs refer to the <a href="sources.html">source register</a>. The machine-readable flags also live on each row of <code>data/products.csv</code>.</p>
""" + footer(""))

# ---------- sources ----------
src_rows = "\n".join(f'<tr><td><b>{s["source_id"]}</b></td><td>{html.escape(s["claim_supported"])}</td><td>{html.escape(s["official_source_title"])}</td><td>{html.escape(s["publisher"])}</td><td><a rel="sponsored nofollow noopener" target="_blank" href="{html.escape(s["url"])}">{html.escape(s["url"])}</a></td><td>{s["accessed_date"]}</td><td>{html.escape(s["verification_note"])}</td></tr>' for s in SOURCES)
write("sources.html", header("", "Sources — official register", "Every factual claim on this site traces to an official source listed here, with the access date.", "sources.html") + f"""
<h1>Sources</h1>
<p class="lede">Line-by-line rule: every table row on this site carries a source link to an official site. If a value could not be confirmed from an official source, it was left blank and flagged — never inferred.</p>
<div class="tablewrap"><table><thead><tr><th>ID</th><th>Claim supported</th><th>Official source</th><th>Publisher</th><th>URL (official)</th><th>Accessed</th><th>Verification note</th></tr></thead><tbody>{src_rows}</tbody></table></div>
<p class="small">Machine-readable: <code>data/sources.csv</code> in the repository. Product-listing sources S-09…S-11 support <em>observed</em> titles/categories only, stamped {DATE}; redirect destinations can change.</p>
""" + footer(""))

# ---------- dashboard ----------
write("dashboard.html", header("", "Dashboard", "A simple dashboard: counts derived only from the register, the five analytics events, and the empty campaign ledger.", "dashboard.html") + f"""
<h1>Dashboard</h1>
<p class="lede">Everything below is counted from the published records — no estimates, no forecasts, no conversion scores.</p>
<div class="kpis">
<div class="kpi"><div class="n">4</div>Links submitted in brief</div>
<div class="kpi"><div class="n">3</div>Unique submitted links</div>
<div class="kpi"><div class="n">1</div>Duplicate submission (F-03)</div>
<div class="kpi"><div class="n">0</div>Intended ASINs confirmed</div>
<div class="kpi"><div class="n">0</div>Validated Special Links</div>
<div class="kpi"><div class="n">6</div>Guides published</div>
<div class="kpi"><div class="n">5</div>Analytics events defined</div>
<div class="kpi"><div class="n">0</div>Campaign-ledger rows</div></div>
<h2>The machinery, and its gate</h2>
<ol class="checklist">
<li><strong>Collect</strong> — submitted links land in <code>data/products.csv</code> verbatim, with provenance. Duplicates are counted, not silently dropped.</li>
<li><strong>Validate (automated)</strong> — <code>scripts/validate_register.py</code> checks token/ASIN shape (10 characters, source S-05), duplicate tokens, and that intended and observed fields are never merged. It cannot confirm intent.</li>
<li><strong>Confirm (human gate)</strong> — the owner confirms intended ASIN + official listing, then generates one Special Link per product in the enrolled Associates workflow (S-01/S-02). Automation stops here on purpose.</li>
<li><strong>Test</strong> — that one link's destination and the Associates tracking report are checked before any scaling. Only then does a shop card get a tracked CTA, still marked Sponsored with <code>rel="sponsored"</code> (S-06).</li>
<li><strong>Publish</strong> — pages are generated from the CSVs (<code>scripts/generate_pages.py</code>), feeds rebuilt (<code>scripts/build_feeds.py</code>), and <code>scripts/check_site.py</code> fails the build if any page lacks the disclosure strip, any outbound product link lacks <code>rel="sponsored"</code>, or any internal link is broken.</li>
<li><strong>Measure</strong> — five privacy-preserving events (see <a href="analytics.html">Analytics</a>) and an empty-until-sourced <a href="ledger.html">campaign ledger</a>. No “AI trending score”, commission forecast or revenue claim exists anywhere in this system, because no official data source for one is connected (F-08).</li>
</ol>
<h2>What “AI-powered research” honestly means here</h2>
<p>Research assistance (collecting submitted links, drafting question checklists, generating pages and checks) is automated. Product selection, pricing, review, competition and commission claims are <strong>not</strong> automated and are not asserted: they require the owner's Associates/PA-API access and reports. Anything else would be invention, so the gate above is the product.</p>
""" + footer(""))

# ---------- analytics ----------
write("analytics.html", header("", "Analytics & the five events", "Privacy-preserving outbound-click counting and a self-hosted analytics endpoint. The five events, defined.", "analytics.html") + f"""
<h1>Analytics &amp; the five events</h1>
<p class="lede">Click and conversion measurement was switched on before any further content was written. Conversion (orders) can only come from the owner's authorised Associates reports — it is never estimated here.</p>
<h2>The five defined events</h2>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Event</th><th>When it fires</th><th>Payload (complete)</th></tr></thead><tbody>
<tr><td>1</td><td><code>page_view</code></td><td>Any page on this site is viewed</td><td rowspan="5">Event name, page path, product record ID where relevant, ISO timestamp. No cookies, no IP storage, no fingerprint, no search-query text.</td></tr>
<tr><td>2</td><td><code>product_view</code></td><td>A product card becomes visible</td></tr>
<tr><td>3</td><td><code>guide_view</code></td><td>A guide page is viewed</td></tr>
<tr><td>4</td><td><code>outbound_click</code></td><td>A Sponsored outbound product link is clicked</td></tr>
<tr><td>5</td><td><code>search_submit</code></td><td>The shop search/filter is used (query text is not stored)</td></tr>
</tbody></table></div>
<h2>Where events go</h2>
<p><strong>Now:</strong> no hosted endpoint is configured (<code>DIY_ANALYTICS_ENDPOINT=""</code>), so events are counted only in your own browser (<code>localStorage</code>) and shown below on this device. Nothing leaves the browser.</p>
<p><strong>To go live:</strong> deploy the self-hosted endpoint stub in the repository (<code>analytics/worker.js</code> — a Cloudflare-Worker-style receiver that appends one JSON line per event, storing no IP), then set <code>window.DIY_ANALYTICS_ENDPOINT</code> in <code>docs/assets/app.js</code> to its URL. Instructions: <code>analytics/README.md</code>.</p>
<h2>This browser's local counts</h2>
<div class="tablewrap"><table><thead><tr><th>Event</th><th>Count (this browser)</th></tr></thead><tbody id="local-event-counts"></tbody></table></div>
<p class="small">Reported orders belong in the <a href="ledger.html">campaign ledger</a> and may only be entered from authorised first-party (Associates) reports, with a dated provenance note.</p>
""" + footer(""))

# ---------- ledger ----------
write("ledger.html", header("", "Campaign ledger", "An empty but well-defined campaign ledger. Rows are added only from authorised first-party reports, with provenance.", "ledger.html") + f"""
<h1>Campaign ledger</h1>
<p class="lede">Empty on purpose. A row may be added only when it comes from an authorised first-party report (the owner's Associates reports), with its provenance dated. No conversion score or revenue forecast is presented here or anywhere on this site.</p>
<div class="tablewrap"><table><thead><tr><th>timestamp (ISO 8601)</th><th>source</th><th>channel</th><th>eligible sessions</th><th>clicks</th><th>reported orders</th><th>provenance note</th></tr></thead><tbody>
<tr><td colspan="7"><em>No rows yet — no authorised first-party report has been supplied (Flagged F-08). Machine-readable template: <code>data/campaign-ledger.csv</code>.</em></td></tr>
</tbody></table></div>
<h2>Field definitions</h2>
<ul class="checklist">
<li><strong>timestamp</strong> — when the reported period ends / the report was obtained (ISO 8601).</li>
<li><strong>source</strong> — the exact report the numbers came from (e.g. “Associates Central earnings report export”).</li>
<li><strong>channel</strong> — where the clicks originated (this site, a named guide, RSS).</li>
<li><strong>eligible sessions / clicks / reported orders</strong> — copied from that report only; never modelled or interpolated.</li>
<li><strong>provenance note</strong> — who exported it, when, and where the export is filed.</li></ul>
""" + footer(""))

# ---------- disclosure/privacy ----------
write("disclosure-privacy.html", header("", "Disclosure & privacy", "The Associates statement, what Sponsored means here, and what this site does and does not collect.", "disclosure-privacy.html") + f"""
<h1>Disclosure &amp; privacy</h1>
<h2>Affiliate disclosure</h2>
<p><strong>As an Amazon Associate I earn from qualifying purchases.</strong> That statement (required wording, source S-01) appears in the disclosure strip under the masthead of every page of this site and again in every footer, before and after any product link, in line with FTC guidance that affiliate relationships be disclosed clearly and conspicuously (S-03, S-04).</p>
<ul class="checklist">
<li>Every outbound product link is labelled <strong>Sponsored</strong> and carries <code>rel="sponsored nofollow noopener"</code> (S-06).</li>
<li>Until a product's Special Link is validated in the <a href="register.html">register</a>, its Amazon link carries no tracking tag and earns us nothing — the card says so.</li>
<li>We do not publish prices, ratings, “best” rankings, or review scores we cannot confirm from an official source.</li>
<li>Submitted short links are not published as clickable ads, because their destination would not be clear to the reader before clicking (S-02, F-04).</li>
</ul>
<h2>Privacy</h2>
<ul class="checklist">
<li>No accounts, no email collection, no cookies set by this site, no advertising trackers.</li>
<li>Measurement uses the five events defined on the <a href="analytics.html">Analytics</a> page. With no endpoint configured, counts stay in your browser's local storage and never leave your device; the payload never includes IP addresses, fingerprints, or search-query text.</li>
<li>Amazon may use cookies on its own site after you follow an outbound link; that is governed by Amazon's privacy notice, not this page.</li>
<li>Publishing-workflow gate: no page ships unless <code>scripts/check_site.py</code> confirms the disclosure strip, the Sponsored attributes, and unbroken internal links.</li>
</ul>
<p class="small">Questions about a record: see the <a href="register.html">register</a> and <a href="flagged.html">Flagged for Review</a> — every entry links its official source.</p>
""" + footer(""))

# ---------- executive summary ----------
write("executive-summary.html", header("", "Executive summary", "What was built, what was verified, what is flagged, and what only the account owner can unlock.", "executive-summary.html") + f"""
<h1>Executive summary</h1>
<p class="byline">DIY Home Upgrades · {DATE} · Tracking ID on file: <code>shopnow047c-20</code> (owner-supplied)</p>
<h2>What you have now</h2>
<ul class="checklist">
<li><strong>A publication, not an audit dump:</strong> a shop front page leading with the three submitted products by category (kitchen storage; wallpaper tools), six question-shaped guides, RSS feed, sitemap, and one canonical host for search engines.</li>
<li><strong>Disclosure above the fold, everywhere:</strong> the Associates statement sits in a strip under the masthead on every page and repeats in every footer; every outbound product link is labelled Sponsored with <code>rel="sponsored"</code>.</li>
<li><strong>A gate, not a guess:</strong> the product-intent register keeps intended ASIN/listing/date/source strictly separate from observed redirect targets. Zero affiliate CTAs are live, because zero Special Links could be validated without Associates Central access.</li>
<li><strong>Measurement before more content:</strong> five privacy-preserving events (page view, product view, guide view, outbound click, site search) count locally now and POST to a self-hosted endpoint when the owner deploys the supplied stub. The campaign ledger is defined and empty until an authorised Associates report exists.</li>
<li><strong>Automation where it's safe:</strong> scripts validate the register, generate the pages and feeds, and fail the build on a missing disclosure, an un-sponsored outbound link, or a broken internal link. Intent confirmation, Special-Link generation and conversion reporting stay human/account-gated by design.</li>
</ul>
<h2>What was verified (official sources only)</h2>
<p>Associates statement wording and Special-Link rules (Amazon, S-01/S-02); FTC clear-and-conspicuous disclosure (S-03/S-04); the 10-character ASIN definition (Amazon Developer, S-05); <code>rel="sponsored"</code> (Google, S-06); observed listing titles/categories (Amazon, S-09…S-11, {DATE}). Full register: <a href="sources.html">Sources</a>.</p>
<h2>What needs your review (non-blocking, published)</h2>
<p>Nine items on <a href="flagged.html">Flagged for Review</a> — chiefly: confirm each product's intended ASIN and official listing (all submitted tokens are 9 characters, not ASINs), verify tracking ID <code>shopnow047c-20</code> in Associates Central and test one Special Link per product, and connect Search Console / an analytics endpoint when ready. No price, rating, trend, commission or revenue claim appears anywhere on the site.</p>
<h2>The one-paragraph version</h2>
<p>DIY Home Upgrades is live as an honestly labelled shop: products first, questions before rankings, disclosures before links, and a public record of everything that could not be verified — so the next step is a five-minute confirmation in Associates Central, not a rewrite.</p>
""" + footer(""))

write("404.html", header("", "Page not found", "That page does not exist on DIY Home Upgrades.", "404.html") + """
<h1>Page not found</h1><p>Try the <a href="index.html">shop front page</a>, the <a href="guides.html">guides</a>, or the <a href="sitemap.xml">sitemap</a>.</p>
""" + footer(""))

print("done")
