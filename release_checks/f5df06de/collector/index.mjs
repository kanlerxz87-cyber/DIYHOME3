#!/usr/bin/env node
/**
 * DIYHOME3 — self-hosted, first-party analytics collector.
 *
 * Zero dependencies. Node 18+ (uses the built-in fetch-era APIs only, and
 * node:http). Run it anywhere that executes Node; GitHub Pages cannot, which is
 * why this file exists separately from the site and why flag F-11 is open.
 *
 *   node analytics/server/index.mjs --port 8787 --store ./data/events.json
 *
 * ROUTES
 *   POST /collect    { e: "<event name>", p: "<page path>", h: "<host>", l: "<link id>" }
 *                    Increments aggregate counters. Discards the body. Returns 204.
 *   POST /subscribe  { email: "..." }  \u2014 refuses unless --allow-subscribe is passed.
 *   GET  /stats      Aggregate counters as JSON. No per-visitor breakdown exists.
 *   GET  /healthz    Liveness.
 *
 * PRIVACY PROPERTIES \u2014 these are the point of the exercise, not a footnote
 *   - No IP address is read, logged or stored. The request socket address is
 *     never touched.
 *   - No User-Agent is read, logged or stored.
 *   - No cookie is read or set. No identifier of any kind is issued.
 *   - Nothing is stored per event. Only aggregate integers survive the request.
 *   - The request body is discarded after incrementing counters.
 *   - CORS is open for POST from any origin because the payload contains no
 *     personal data, but /stats is same-origin or token-gated.
 *   - Event names are validated against an allowlist, so this endpoint cannot be
 *     used to store arbitrary attacker-chosen keys.
 *   - Payload size is capped at 1 KB and rejected above it.
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ARGS = parseArgs(process.argv.slice(2));
const PORT = Number(ARGS.port || process.env.PORT || 8787);
const HOST = ARGS.host || process.env.HOST || '0.0.0.0';
const STORE = resolve(ARGS.store || process.env.STORE || './data/events.json');
const ALLOW_SUBSCRIBE = Boolean(ARGS['allow-subscribe']);
const STATS_TOKEN = ARGS['stats-token'] || process.env.STATS_TOKEN || null;

// The five events defined by the site. Anything else is rejected.
const EVENTS = new Set([
  'page_view',
  'disclosure_view',
  'outbound_click',
  'affiliate_click',
  'reader_capture',
]);

const MAX_BODY = 1024;
const FLUSH_MS = 5000;

let state = load();
let dirty = false;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { out[key] = next; i++; }
      else out[key] = true;
    }
  }
  return out;
}

function blank() {
  return { counts: {}, byPage: {}, byHost: {}, subscribers: 0, startedAt: new Date().toISOString() };
}

function load() {
  try {
    if (!existsSync(STORE)) return blank();
    const raw = JSON.parse(readFileSync(STORE, 'utf8'));
    return Object.assign(blank(), raw);
  } catch {
    // A corrupt store must not take the collector down. Start clean and say so.
    console.error(`[collector] could not read ${STORE}; starting with empty counters`);
    return blank();
  }
}

function flush() {
  if (!dirty) return;
  try {
    mkdirSync(dirname(STORE), { recursive: true });
    writeFileSync(STORE, JSON.stringify(state, null, 2) + '\n', 'utf8');
    dirty = false;
  } catch (e) {
    console.error('[collector] flush failed:', e.message);
  }
}

setInterval(flush, FLUSH_MS);
process.on('SIGTERM', () => { flush(); process.exit(0); });
process.on('SIGINT', () => { flush(); process.exit(0); });

function inc(bucket, key, cap = 500) {
  if (typeof key !== 'string' || !key) return;
  // Bound each bucket so a hostile client cannot grow the store without limit.
  if (Object.keys(bucket).length >= cap && !(key in bucket)) return;
  bucket[key] = (bucket[key] || 0) + 1;
}

function readBody(req) {
  return new Promise((res, rej) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        // Keep consuming but stop buffering. Destroying the socket here would
        // surface to the client as a network error rather than a clean 413, so
        // the body is drained instead and the response still gets through.
        tooLarge = true;
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (tooLarge) { rej(new Error('payload too large')); return; }
      res(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', () => rej(new Error('payload too large')));
  });
}

function cors(res, origin) {
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');
  res.setHeader('Vary', 'Origin');
}

function send(res, code, body, type = 'application/json') {
  const out = body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': type + '; charset=utf-8',
    'Content-Length': Buffer.byteLength(out),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  });
  res.end(out);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  cors(res, req.headers.origin);

  if (req.method === 'OPTIONS') return send(res, 204);

  try {
    if (req.method === 'GET' && url.pathname === '/healthz') {
      return send(res, 200, { ok: true, uptime: process.uptime() });
    }

    if (req.method === 'GET' && url.pathname === '/stats') {
      if (STATS_TOKEN && url.searchParams.get('token') !== STATS_TOKEN) {
        return send(res, 403, { error: 'a stats token is required; pass --stats-token to the collector' });
      }
      return send(res, 200, {
        startedAt: state.startedAt,
        counts: state.counts,
        byPage: state.byPage,
        affiliateHosts: state.byHost,
        subscribers: state.subscribers,
        note: 'Aggregate integers only. No per-visitor record exists, and none can be reconstructed from this data.',
      });
    }

    if (req.method === 'POST' && url.pathname === '/collect') {
      let body;
      try { body = await readBody(req); }
      catch { return send(res, 413, { error: 'payload too large' }); }
      let payload;
      try { payload = JSON.parse(body); }
      catch { return send(res, 400, { error: 'malformed JSON' }); }

      const e = typeof payload.e === 'string' ? payload.e : '';
      if (!EVENTS.has(e)) return send(res, 400, { error: 'unknown event' });

      inc(state.counts, e);

      // Page path is our own site structure, not user data. Bounded and
      // restricted to same-origin relative paths.
      if (typeof payload.p === 'string' && /^[\w./-]{1,200}$/.test(payload.p)) {
        inc(state.byPage, `${e}:${payload.p}`);
      }

      // Host only, never a full URL. A query string could carry personal data,
      // so it is never accepted.
      if (e === 'outbound_click' || e === 'affiliate_click') {
        if (typeof payload.h === 'string' && /^[a-z0-9.-]{1,253}$/.test(payload.h.toLowerCase())) {
          inc(state.byHost, payload.h.toLowerCase());
        }
      }

      dirty = true;
      return send(res, 204);
    }

    if (req.method === 'POST' && url.pathname === '/subscribe') {
      if (!ALLOW_SUBSCRIBE) {
        return send(res, 403, {
          error: 'reader capture is disabled on this collector',
          reason: 'Enabling it requires a lawful basis, a privacy notice and a working unsubscribe first. See flag F-13.',
        });
      }
      let body;
      try { body = await readBody(req); }
      catch { return send(res, 413, { error: 'payload too large' }); }
      let payload;
      try { payload = JSON.parse(body); }
      catch { return send(res, 400, { error: 'malformed JSON' }); }
      const email = typeof payload.email === 'string' ? payload.email.trim() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return send(res, 400, { error: 'that does not look like an email address' });
      }
      // Deliberately stores a COUNT, not the address. Holding addresses requires
      // the lawful basis that F-13 says is not yet in place, so this reference
      // implementation refuses to hold them even when capture is enabled.
      state.subscribers += 1;
      inc(state.counts, 'reader_capture');
      dirty = true;
      console.error('[collector] a subscription was counted. The address itself was not stored \u2014 wire this to your authorised email service instead.');
      return send(res, 204);
    }

    return send(res, 404, { error: 'not found' });
  } catch (e) {
    return send(res, 500, { error: 'request failed' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[collector] listening on http://${HOST}:${PORT}`);
  console.log(`[collector] store: ${STORE}`);
  console.log(`[collector] events: ${[...EVENTS].join(', ')}`);
  console.log(`[collector] subscribe: ${ALLOW_SUBSCRIBE ? 'ENABLED (counts only, addresses are not stored)' : 'disabled'}`);
  console.log(`[collector] stats: ${STATS_TOKEN ? 'token required' : 'open \u2014 set --stats-token before exposing this publicly'}`);
});
