#!/usr/bin/env node
/**
 * Collector test. Starts the server on an ephemeral port, exercises every route,
 * and asserts the privacy properties that are the whole point of it.
 *
 *   node analytics/server/test.mjs
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = 8791;
const BASE = `http://127.0.0.1:${PORT}`;
const dir = mkdtempSync(join(tmpdir(), 'diyhome3-collector-'));
const store = join(dir, 'events.json');

let pass = 0;
let fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}${detail ? ' \u2014 ' + detail : ''}`); }
}

const child = spawn(process.execPath, [join(HERE, 'index.mjs'), '--port', String(PORT), '--host', '127.0.0.1', '--store', store, '--stats-token', 'sekrit'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let started = false;
child.stderr.on('data', (d) => { if (/listening on/.test(String(d))) started = true; });
child.stdout.on('data', (d) => { if (/listening on/.test(String(d))) started = true; });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function up() {
  for (let i = 0; i < 60; i++) {
    if (started) return true;
    await wait(100);
  }
  return false;
}

async function post(path, body, headers = {}) {
  return fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'TEST-AGENT/1.0', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

try {
  if (!(await up())) throw new Error('collector did not start');

  console.log('\ncollector: routes');
  check('GET /healthz returns 200', (await fetch(BASE + '/healthz')).status === 200);

  const r1 = await post('/collect', { e: 'page_view', p: 'index.html' });
  check('POST /collect accepts a known event with 204', r1.status === 204, `got ${r1.status}`);

  await post('/collect', { e: 'page_view', p: 'index.html' });
  await post('/collect', { e: 'disclosure_view', p: 'index.html' });
  await post('/collect', { e: 'outbound_click', p: 'products/index.html', h: 'www.ftc.gov', l: 'S10' });
  await post('/collect', { e: 'affiliate_click', p: 'products/art3d-smoothing-tool-kit.html', h: 'www.amazon.com', l: 'B08FKW9JRM' });
  await post('/collect', { e: 'affiliate_click', p: 'products/art3d-smoothing-tool-kit.html', h: 'www.amazon.com', l: 'B08FKW9JRM' });

  const r2 = await post('/collect', { e: 'made_up_event' });
  check('POST /collect rejects an unknown event with 400', r2.status === 400, `got ${r2.status}`);

  const r3 = await post('/collect', 'not json at all');
  check('POST /collect rejects malformed JSON with 400', r3.status === 400, `got ${r3.status}`);

  const r4 = await post('/collect', { e: 'page_view', p: 'x'.repeat(4000) });
  check('POST /collect rejects an oversized payload with 413', r4.status === 413, `got ${r4.status}`);

  const r5 = await post('/subscribe', { email: 'reader@example.com' });
  check('POST /subscribe is refused by default with 403', r5.status === 403, `got ${r5.status}`);

  console.log('\ncollector: stats');
  const noToken = await fetch(BASE + '/stats');
  check('GET /stats without a token returns 403', noToken.status === 403, `got ${noToken.status}`);

  const stats = await (await fetch(BASE + '/stats?token=sekrit')).json();
  check('page_view counted twice', stats.counts.page_view === 2, JSON.stringify(stats.counts));
  check('disclosure_view counted once', stats.counts.disclosure_view === 1);
  check('affiliate_click counted twice', stats.counts.affiliate_click === 2);
  check('outbound_click counted once', stats.counts.outbound_click === 1);
  check('reader_capture is zero', (stats.counts.reader_capture || 0) === 0);
  check('all five event names are present in the schema', ['page_view', 'disclosure_view', 'outbound_click', 'affiliate_click'].every((k) => k in stats.counts));
  check('host aggregation recorded the affiliate host', stats.affiliateHosts['www.amazon.com'] === 2, JSON.stringify(stats.affiliateHosts));

  console.log('\ncollector: privacy properties');
  await wait(6000); // let the periodic flush write the store
  const onDisk = JSON.parse(readFileSync(store, 'utf8'));
  const serialized = JSON.stringify(onDisk);

  check('no IP address is stored', !/127\.0\.0\.1|::1|\d+\.\d+\.\d+\.\d+/.test(serialized), serialized.slice(0, 200));
  check('no User-Agent is stored', !/TEST-AGENT/i.test(serialized));
  check('no cookie or identifier is issued', !onDisk.visitorId && !onDisk.clientId && !onDisk.ip);
  check('no email address is stored', !/@/.test(serialized));
  check('no query string is stored', !serialized.includes('?'));
  check('no per-event log exists \u2014 only aggregate integers', !Array.isArray(onDisk.events) && !onDisk.log);
  check('store contains only counters and timestamps', Object.keys(onDisk).every((k) =>
    ['counts', 'byPage', 'byHost', 'subscribers', 'startedAt'].includes(k)), Object.keys(onDisk).join(','));

  console.log('\ncollector: headers');
  const h = await fetch(BASE + '/healthz');
  check('Cache-Control is no-store', h.headers.get('cache-control') === 'no-store');
  check('X-Content-Type-Options is nosniff', h.headers.get('x-content-type-options') === 'nosniff');
  check('Referrer-Policy is no-referrer', h.headers.get('referrer-policy') === 'no-referrer');
  check('no Set-Cookie header is sent', h.headers.get('set-cookie') === null);

  const pre = await fetch(BASE + '/collect', { method: 'OPTIONS' });
  check('OPTIONS preflight returns 204', pre.status === 204);
  check('CORS allow-origin is set', Boolean(pre.headers.get('access-control-allow-origin')));
} catch (e) {
  fail++;
  console.log(`  FAIL harness \u2014 ${e.message}`);
} finally {
  child.kill('SIGTERM');
  await wait(300);
  rmSync(dir, { recursive: true, force: true });
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
