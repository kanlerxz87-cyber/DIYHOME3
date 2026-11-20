"""Source-bound editorial briefs and validated first-party report ingestion.
Not a model integration, trend detector, or revenue predictor.
"""
import argparse, json, hashlib, math
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'site/data'

def import_report(path,authorized=False):
 if not authorized:raise ValueError('Requires explicit authorized first-party report attestation')
 raw=Path(path).read_bytes();rows=json.loads(raw)
 if not isinstance(rows,list) or not rows:raise ValueError('Expected nonempty JSON list of report rows')
 schema=json.loads((D/'campaign-schema.json').read_text())
 normalized=[]
 for row in rows:
  if not isinstance(row,dict) or set(schema['required'])-set(row):raise ValueError('Missing required report fields')
  # Reject extra fields: no visitor data or silently invented performance fields.
  if set(row)!=set(schema['required']):raise ValueError('Unknown report fields')
  for k in ['timestamp','imported_at']:
   dt=datetime.fromisoformat(row[k].replace('Z','+00:00'))
   if dt.tzinfo is None:raise ValueError('Timestamp must include timezone')
   if dt>datetime.now(timezone.utc):raise ValueError('Future report timestamp')
  if any(not isinstance(row[k],str) or not row[k].strip() for k in ['source','channel']):raise ValueError('Source and channel required')
  for k in schema['numeric_fields']:
   if type(row[k]) is not int or row[k]<0:raise ValueError('Counts must be nonnegative integers, not estimates')
  u=urlsplit(row['provenance_url'])
  if u.scheme!='https' or u.hostname!='affiliate-program.amazon.com':raise ValueError('Expected authorized Amazon Associates report provenance URL')
  normalized.append(row)
 # Ledger is idempotent and carries immutable report digest provenance in a separate trail.
 ledger=json.loads((D/'campaigns.json').read_text());trail_path=D/'report-imports.json'
 trail=json.loads(trail_path.read_text()) if trail_path.exists() else []
 digest=hashlib.sha256(raw).hexdigest()
 if any(i['sha256']==digest for i in trail):return 0
 for row in normalized:
  if row not in ledger:ledger.append(row)
 trail.append({'sha256':digest,'imported_at':datetime.now(timezone.utc).isoformat(),'rows':len(normalized),'attestation':'operator asserts authorized first-party report; not independently authenticated by importer'})
 (D/'campaigns.json').write_text(json.dumps(ledger,indent=2)+'\n');trail_path.write_text(json.dumps(trail,indent=2)+'\n')
 return len(normalized)

def briefs():
 products=json.loads((D/'products.json').read_text())
 return {'generated_at':datetime.now(timezone.utc).isoformat(),'mode':'deterministic source-bound brief; no live model','briefs':[{'record':p['id'],'observed_title':p['title'],'source':p['source'],'status':'draft only; identity gate pending','questions':p['questions'],'prohibited_claims':['tested','best','high converting','trending','profitable','current price'],'required_evidence':['confirmed intended ASIN','official listing','dated source','Special Link destination test','tracking-report confirmation','policy review']} for p in products]}
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('command',choices=['briefs','import-report']);ap.add_argument('--file');ap.add_argument('--authorized-first-party',action='store_true');args=ap.parse_args()
 if args.command=='briefs':print(json.dumps(briefs(),indent=2))
 elif not args.file:ap.error('--file required')
 else:print(f'Imported {import_report(args.file,args.authorized_first_party)} rows')
