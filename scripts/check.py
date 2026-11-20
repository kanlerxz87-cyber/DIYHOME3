"""Check rendered routes, anchors, XML, disclosure, and the HTTP event gate."""
import http.client
import json
import os
import socket
import sqlite3
import subprocess
import sys
import tempfile
import time
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://kanlerxz87-cyber.github.io/DIYHOME3/'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.refs, self.ids, self.canon = [], set(), []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canon.append(a['href'])
        for key in ('href', 'src'):
            if key in a:
                self.refs.append((a[key], a.get('rel','').split()))


class Checks(unittest.TestCase):
    def test_site(self):
        files = sorted(ROOT.glob('**/index.html')) + [ROOT/'404.html']
        pages = {}
        for file in files:
            text = file.read_text()
            self.assertEqual(text.count('As an Amazon Associate I earn from qualifying purchases.'), 2, file)
            self.assertNotIn('data-analytics="on"',text)
            path = str(file.relative_to(ROOT)).removesuffix('index.html')
            pages[urljoin(BASE,path)] = Page(text)
            self.assertEqual(pages[urljoin(BASE,path)].canon, [] if path == '404.html' else [urljoin(BASE,path)])
        for url, page in pages.items():
            for ref, rel in page.refs:
                target = urlsplit(urljoin(url,ref))
                if target.netloc == urlsplit(BASE).netloc:
                    self.assertTrue(target.path.startswith('/DIYHOME3/'), ref)
                    filename = ROOT / target.path.removeprefix('/DIYHOME3/')
                    self.assertTrue(filename.is_file() or (filename/'index.html').is_file(), (url,ref))
                    if target.fragment:
                        self.assertIn(target.fragment, pages[target._replace(fragment='').geturl()].ids)
                if (target.hostname == 'www.amazon.com' and '/dp/' in target.path) or (target.hostname in {'instantpot.com','www.art3d.com'}):
                    self.assertIn('sponsored', rel)
                    self.assertNotIn('tag=',target.query)
                self.assertNotEqual(target.hostname,'link.amazon')
        sitemap = {v.text for v in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc')}
        feed = {v.text for v in ET.parse(ROOT/'feed.xml').findall('./channel/item/link')}
        self.assertEqual(feed, {p for p in pages if '/guides/' in p and not p.endswith('/guides/')})
        self.assertTrue(feed <= sitemap <= set(pages))
        for url in sitemap:
            self.assertNotIn('noindex', (ROOT / url.removeprefix(BASE) / 'index.html').read_text())

    def test_collector(self):
        with tempfile.TemporaryDirectory() as temp, socket.socket() as sock:
            db = os.path.join(temp,'unit.sqlite')
            targets = {k: ['home','rss','guide','listing'] for k in ('page_view','guide_view','feed_click','outbound_click','reported_order')}
            Path(temp,'targets.json').write_text(json.dumps(targets))
            sock.bind(('',0))
            port = sock.getsockname()[1]
            sock.close()
            origin = f'http://127.0.0.1:{port}'
            proc = subprocess.Popen([sys.executable,str(ROOT/'analytics/server.py')],env={**os.environ,'PORT':str(port),'ANALYTICS_ORIGIN':origin,'ANALYTICS_DB':db,'ANALYTICS_TARGETS':str(Path(temp,'targets.json')),'ANALYTICS_IMPORT_TOKEN':'unit-only'})
            def post(body, path='/api/events', headers=None):
                conn = http.client.HTTPConnection('127.0.0.1',port,timeout=2)
                try:
                    conn.request('POST',path,json.dumps(body),{'Content-Type':'application/json',**(headers if headers is not None else {'Origin':origin})})
                    return conn.getresponse().status
                finally:
                    conn.close()
            try:
                for _ in range(40):
                    try:
                        with socket.create_connection(('127.0.0.1',port),timeout=.1): break
                    except OSError: time.sleep(.05)
                for event,target in [('page_view','home'),('guide_view','guide'),('feed_click','rss'),('outbound_click','listing')]:
                    self.assertEqual(post({'event':event,'target':target}),204)
                self.assertEqual(post({'event':'page_view','target':'not-allowed'}),400)
                self.assertEqual(post({'event':'page_view','target':'home','referrer':'private'}),400)
                self.assertEqual(post({'event':'page_view','target':'home'},headers={'Origin':'https://elsewhere.example'}),403)
                self.assertEqual(post({'event':'reported_order','target':'listing'}),400)
                report = {'event':'reported_order','target':'listing','count':3,'day':'2024-01-01','report_ref':'test-report'}
                self.assertEqual(post(report,'/api/reports'),403)
                self.assertEqual(post(report,'/api/reports',{'Authorization':'Bearer unit-only'}),204)
                self.assertEqual(post(report,'/api/reports',{'Authorization':'Bearer unit-only'}),409)
                with sqlite3.connect(db) as conn:
                    self.assertEqual(conn.execute('SELECT SUM(total) FROM counts').fetchone()[0],7)
            finally:
                proc.terminate()
                proc.wait(5)


if __name__ == '__main__': unittest.main()
