#!/usr/bin/env node
/**
 * LINKCHECK — crawl the built site and confirm nothing is broken.
 *
 * Internal links are resolved against the filesystem. External links are listed
 * but NOT fetched, because this repo's network allowlist does not include most
 * of them and a silent fetch failure would be indistinguishable from a dead
 * link. They are reported so a human can spot-check them.
 *
 *   node tools/linkcheck.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '.build');

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    if (e === '.git' || e === 'node_modules' || e === '.arena') continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const htmlFiles = walk(ROOT).filter((f) => f.endsWith('.html'));
const rel = (f) => relative(ROOT, f).split('\\').join('/');

const internal = new Map(); // target -> [from...]
const external = new Map();
const anchors = new Map();   // file -> Set(ids)
const broken = [];

// Collect the ids that exist in each file, so in-page anchors can be checked too.
for (const f of htmlFiles) {
  const h = readFileSync(f, 'utf8');
  const ids = new Set([...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  anchors.set(rel(f), ids);
}

const LINK = /<a\b[^>]*href="([^"]*)"[^>]*>/gi;

for (const f of htmlFiles) {
  const h = readFileSync(f, 'utf8');
  let m;
  while ((m = LINK.exec(h)) !== null) {
    const raw = m[1];
    if (!raw || /^(mailto:|javascript:|tel:)/.test(raw)) continue;

    if (/^https?:\/\//.test(raw)) {
      if (!external.has(raw)) external.set(raw, []);
      external.get(raw).push(rel(f));
      continue;
    }

    const [path, hash] = raw.split('#');
    if (!path) {
      // Pure in-page anchor.
      const ids = anchors.get(rel(f)) || new Set();
      if (hash && !ids.has(decodeURIComponent(hash))) broken.push(`${rel(f)} -> #${hash} (no such id on the page)`);
      continue;
    }

    const target = resolve(dirname(f), decodeURIComponent(path));
    const tRel = relative(ROOT, target).split('\\').join('/');
    if (!existsSync(target)) {
      broken.push(`${rel(f)} -> ${raw} (no file at ${tRel})`);
      continue;
    }
    if (!internal.has(tRel)) internal.set(tRel, []);
    internal.get(tRel).push(rel(f));

    // Directory links need an index.html to resolve on a static host.
    if (statSync(target).isDirectory() && !existsSync(join(target, 'index.html'))) {
      broken.push(`${rel(f)} -> ${raw} (directory with no index.html)`);
    }
    if (hash && target.endsWith('.html')) {
      const ids = anchors.get(tRel) || new Set();
      if (!ids.has(decodeURIComponent(hash))) broken.push(`${rel(f)} -> ${raw} (no id "${hash}" in ${tRel})`);
    }
  }
}

// Assets referenced by src/href that are not links.
const ASSET = /<(?:img|script|link)\b[^>]*(?:src|href)="([^"]+)"/gi;
const missingAssets = [];
for (const f of htmlFiles) {
  const h = readFileSync(f, 'utf8');
  let m;
  while ((m = ASSET.exec(h)) !== null) {
    const u = m[1];
    if (/^https?:|^\/\/|^data:/.test(u)) continue;
    const target = resolve(dirname(f), decodeURIComponent(u));
    if (!existsSync(target)) missingAssets.push(`${rel(f)} -> ${u}`);
  }
}

// Orphan check: every built page should be linked from somewhere.
const orphans = htmlFiles
  .map(rel)
  .filter((p) => p !== '404.html' && p !== 'index.html' && !internal.has(p));

console.log(`\nLINKCHECK \u2014 ${htmlFiles.length} pages\n`);
console.log(`  internal link targets resolved : ${internal.size}`);
console.log(`  distinct external destinations : ${external.size}`);
console.log(`  pages with no inbound link     : ${orphans.length}`);

if (orphans.length) console.log(`    ${orphans.join('\n    ')}`);

if (missingAssets.length) {
  console.log(`\n\u2717 ${missingAssets.length} missing asset reference(s):`);
  for (const b of [...new Set(missingAssets)]) console.log(`    ${b}`);
}

if (broken.length) {
  console.log(`\n\u2717 ${broken.length} broken link(s):`);
  for (const b of [...new Set(broken)]) console.log(`    ${b}`);
}

console.log('\n  External destinations (not fetched \u2014 spot-check manually):');
const hosts = new Map();
for (const u of external.keys()) {
  try {
    const h = new URL(u).hostname;
    hosts.set(h, (hosts.get(h) || 0) + 1);
  } catch { /* ignore */ }
}
for (const [h, n] of [...hosts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(3)}  ${h}`);
}

const failed = broken.length + missingAssets.length;
console.log(failed ? `\n\u2717 ${failed} problem(s) found.` : '\n\u2713 No broken internal links and no missing assets.');
process.exit(failed ? 1 : 0);
