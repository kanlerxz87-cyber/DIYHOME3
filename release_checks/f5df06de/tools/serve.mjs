#!/usr/bin/env node
/**
 * Minimal static server for local preview and for the live sandbox preview.
 * Zero dependencies. Binds 0.0.0.0 so it is reachable through a proxy.
 *
 *   node tools/serve.mjs --port 8080
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const PORT = Number((argv[argv.indexOf('--port') + 1]) || process.env.PORT || 8080);
const HOST = '0.0.0.0';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const full = normalize(join(ROOT, p));
  // Never escape the repository root.
  if (!full.startsWith(ROOT)) return null;
  if (existsSync(full) && statSync(full).isDirectory()) {
    const idx = join(full, 'index.html');
    return existsSync(idx) ? idx : null;
  }
  return existsSync(full) ? full : null;
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file) {
    const nf = join(ROOT, '404.html');
    const body = existsSync(nf) ? readFileSync(nf) : Buffer.from('Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length });
    return res.end(body);
  }
  const body = readFileSync(file);
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': body.length,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
});

server.listen(PORT, HOST, () => {
  console.log(`[serve] ${ROOT}`);
  console.log(`[serve] http://${HOST}:${PORT}/`);
});
