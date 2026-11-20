"""Additional non-destructive checks for the single integrated root publication.
Run: python release_checks/e10111d6/check.py
No external requests, generated output, or changes to shared source files.
"""
import json
import subprocess
import sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[2]
OFFICIAL={'amazon.com','affiliate-program.amazon.com','www.amazon.com','www.ftc.gov','docs.github.com','developers.google.com','www.fsis.usda.gov','instantpot.com','www.art3d.com'}

class Rows(HTMLParser):
 def __init__(self):super().__init__();self.rows=[];self.row=None;self.is_data=False
 def handle_starttag(self,tag,attrs):
  if tag=='tr':self.row=[];self.is_data=False
  if tag=='td':self.is_data=True
  if tag=='a' and self.row is not None:self.row.append(dict(attrs).get('href',''))
 def handle_endtag(self,tag):
  if tag=='tr' and self.row is not None:
   if self.is_data:self.rows.append(self.row)
   self.row=None

def audit_rows(text):
 p=Rows();p.feed(text)
 return [i for i,row in enumerate(p.rows,1) if not any(urlsplit(u).scheme=='https' and urlsplit(u).hostname in OFFICIAL for u in row)]

def check():
 # Tracked artifacts only: private/ignored local tooling is not a publication page.
 files=subprocess.check_output(['git','ls-files','-z','*.html'],cwd=ROOT).decode().split('\0')
 checked=0
 for name in filter(None,files):
  text=(ROOT/name).read_text();checked+=1
  missing=audit_rows(text)
  if missing:raise AssertionError(f'{name}: data rows without official source links {missing}')
  if 'data-analytics="on"' in text:raise AssertionError(f'{name}: Pages analytics unexpectedly active')
 data=json.loads((ROOT/'data/products.json').read_text())
 assert data['tracking_id_requested']=='shopnow047c-20'
 assert not data['special_links'],'Purchase links must remain gated in this release'
 rows=data['submissions'];assert len(rows)==4
 assert len({r['submitted_url'] for r in rows})==3
 assert rows[2]['duplicate_of']==2
 for row in rows:
  assert all(row[k] is None for k in ['intended_asin','official_listing_url','confirmed_on','confirmation_source'])
  assert row['observed_redirect_target']=='https://www.amazon.com/dp/'+row['observed_asin']
  assert row['observed_on']=='2026-11-20'
 print(f'PASS: {checked} tracked HTML pages; every data-table row has an official HTTPS reference; public analytics off; 4 inputs / 3 unique; intent blank; observed ASINs separate; purchase links gated.')
 return checked
if __name__=='__main__':check()
