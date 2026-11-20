/*
 * DIYHOME3 — first-party, privacy-preserving analytics.
 *
 * WHAT THIS IS
 *   A counter. Five integers, held in this browser, under one localStorage key
 *   on this origin. Optionally forwarded to a self-hosted collector if (and only
 *   if) window.DIYHOME3.endpoint is set to a URL.
 *
 * WHAT THIS IS NOT
 *   Not a tracker. It records no IP address, no user agent, no referrer, no
 *   cookie, no persistent identifier, no scroll depth, no dwell time, and no
 *   full destination URL. For an outbound click it records only that a click
 *   happened, plus the destination HOST and a site-internal link id — never the
 *   query string, which is where personal data would hide.
 *
 * WHY IT IS BUILT THIS WAY
 *   The brief asks for a privacy-preserving outbound-click counter and a
 *   self-hosted analytics endpoint. Installing a third-party analytics product
 *   would mean choosing a vendor and accepting its data terms on the owner's
 *   behalf without authority, and would turn a site that currently needs no
 *   consent notice into one that does. So nothing third-party is loaded.
 *
 * THE FIVE EVENTS
 *   page_view, disclosure_view, outbound_click, affiliate_click, reader_capture
 *   The brief said "record the five defined events" without enumerating them.
 *   This set is the build's documented reading of that instruction, and it is
 *   flagged as an assumption at F-21 on the Flagged for Review page.
 */
(function () {
  'use strict';

  var CFG = window.DIYHOME3 || {};
  var KEY = 'diyhome3.counts.v1';

  var EVENTS = ['page_view', 'disclosure_view', 'outbound_click', 'affiliate_click', 'reader_capture'];

  // Hosts that make an outbound click an AFFILIATE click rather than a citation
  // click. A click on a source link is not a commercial signal and must never be
  // counted as one.
  var AFFILIATE_HOSTS = ['amazon.com', 'www.amazon.com', 'link.amazon', 'amzn.to'];

  function isAffiliateHost(host) {
    host = String(host || '').toLowerCase();
    for (var i = 0; i < AFFILIATE_HOSTS.length; i++) {
      var h = AFFILIATE_HOSTS[i];
      if (host === h) return true;
      // match sub-domains of amazon.com, e.g. smile.amazon.com
      if (h.indexOf('.') > -1 && host.slice(-h.length - 1) === '.' + h) return true;
    }
    return false;
  }

  /* ---------------- storage: fail soft, never throw ---------------- */

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return fresh();
      var parsed = JSON.parse(raw);
      var out = fresh();
      for (var i = 0; i < EVENTS.length; i++) {
        var n = parseInt(parsed && parsed[EVENTS[i]], 10);
        if (isFinite(n) && n > 0) out[EVENTS[i]] = n;
      }
      // A single boolean per event name saying whether it has fired in this page
      // load. Prevents a reload storm inflating disclosure_view.
      out.__fired = (parsed && parsed.__fired) || {};
      return out;
    } catch (e) {
      return fresh();
    }
  }

  function fresh() {
    var o = { __fired: {} };
    for (var i = 0; i < EVENTS.length; i++) o[EVENTS[i]] = 0;
    return o;
  }

  function write(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* Storage blocked or full. Counting degrades to memory-only and the site
         keeps working. This is deliberate: analytics must never break a page. */
    }
  }

  var memory = fresh();
  var storageAvailable = (function () {
    try {
      window.localStorage.setItem('__probe__', '1');
      window.localStorage.removeItem('__probe__');
      return true;
    } catch (e) {
      return false;
    }
  })();

  var state = storageAvailable ? read() : memory;

  /* ---------------- collector transport ---------------- */

  function send(name, meta) {
    if (!CFG.endpoint) return; // No endpoint configured: counts stay local.
    var payload = {
      e: name,
      p: CFG.page || null,
      // Host only. Never a full URL, never a query string.
      h: meta && meta.host ? String(meta.host).toLowerCase().slice(0, 253) : null,
      // A site-internal identifier, not user data.
      l: meta && meta.linkId ? String(meta.linkId).slice(0, 64) : null,
    };
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(CFG.endpoint, new Blob([body], { type: 'application/json' }));
      } else {
        var x = new XMLHttpRequest();
        x.open('POST', CFG.endpoint, true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.send(body);
      }
    } catch (e) {
      /* A failed beacon must never surface to the reader. */
    }
  }

  /* ---------------- the counter ---------------- */

  function count(name, meta) {
    if (EVENTS.indexOf(name) === -1) return false; // Unknown events are dropped, not invented.
    state[name] = (state[name] || 0) + 1;
    write(state);
    send(name, meta);
    notify();
    return true;
  }

  // Only fire a given event once per page load, so a reload or a repeated
  // intersection does not inflate the count.
  function countOnce(name, meta) {
    if (!state.__fired) state.__fired = {};
    var pageKey = (CFG.page || '') + '|' + name;
    if (state.__fired[pageKey]) return false;
    state.__fired[pageKey] = true;
    return count(name, meta);
  }

  var listeners = [];
  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](snapshot()); } catch (e) {}
    }
  }
  function snapshot() {
    var o = { storage: storageAvailable, endpoint: CFG.endpoint || null, counts: {} };
    for (var i = 0; i < EVENTS.length; i++) o.counts[EVENTS[i]] = state[EVENTS[i]] || 0;
    return o;
  }

  /* ---------------- wiring ---------------- */

  // 1. page_view
  countOnce('page_view');

  // 2. disclosure_view — the strip is in the shell of every page, so this tests
  //    the compliance claim rather than assuming it. If it never fires somewhere,
  //    the disclosure is not actually being seen there.
  (function () {
    var strip = document.getElementById('disclosure-strip');
    if (!strip) return;
    if (!('IntersectionObserver' in window)) { countOnce('disclosure_view'); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        // Require most of the strip to be visible, not a single pixel of it.
        if (entries[i].isIntersecting && entries[i].intersectionRatio >= 0.5) {
          countOnce('disclosure_view');
          io.disconnect();
          break;
        }
      }
    }, { threshold: [0.5, 1] });
    io.observe(strip);
  })();

  // 3 + 4. outbound_click and affiliate_click — one delegated listener.
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;

    var url;
    try { url = new URL(a.href, window.location.href); } catch (e) { return; }

    // Same-origin navigations are not outbound.
    if (url.origin === window.location.origin) return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // The "open source" links in the footer and the source-register are
    // citations, not commercial intent. They are still outbound, so they count
    // as outbound_click, but they must never count as affiliate_click.
    count('outbound_click', { host: url.hostname, linkId: a.getAttribute('data-link-id') || null });

    if (isAffiliateHost(url.hostname)) {
      count('affiliate_click', {
        host: url.hostname,
        linkId: a.getAttribute('data-link-id') || a.getAttribute('data-asin') || null,
      });
    }
  }, true);

  /* ---------------- public surface ---------------- */

  window.DIYHOME3Analytics = {
    events: EVENTS.slice(),
    count: count,
    countOnce: countOnce,
    snapshot: snapshot,
    subscribe: function (fn) { listeners.push(fn); fn(snapshot()); },
    reset: function () {
      state = fresh();
      write(state);
      notify();
    },
    isAffiliateHost: isAffiliateHost,
  };
})();
