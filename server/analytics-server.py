#!/usr/bin/env python3
"""Self-hosted analytics endpoint for DIY Home Upgrades.

Privacy-preserving: accepts the five defined events, validates them, and
appends one JSON line per event to data/events.jsonl. No cookies, no IP
logging, no PII storage. Stdlib only — no dependencies.

Run:
    python3 server/analytics-server.py [--port 8000] [--log data/events.jsonl]

Then point ENDPOINT in assets/analytics.js at http://<host>:<port>/api/events
(or put this behind a reverse proxy on your own domain).
"""
import argparse
import json
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

ALLOWED_EVENTS = {"page_view", "outbound_click", "guide_read", "newsletter_signup", "site_search"}


def make_handler(log_path: Path):
    class Handler(BaseHTTPRequestHandler):
        server_version = "DIYHome3Analytics/1.0"

        def log_message(self, fmt, *args):  # keep stdout quiet-ish
            sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

        def do_POST(self):
            if self.path != "/api/events":
                self.send_response(404)
                self.end_headers()
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            raw = self.rfile.read(length) if length else b"{}"
            try:
                payload = json.loads(raw.decode("utf-8"))
            except Exception:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error":"invalid json"}')
                return
            event = payload.get("event")
            if event not in ALLOWED_EVENTS:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error":"unknown event"}')
                return
            record = {
                "event": event,
                "path": str(payload.get("path", ""))[:300],
                "ts": payload.get("ts") or datetime.now(timezone.utc).isoformat(),
                "data": payload.get("data") or {},
            }
            log_path.parent.mkdir(parents=True, exist_ok=True)
            with log_path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(record) + "\n")
            self.send_response(204)
            self.end_headers()

        def do_GET(self):
            # Health check + counts (no PII — counts only)
            if self.path == "/api/health":
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status":"ok"}')
                return
            if self.path == "/api/counts":
                counts = {}
                if log_path.exists():
                    for line in log_path.read_text(encoding="utf-8").splitlines():
                        try:
                            counts[json.loads(line)["event"]] = counts.get(json.loads(line)["event"], 0) + 1
                        except Exception:
                            continue
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(counts).encode())
                return
            self.send_response(404)
            self.end_headers()

    return Handler


def main():
    ap = argparse.ArgumentParser(description="DIY Home Upgrades analytics endpoint")
    ap.add_argument("--port", type=int, default=8000)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--log", default="data/events.jsonl")
    args = ap.parse_args()
    log_path = Path(args.log)
    httpd = HTTPServer((args.host, args.port), make_handler(log_path))
    print(f"Analytics endpoint on http://{args.host}:{args.port}/api/events (log: {log_path})")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
