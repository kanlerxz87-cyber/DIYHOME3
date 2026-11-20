import unittest, sys, json, tempfile, shutil, os, threading, http.client, copy
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'));sys.path.insert(0,str(ROOT/'server'))
import validate, pipeline, analytics

class PublicationTests(unittest.TestCase):
 def test_site_links_disclosures_and_sources(self):validate.check()
 def test_three_unique_records_and_four_inputs(self):
  p=json.loads((ROOT/'site/data/products.json').read_text());s=json.loads((ROOT/'site/data/submissions.json').read_text())
  self.assertEqual(len(p),3);self.assertEqual(len(s),4);self.assertEqual(s[2]['duplicate_of'],2)
 def test_intent_not_inferred(self):
  for p in json.loads((ROOT/'site/data/products.json').read_text()):
   for field in ['intended_asin','official_listing_url','confirmation_date','confirmation_source','price','rating','reviews','special_link']:self.assertIsNone(p[field])
   self.assertTrue(p['observed_redirect_url'].startswith('https://www.amazon.com/dp/'))
 def test_empty_campaign_ledger(self):self.assertEqual(json.loads((ROOT/'site/data/campaigns.json').read_text()),[])
 def test_public_collection_off(self):self.assertIsNone(json.loads((ROOT/'site/data/config.json').read_text())['analytics_endpoint'])
 def test_unconfirmed_purchase_rejected(self):
  p=json.loads((ROOT/'site/data/products.json').read_text())[0];p['special_link']='https://www.amazon.com/dp/B08FKW9JRM?tag=shopnow047c-20'
  self.assertGreater(len(validate.product_errors(p)),5)
 def test_mismatched_tag_rejected(self):
  p={'id':'test','special_link':'https://www.amazon.com/dp/B08FKW9JRM?tag=wrong','intended_asin':'B08FKW9JRM','official_listing_url':'https://www.amazon.com/dp/B08FKW9JRM'}
  self.assertTrue(any('tracking ID' in e for e in validate.product_errors(p)))
 def test_briefs_are_not_model_claims(self):
  brief=pipeline.briefs();self.assertIn('no live model',brief['mode']);self.assertEqual(len(brief['briefs']),3)

class ReportTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.d=Path(self.tmp.name)
  for n in ['campaigns.json','campaign-schema.json']:shutil.copy(ROOT/'site/data'/n,self.d/n)
  self.patcher=patch.object(pipeline,'D',self.d);self.patcher.start()
  self.row={'timestamp':'2026-01-01T00:00:00Z','source':'unit test fixture, not a real report','channel':'fixture','eligible_sessions':1,'clicks':1,'reported_orders':0,'provenance_url':'https://affiliate-program.amazon.com/home/reports','imported_at':'2026-01-02T00:00:00Z'}
 def tearDown(self):self.patcher.stop();self.tmp.cleanup()
 def fixture(self):
  p=self.d/'input.json';p.write_text(json.dumps([self.row]));return p
 def test_attestation_required(self):
  with self.assertRaises(ValueError):pipeline.import_report(self.fixture())
 def test_idempotence_and_provenance(self):
  p=self.fixture();self.assertEqual(pipeline.import_report(p,True),1);self.assertEqual(pipeline.import_report(p,True),0)
  self.assertEqual(len(json.loads((self.d/'report-imports.json').read_text())),1)
 def test_negative_counts_rejected(self):
  self.row['reported_orders']=-1
  with self.assertRaises(ValueError):pipeline.import_report(self.fixture(),True)
 def test_nonofficial_provenance_rejected(self):
  self.row['provenance_url']='https://example.com/estimated-orders'
  with self.assertRaises(ValueError):pipeline.import_report(self.fixture(),True)
 def test_extra_personal_fields_rejected(self):
  self.row['email']='nobody@example.com'
  with self.assertRaises(ValueError):pipeline.import_report(self.fixture(),True)

class CollectorTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory();cls.env=patch.dict(os.environ,{'ANALYTICS_DB':cls.tmp.name+'/test.sqlite','ALLOWED_ORIGINS':'https://publication.example','ADMIN_TOKEN':'test-only-do-not-deploy'})
  cls.env.start();cls.server=analytics.ThreadingHTTPServer(('127.0.0.1',0),analytics.Handler)
  cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
 @classmethod
 def tearDownClass(cls):cls.server.shutdown();cls.server.server_close();cls.env.stop();cls.tmp.cleanup()
 def req(self,method,path,data=None,headers=None):
  c=http.client.HTTPConnection('127.0.0.1',self.server.server_port)
  c.request(method,path,body=json.dumps(data) if data is not None else None,headers=headers or {})
  r=c.getresponse();result=(r.status,r.read());c.close();return result
 def post(self,event='page_view',page='index.html',record='',**extra):
  return self.req('POST','/api/events',dict(event=event,page=page,record=record,**extra),{'Origin':'https://publication.example','Content-Type':'application/json'})[0]
 def test_all_five_events(self):
  for event,page,record in [('page_view','index.html',''),('guide_view','guides/measure-for-a-pan-organizer.html',''),('product_view','products/cookware-organizer.html',''),('outbound_click','index.html','P03'),('feed_click','index.html','')]:self.assertEqual(self.post(event,page,record),204)
 def test_pii_rejected(self):self.assertEqual(self.post(email='private@example.com'),400)
 def test_query_rejected(self):self.assertEqual(self.post(page='index.html?email=private'),400)
 def test_unknown_record_rejected(self):self.assertEqual(self.post('outbound_click',record='private-user-id'),400)
 def test_invalid_event_rejected(self):self.assertEqual(self.post('purchase'),400)
 def test_wrong_page_type_rejected(self):self.assertEqual(self.post('guide_view'),400)
 def test_foreign_origin_rejected(self):self.assertEqual(self.req('POST','/api/events',{}, {'Origin':'https://foreign.example','Content-Type':'application/json'})[0],403)
 def test_admin_is_private(self):self.assertEqual(self.req('GET','/api/stats')[0],401)
 def test_aggregate_db_has_no_visitors(self):
  self.post()
  with analytics.database() as db:
   cols=[r[1] for r in db.execute('PRAGMA table_info(counts)')]
  self.assertEqual(cols,['day','event','page','record','count'])
 def test_dnt_no_count(self):
  with analytics.database() as db:before=db.execute('SELECT coalesce(sum(count),0) FROM counts').fetchone()[0]
  self.assertEqual(self.req('POST','/api/events',{}, {'Origin':'https://publication.example','Content-Type':'application/json','DNT':'1'})[0],204)
  with analytics.database() as db:after=db.execute('SELECT coalesce(sum(count),0) FROM counts').fetchone()[0]
  self.assertEqual(before,after)
 def test_preflight(self):self.assertEqual(self.req('OPTIONS','/api/events',headers={'Origin':'https://publication.example'})[0],204)
 def test_database_not_public(self):
  with patch.dict(os.environ,{'ANALYTICS_DB':str(ROOT/'dist/events.sqlite')}):
   with self.assertRaises(ValueError):analytics.database()
if __name__=='__main__':unittest.main()
