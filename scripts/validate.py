"""Build gates: local links, anchors, disclosure, evidence references, feed and sitemap."""
import json, re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'dist';D=ROOT/'site/data'
OFFICIAL=('amazon.com','ftc.gov','google.com','github.com')

def product_errors(p):
 errors=[]
 if p.get('special_link'):
  for k in ['intended_asin','official_listing_url','confirmation_date','confirmation_source','associates_destination_confirmed','tracking_report_confirmed','policy_reviewed_at','destination_test_source','tracking_report_source']:
   if not p.get(k):errors.append(f'{p["id"]}: purchase link missing {k}')
  asin=p.get('intended_asin') or ''
  if not re.fullmatch('[A-Z0-9]{10}',asin):errors.append('Intended ASIN must be a confirmed 10-character identifier')
  u=urlsplit(p['special_link'])
  if u.scheme!='https' or u.hostname!='www.amazon.com' or u.path!='/dp/'+asin or parse_qs(u.query).get('tag')!=['shopnow047c-20']:errors.append('Special Link must match the confirmed ASIN and selected tracking ID')
  if p.get('official_listing_url')!='https://www.amazon.com/dp/'+asin:errors.append('Official listing must match intended ASIN')
 return errors
class Parse(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.canonical=[];self.disclosures=0;self.row=None;self.rows=[];self.row_data=False;self.jsonld=[];self.in_json=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id'in a:self.ids.add(a['id'])
  if tag=='tr':self.row=[];self.row_data=False
  if tag=='td':self.row_data=True
  if tag=='a' and self.row is not None:self.row.append(a.get('href',''))
  if tag in ['a','link','script','img']:
   target=a.get('href') or a.get('src')
   if target:self.links.append((tag,target,a))
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True
 def handle_endtag(self,tag):
  if tag=='tr' and self.row is not None:self.rows.append((self.row,self.row_data));self.row=None
  if tag=='script':self.in_json=False
 def handle_data(self,data):
  if 'As an Amazon Associate I earn from qualifying purchases.' in data:self.disclosures+=1
  if self.in_json:self.jsonld.append(json.loads(data))

def check():
 errors=[];pages={}
 sources={s['id']:s for s in json.loads((D/'sources.json').read_text())}
 for p in json.loads((D/'products.json').read_text()):
  errors.extend(product_errors(p))
  if p['source'] not in sources:errors.append('Unknown product source')
 for g in json.loads((D/'guides.json').read_text()):
  if any(i not in sources for i in g['sources']):errors.append('Unknown guide source')
 for path in OUT.rglob('*.html'):
  parser=Parse();parser.feed(path.read_text());pages[path.resolve()]=parser
  if parser.disclosures<2:errors.append(f'{path.name}: missing repeated disclosure')
  expected=json.loads((D/'config.json').read_text())['base_url']+'/'+str(path.relative_to(OUT))
  if parser.canonical!=[expected]:errors.append(f'{path.name}: canonical mismatch')
  if not parser.jsonld:errors.append(f'{path.name}: no structured metadata')
  # Header rows have no links. All non-empty data rows must have official source references.
  for row,is_data in parser.rows:
   if is_data and not any(any((urlsplit(u).hostname or '').endswith('.'+host) or (urlsplit(u).hostname or '')==host for host in OFFICIAL) for u in row):errors.append(f'{path.name}: table row lacks official link')
 for path,parser in pages.items():
  for tag,target,a in parser.links:
   u=urlsplit(target)
   if u.scheme in ['https','http']:
    if (u.hostname=='link.amazon' or (u.hostname=='www.amazon.com' and '/dp/' in u.path)) and tag=='a' and 'sponsored' not in a.get('rel','').split():errors.append(f'{path.name}: unsponsored product link')
    continue
   if u.scheme:errors.append(f'{path.name}: unexpected scheme {target}');continue
   dest=(path.parent/unquote(u.path)).resolve() if u.path else path
   if not dest.is_relative_to(OUT.resolve()) or not dest.exists():errors.append(f'{path.name}: broken link {target}');continue
   if u.fragment and dest in pages and unquote(u.fragment) not in pages[dest].ids:errors.append(f'{path.name}: missing fragment {target}')
 feed=ET.parse(OUT/'feed.xml');guides=json.loads((D/'guides.json').read_text())
 if len(feed.findall('./channel/item'))!=len(guides):errors.append('RSS does not include every guide')
 sitemap=ET.parse(OUT/'sitemap.xml');locations=[x.text for x in sitemap.findall('.//{*}loc')]
 for g in guides:
  if not any(loc.endswith('/guides/'+g['slug']+'.html') for loc in locations):errors.append('Guide missing from sitemap')
 if errors:raise AssertionError('\n'.join(errors))
 print(f'PASS: {len(pages)} pages, local destinations/fragments, repeated disclosures, sponsored links, source references, sitemap and {len(guides)} RSS entries')
if __name__=='__main__':check()
