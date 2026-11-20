"""Optional self-hosted aggregate collector. No visitor identifier or request logging.
Run behind HTTPS with ALLOWED_ORIGINS and ADMIN_TOKEN; never host the database in dist/.
"""
import json, os, sqlite3, time, hmac, threading
from pathlib import Path
from collections import deque
from datetime import datetime, timezone, timedelta
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
EVENTS={'page_view','guide_view','product_view','outbound_click','feed_click'}
LOCK=threading.Lock(); RECENT=deque()

def database():
 p=Path(os.getenv('ANALYTICS_DB',str(ROOT/'.runtime/events.sqlite'))).resolve()
 if p.is_relative_to((ROOT/'dist').resolve()):raise ValueError('Database must not be public')
 p.parent.mkdir(parents=True,exist_ok=True)
 con=sqlite3.connect(p,timeout=10)
 con.execute('CREATE TABLE IF NOT EXISTS counts(day TEXT, event TEXT, page TEXT, record TEXT, count INTEGER NOT NULL, PRIMARY KEY(day,event,page,record))')
 return con

def validate(data):
 if not isinstance(data,dict) or set(data)!={'event','page','record'}:return False
 if not all(isinstance(v,str) for v in data.values()):return False
 if data['event'] not in EVENTS:return False
 # Only known generated pages. Queries, fragments, arbitrary visitor data and URLs rejected.
 pages={str(p.relative_to(ROOT/'dist')) for p in (ROOT/'dist').rglob('*.html')}
 products=json.loads((ROOT/'site/data/products.json').read_text())
 records={p['id'] for p in products}|{p['observed_asin'] for p in products}
 if data['page'] not in pages:return False
 if data['event']=='outbound_click':return data['record'] in records
 if data['record']!='':return False
 if data['event']=='guide_view':return data['page'].startswith('guides/')
 if data['event']=='product_view':return data['page'].startswith('products/')
 return True

class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT/os.getenv('SITE_ROOT','dist')),**kwargs)
 def log_message(self,*args):pass
 def origin_allowed(self):
  origin=self.headers.get('Origin','')
  configured=os.getenv('ALLOWED_ORIGINS','').split(',')
  if origin and origin in configured:return True
  # Same-origin mode is enabled only for explicit local preview, never by default.
  return os.getenv('PREVIEW_SAME_ORIGIN')=='1' and origin and urlsplit(origin).netloc==self.headers.get('Host')
 def reply(self,status,obj=None):
  self.send_response(status)
  if self.origin_allowed():self.send_header('Access-Control-Allow-Origin',self.headers['Origin']);self.send_header('Vary','Origin')
  self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff')
  if obj is not None:self.send_header('Content-Type','application/json')
  self.end_headers()
  if obj is not None:self.wfile.write(json.dumps(obj).encode())
 def do_OPTIONS(self):
  if self.path!='/api/events' or not self.origin_allowed():return self.reply(403)
  self.send_response(204);self.send_header('Access-Control-Allow-Origin',self.headers['Origin']);self.send_header('Vary','Origin');self.send_header('Access-Control-Allow-Methods','POST, OPTIONS');self.send_header('Access-Control-Allow-Headers','Content-Type');self.end_headers()
 def do_POST(self):
  if self.path!='/api/events':return self.reply(404)
  if not self.origin_allowed():return self.reply(403)
  if self.headers.get('DNT')=='1' or self.headers.get('Sec-GPC')=='1':return self.reply(204)
  if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.reply(415)
  try:length=int(self.headers.get('Content-Length','0'))
  except ValueError:return self.reply(400)
  if not 0<length<=1024:return self.reply(413)
  with LOCK:
   now=time.monotonic()
   while RECENT and RECENT[0]<now-60:RECENT.popleft()
   if len(RECENT)>=600:return self.reply(429)
   RECENT.append(now)
  try:data=json.loads(self.rfile.read(length))
  except (ValueError,UnicodeDecodeError):return self.reply(400)
  if not validate(data):return self.reply(400)
  now=datetime.now(timezone.utc)
  with database() as con:
   con.execute('DELETE FROM counts WHERE day < ?',((now-timedelta(days=90)).date().isoformat(),))
   con.execute('INSERT INTO counts VALUES(?,?,?,?,1) ON CONFLICT(day,event,page,record) DO UPDATE SET count=count+1',(now.date().isoformat(),data['event'],data['page'],data['record']))
  return self.reply(204)
 def do_GET(self):
  if self.path=='/api/health':return self.reply(200,{'service':'aggregate collector','cookies':False,'orders_measured':False})
  if self.path=='/api/stats':
   token=os.getenv('ADMIN_TOKEN','')
   if not token or not hmac.compare_digest(self.headers.get('Authorization',''),'Bearer '+token):return self.reply(401)
   with database() as con:
    rows=[dict(zip(['day','event','page','record','count'],r)) for r in con.execute('SELECT * FROM counts ORDER BY day DESC')]
   return self.reply(200,{'aggregates':rows,'note':'Event counts, not unique visitors or conversions'})
  if self.path.startswith('/api/'):return self.reply(404)
  return super().do_GET()

if __name__=='__main__':
 with database():pass
 port=int(os.getenv('PORT','8000'))
 print(f'Publication and aggregate collector listening on 0.0.0.0:{port}',flush=True)
 ThreadingHTTPServer(('0.0.0.0',port),Handler).serve_forever()
