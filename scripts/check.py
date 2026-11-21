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


class Rows(HTMLParser):
    """Collect <tr>/<td> text and the hrefs inside each cell."""

    def __init__(self, text):
        super().__init__()
        self.rows, self._row, self._cell = [], None, None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self._row = []
        elif tag == 'td' and self._row is not None:
            self._cell = {'text': [], 'hrefs': []}
        elif tag == 'a' and self._cell is not None:
            self._cell['hrefs'].append(dict(attrs).get('href', ''))

    def handle_data(self, data):
        if self._cell is not None:
            self._cell['text'].append(data)

    def handle_endtag(self, tag):
        if tag == 'td' and self._cell is not None:
            self._row.append({'text': ''.join(self._cell['text']).strip(), 'hrefs': self._cell['hrefs']})
            self._cell = None
        elif tag == 'tr' and self._row is not None:
            if self._row:
                self.rows.append(self._row)
            self._row = None


#: Flags that must stay on the published Flagged for Review page (T18/T21).
REQUIRED_FLAGS = ('F-08', 'F-09', 'F-21')
#: Frozen event names (F-21). A rename after collection starts loses comparability.
FROZEN_EVENTS = ('page_view', 'guide_view', 'outbound_click', 'feed_click', 'reported_order')
AMAZON_IMAGE_HOSTS = ('amazon.com', 'media-amazon.com', 'ssl-images-amazon.com')


def flag_findings(rows):
    """Return the problems in a flag table, so the detector can be self-tested."""
    findings = []
    if not rows:
        return ['flag table is empty']
    labels = [r[0]['text'] for r in rows if r]
    for flag in REQUIRED_FLAGS:
        if not any(flag in label for label in labels):
            findings.append(f'{flag} is missing from the Flagged for Review table')
    for row in rows:
        if len(row) < 2:
            findings.append(f'row "{row[0]["text"][:40]}" has no source cell')
            continue
        source = row[-1]
        if not source['hrefs'] and 'no official source' not in source['text'].lower():
            findings.append(f'row "{row[0]["text"][:40]}" has neither a source link nor an explicit "no official source"')
    return findings


class ImageSrcs(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.srcs = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            self.srcs.append(dict(attrs).get('src', ''))


class Checks(unittest.TestCase):
    def test_flags(self):
        """T18/T21: the three unshipped flags stay published and stay sourced."""
        page = (ROOT / 'flagged-for-review' / 'index.html').read_text()
        findings = flag_findings(Rows(page).rows)
        self.assertEqual(findings, [], findings)
        # Positive control: the detector must fire on a known violation, otherwise
        # a pass only proves the detector is broken.
        broken = '<table><tbody><tr><td>Intended products</td><td>x</td><td>y</td><td>unsourced</td></tr></tbody></table>'
        control = flag_findings(Rows(broken).rows)
        self.assertTrue(any('F-08 is missing' in f for f in control), control)
        self.assertTrue(any('no official source' in f for f in control), control)
        # F-21: the frozen five, in both the enumeration and the collector gate.
        targets = json.loads((ROOT / 'analytics' / 'targets.json').read_text())
        self.assertEqual(sorted(targets), sorted(FROZEN_EVENTS))
        collector = (ROOT / 'analytics' / 'server.py').read_text()
        for name in FROZEN_EVENTS:
            self.assertIn(name, collector)
        measurement = (ROOT / 'measurement' / 'index.html').read_text()
        for name in FROZEN_EVENTS:
            self.assertIn(name, measurement)

    def test_no_amazon_imagery(self):
        """F-09: no Amazon-hosted image may be embedded — the licence window is 24h."""
        for file in sorted(p for p in ROOT.rglob('*.html') if 'verification' not in p.relative_to(ROOT).parts):
            for raw in ImageSrcs(file.read_text()).srcs:
                host = urlsplit(urljoin(BASE, raw)).hostname or ''
                self.assertFalse(any(host == d or host.endswith('.' + d) for d in AMAZON_IMAGE_HOSTS), (file, raw))

    def test_site(self):
        files = sorted(p for p in ROOT.rglob('*.html') if 'verification' not in p.relative_to(ROOT).parts)
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
        self.assertEqual(feed, {p for p in pages if '/guides/' in p and p.endswith('/') and not p.endswith('/guides/')})
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
