/* DIY Home Upgrades — privacy-preserving analytics (no cookies, no fingerprinting, no PII)
 *
 * Five events: page_view, outbound_click, guide_read, newsletter_signup, site_search.
 * Sends a beacon to the self-hosted endpoint (/api/events) when available;
 * otherwise falls back to localStorage counters so the site works on static hosting.
 * See data/events.md and server/analytics-server.py for the endpoint contract.
 */
(function () {
  "use strict";
  var ENDPOINT = "/api/events";
  var LS_KEY = "diyhome3_event_counts_v1";

  function now() { return new Date().toISOString(); }

  function loadCounts() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveCount(event) {
    try {
      var c = loadCounts();
      c[event] = (c[event] || 0) + 1;
      c._last = now();
      localStorage.setItem(LS_KEY, JSON.stringify(c));
    } catch (e) { /* storage unavailable — ignore */ }
  }

  function track(event, data) {
    var payload = {
      event: event,
      path: location.pathname,
      referrer: document.referrer || "",
      ts: now(),
      data: data || {}
    };
    saveCount(event);
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      }
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true
      }).catch(function () { /* endpoint offline — local count already saved */ });
    } catch (e) { /* ignore */ }
  }

  // 1) page_view — once per page load
  track("page_view", { title: document.title });

  // 2) outbound_click — every sponsored Amazon link (data-event="outbound_click")
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[data-event="outbound_click"]') : null;
    if (!a) return;
    track("outbound_click", {
      asin: a.getAttribute("data-asin") || "",
      href: a.href
    });
  }, true);

  // 3) guide_read — scrolled 75% AND spent 30s on a guide page
  var guide = document.querySelector("article.guide");
  if (guide) {
    var start = Date.now();
    var fired = false;
    function check() {
      if (fired) return;
      var h = document.documentElement;
      var pct = (h.scrollTop + h.clientHeight) / Math.max(1, h.scrollHeight);
      if (pct >= 0.75 && (Date.now() - start) >= 30000) {
        fired = true;
        track("guide_read", { seconds: Math.round((Date.now() - start) / 1000) });
      }
    }
    document.addEventListener("scroll", check, { passive: true });
    setInterval(check, 5000);
  }

  // 4) newsletter_signup — reader capture form
  document.addEventListener("submit", function (e) {
    var form = e.target.closest ? e.target.closest('form[data-event="newsletter_signup"]') : null;
    if (!form) return;
    track("newsletter_signup", {});
  });

  // 5) site_search — search box submissions
  document.addEventListener("submit", function (e) {
    var form = e.target.closest ? e.target.closest('form[data-event="site_search"]') : null;
    if (!form) return;
    var input = form.querySelector('input[name="q"]');
    track("site_search", { query: input ? input.value.slice(0, 120) : "" });
  });

  // Expose for debugging / dashboard (counts only, no PII)
  window.__diyhome3_counts = loadCounts;
})();
