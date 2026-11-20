"""First-party aggregate counter. Run behind HTTPS on an approved editorial host."""
import json
import os
import re
import sqlite3
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

EVENTS = {'page_view', 'guide_view', 'outbound_click', 'feed_click', 'reported_order'}
SLUG = re.compile(r'[a-z0-9-]{1,72}\Z')
DB = os.environ.get('ANALYTICS_DB', 'analytics.sqlite3')
ORIGIN = os.environ.get('ANALYTICS_ORIGIN', 'http://localhost:8000')
TOKEN = os.environ.get('ANALYTICS_IMPORT_TOKEN', '')
ROOT = Path(__file__).resolve().parents[1]
TARGETS_PATH = Path(os.environ.get('ANALYTICS_TARGETS', str(ROOT / 'analytics/targets.json')))


def save(event, target, day, count=1, report_ref=''):
    with sqlite3.connect(DB) as db:
        db.execute('CREATE TABLE IF NOT EXISTS counts (day TEXT, event TEXT, target TEXT, total INTEGER, PRIMARY KEY(day,event,target))')
        db.execute('CREATE TABLE IF NOT EXISTS imports (ref TEXT, day TEXT, target TEXT, PRIMARY KEY(ref,day,target))')
        if report_ref and not db.execute('INSERT OR IGNORE INTO imports VALUES (?,?,?)', (report_ref, day, target)).rowcount:
            return False
        db.execute('INSERT INTO counts VALUES (?,?,?,?) ON CONFLICT(day,event,target) DO UPDATE SET total=total+excluded.total', (day, event, target, count))
        return True


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_args):
        pass  # Don't store request IPs, paths, referrers or user agents.

    def reply(self, status, body=b'', mime='text/plain; charset=utf-8'):
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/healthz':
            return self.reply(200, b'ok')
        for name in ('/DIYHOME3/', '/'):
            if path.startswith(name):
                path = path.removeprefix(name)
                break
        if path.endswith('/') or not path:
            path += 'index.html'
        allowed = {'.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.xml': 'application/xml', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'}
        file = (ROOT / path).resolve()
        if not file.is_relative_to(ROOT) or file.suffix not in allowed or not file.is_file() or any(p.startswith('.') for p in file.relative_to(ROOT).parts):
            return self.reply(404, (ROOT / '404.html').read_bytes() if (ROOT / '404.html').exists() else b'Not found', allowed['.html'])
        return self.reply(200, file.read_bytes(), allowed[file.suffix])

    def do_POST(self):
        import hmac
        admin = self.path == '/api/reports'
        if self.path not in ('/api/events', '/api/reports'):
            return self.reply(404)
        if admin:
            if not TOKEN or not hmac.compare_digest(self.headers.get('Authorization', '').encode(), f'Bearer {TOKEN}'.encode()):
                return self.reply(403)
        elif self.headers.get('Origin') != ORIGIN:
            return self.reply(403)
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 512 or self.headers.get_content_type() != 'application/json':
                return self.reply(400)
            payload = json.loads(self.rfile.read(length))
            if not isinstance(payload, dict) or set(payload) != ({'event', 'target', 'day', 'count', 'report_ref'} if admin else {'event', 'target'}):
                return self.reply(400)
            event, target = payload['event'], payload['target']
            targets = json.loads(TARGETS_PATH.read_text())
            if not isinstance(event, str) or event not in EVENTS or not isinstance(target, str) or not SLUG.fullmatch(target) or (event == 'reported_order') != admin or target not in targets[event]:
                return self.reply(400)
            today = datetime.now(timezone.utc).date().isoformat()
            if admin:
                day, count, ref = payload['day'], payload['count'], payload['report_ref']
                if datetime.strptime(day, '%Y-%m-%d').date().isoformat() != day or day > today or type(count) is not int or not 0 <= count <= 1_000_000 or not SLUG.fullmatch(ref):
                    return self.reply(400)
            else:
                day, count, ref = today, 1, ''
        except (TypeError, ValueError):
            return self.reply(400)
        return self.reply(204 if save(event, target, day, count, ref) else 409)


if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', int(os.environ.get('PORT', '8000'))), Handler).serve_forever()
