#!/usr/bin/env python3
"""Build docs/sitemap.xml, docs/feed.xml (RSS 2.0) and docs/robots.txt for the
single canonical host. Stdlib only. Run after generate_pages.py:
    python3 scripts/generate_pages.py && python3 scripts/build_feeds.py
"""
import os
from xml.sax.saxutils import escape
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")
BASE = "https://kanlerxz87-cyber.github.io/DIYHOME3/"
LASTMOD = "2026-11-20"
PAGES = [
    ("", "DIY Home Upgrades — shop", "Small home upgrades, honestly labelled: products by category, each with a public verification record."),
    ("categories/kitchen-storage.html", "Kitchen storage & organization", "Under-cabinet kitchen storage records with verification status."),
    ("categories/wallpaper-tools.html", "Wallpaper tools", "Peel-and-stick wallpaper tool records with verification status."),
    ("guides.html", "Buying-question guides", "Question-shaped guides and the publishing cadence."),
    ("guides/basket-or-oven-style-air-fryer.html", "Basket or oven-style air fryer: what should you compare?", "Format-comparison questions; no product recommended."),
    ("guides/no-hype-air-fryer-capacity-checklist.html", "A no-hype checklist for comparing air fryer capacity", "How to compare capacity claims on official listings."),
    ("guides/cleanup-counter-space-air-fryer.html", "How to assess cleanup and counter-space trade-offs", "Cleanup and counter-space questions to verify on official listings."),
    ("guides/questions-before-multi-function-appliance.html", "Questions to ask before buying a multi-function kitchen appliance", "A pre-purchase question list, not a ranking."),
    ("guides/wallpaper-smoothing-kit-questions.html", "What should you compare before buying a peel-and-stick wallpaper smoothing kit?", "Checklist for the wallpaper-tools category."),
    ("guides/under-cabinet-storage-questions.html", "Under-cabinet storage: what should you measure before you buy?", "Measure-first checklist for the kitchen-storage category."),
    ("register.html", "Product-intent confirmation record", "Intended vs observed product data, kept strictly separate."),
    ("flagged.html", "Flagged for review", "Every irregularity and unverified item, with sources."),
    ("sources.html", "Sources", "Official source register for every claim on the site."),
    ("dashboard.html", "Dashboard", "Counts derived only from the published records."),
    ("analytics.html", "Analytics & the five events", "Privacy-preserving measurement, defined."),
    ("ledger.html", "Campaign ledger", "Empty until an authorised first-party report exists."),
    ("disclosure-privacy.html", "Disclosure & privacy", "Associates statement and privacy practices."),
    ("executive-summary.html", "Executive summary", "What was built, verified, flagged, and what unlocks next."),
]
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path, _, _ in PAGES:
    sm.append(f"<url><loc>{BASE}{path}</loc><lastmod>{LASTMOD}</lastmod></url>")
sm.append("</urlset>")
open(os.path.join(DOCS, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")

items = "\n".join(
    f"<item><title>{escape(t)}</title><link>{BASE}{p}</link><guid>{BASE}{p}</guid>"
    f"<pubDate>Fri, 20 Nov 2026 09:00:00 GMT</pubDate><description>{escape(d)}</description></item>"
    for p, t, d in PAGES if p.startswith("guides/") or p == "guides.html")
rss = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>DIY Home Upgrades — new guides</title>
<link>{BASE}</link>
<description>Question-shaped buying guides and shop records. As an Amazon Associate I earn from qualifying purchases.</description>
<language>en</language><lastBuildDate>Fri, 20 Nov 2026 09:00:00 GMT</lastBuildDate>
{items}
</channel></rss>
"""
open(os.path.join(DOCS, "feed.xml"), "w", encoding="utf-8").write(rss)
open(os.path.join(DOCS, "robots.txt"), "w", encoding="utf-8").write(
    f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
print(f"sitemap: {len(PAGES)} URLs; feed + robots written")
