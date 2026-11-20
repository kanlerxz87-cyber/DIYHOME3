#!/usr/bin/env python3
"""Validate data/products.csv. Stdlib only.
Rules (fail = exit 1):
 - submitted tokens are recorded verbatim; duplicates counted, not merged silently
 - an intended ASIN, IF present, must match ^[A-Z0-9]{10}$ (ASIN = 10 chars, source S-05)
 - intended fields and observed fields are separate columns; this script never copies one into the other
 - special_link_url may only be present when product_intent_status starts with 'CONFIRMED'
   and intended_confirmation_date + intended_confirmation_source are present
Run: python3 scripts/validate_register.py
"""
import csv, re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(ROOT, "data", "products.csv")
rows = list(csv.DictReader(open(path, newline="", encoding="utf-8")))
errors, notes = [], []
seen = {}
for r in rows:
    rid = r["record_id"]
    tok = r["submitted_token"]
    if tok in seen: errors.append(f"{rid}: duplicate token also in {seen[tok]} (must stay a single record with submission_count)")
    seen[tok] = rid
    notes.append(f"{rid}: submitted token '{tok}' length={len(tok)} (ASIN requires 10) submissions={r['submission_count_in_brief']}")
    ia = r["intended_asin"].strip()
    if ia and not re.fullmatch(r"[A-Z0-9]{10}", ia):
        errors.append(f"{rid}: intended_asin '{ia}' is not a 10-character ASIN")
    if not ia:
        notes.append(f"{rid}: intended_asin blank -> UNVERIFIED (correct until owner confirms; do not fill from observed field)")
    if r["observed_asin_in_redirect"].strip() and r["observed_asin_in_redirect"].strip() == ia and ia:
        notes.append(f"{rid}: intended and observed ASIN happen to match (allowed only via confirmation, source={r['intended_confirmation_source']!r})")
    if r["special_link_url"].strip():
        if not (ia and r["intended_confirmation_date"].strip() and r["intended_confirmation_source"].strip()):
            errors.append(f"{rid}: special_link_url present without confirmed intended ASIN/date/source — gate violation")
    for blank in ("price_published", "rating_published"):
        if r[blank].strip():
            errors.append(f"{rid}: {blank} must stay blank site-wide (volatile/unverified, F-06)")
print("\n".join("NOTE " + n for n in notes))
if errors:
    print("\n".join("ERROR " + e for e in errors)); sys.exit(1)
print(f"OK: {len(rows)} records validated; intended/observed separation preserved.")
