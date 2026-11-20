#!/usr/bin/env python3
"""Site gate. Stdlib only. Fails (exit 1) if:
 - any HTML page lacks the disclosure strip (exact Associates sentence under masthead)
   or the repeated footer disclosure
 - any outbound Amazon product link lacks rel="sponsored" or data-outbound="product"
 - any internal href/src points at a missing file
 - any page lacks a canonical link on the single canonical host, or the RSS link
 - sitemap/feed/robots are missing or the sitemap lists a missing page
 - a price or rating figure is published for a product (must stay blank, F-06)
Run: python3 scripts/check_site.py
"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")
BASE = "https://kanlerxz87-cyber.github.io/DIYHOME3/"
SENTENCE = "As an Amazon Associate I earn from qualifying purchases"
errors = []
html_files = []
for dp, _, fns in os.walk(DOCS):
    for fn in fns:
        if fn.endswith(".html"): html_files.append(os.path.join(dp, fn))
for fp in sorted(html_files):
    rel = os.path.relpath(fp, DOCS)
    s = open(fp, encoding="utf-8").read()
    if s.count(SENTENCE) < 2: errors.append(f"{rel}: Associates sentence must appear in strip AND footer")
    if 'class="disclosure"' not in s: errors.append(f"{rel}: missing disclosure strip")
    if f'<link rel="canonical" href="{BASE}' not in s: errors.append(f"{rel}: missing/wrong canonical")
    if "feed.xml" not in s: errors.append(f"{rel}: missing RSS discovery link")
    for m in re.finditer(r'<a\b[^>]*href="(https://www\.amazon\.com/[^"]*)"[^>]*>', s):
        tag = m.group(0)
        if 'rel="sponsored' not in tag:
            errors.append(f"{rel}: Amazon outbound link without rel=sponsored: {m.group(1)[:80]}")
        # Shop/register product CTAs must also carry the click-measurement hook;
        # plain source citations on sources.html are exempt from the hook but never from rel=sponsored.
        if rel != "sources.html" and 'data-outbound="product"' not in tag:
            errors.append(f"{rel}: Amazon product link without outbound_click hook: {m.group(1)[:80]}")
    if re.search(r"(Price|Rating):\s*<b>\$|\b\d\.\d out of 5", s):
        errors.append(f"{rel}: a price/rating figure appears published (F-06: must stay blank)")
    for m in re.finditer(r'(?:href|src)="([^"#]+)"', s):
        u = m.group(1)
        if u.startswith(("http://", "https://", "mailto:")): continue
        target = os.path.normpath(os.path.join(os.path.dirname(fp), u))
        if not os.path.exists(target): errors.append(f"{rel}: broken internal link {u}")
for extra in ("sitemap.xml", "feed.xml", "robots.txt", ".nojekyll"):
    if not os.path.exists(os.path.join(DOCS, extra)): errors.append(f"missing docs/{extra}")
sm = open(os.path.join(DOCS, "sitemap.xml"), encoding="utf-8").read() if os.path.exists(os.path.join(DOCS, "sitemap.xml")) else ""
for loc in re.findall(r"<loc>([^<]+)</loc>", sm):
    p = loc.replace(BASE, "")
    if p and not os.path.exists(os.path.join(DOCS, p)): errors.append(f"sitemap lists missing page {p}")
if errors:
    print("\n".join("ERROR " + e for e in errors)); sys.exit(1)
print(f"OK: {len(html_files)} pages pass disclosure, sponsored-link, canonical, RSS and internal-link checks.")
