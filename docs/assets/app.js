/* DIY Home Upgrades — privacy-preserving measurement.
   Five defined events (see docs/analytics.html and analytics/README.md):
     1. page_view       — a page on this site is viewed
     2. product_view    — a product card becomes visible
     3. guide_view      — a guide page is viewed
     4. outbound_click  — a sponsored outbound product link is clicked
     5. search_submit   — the on-site product search/filter is used (query text is NOT stored)
   Payload contains only: event name, page path, product record ID (where relevant),
   and an ISO timestamp. No cookies, no fingerprinting, no IP storage, no query text.
   If window.DIY_ANALYTICS_ENDPOINT is set (self-hosted endpoint, see analytics/),
   events are POSTed there; otherwise they are counted locally in this browser only. */
(function () {
  "use strict";
  var ENDPOINT = window.DIY_ANALYTICS_ENDPOINT || "";
  var KEY = "diyhome3_event_counts_v1";
  function localCount(event) {
    try {
      var raw = localStorage.getItem(KEY);
      var counts = raw ? JSON.parse(raw) : {};
      counts[event] = (counts[event] || 0) + 1;
      localStorage.setItem(KEY, JSON.stringify(counts));
      renderLocalCounts(counts);
    } catch (e) { /* storage unavailable: counting is best-effort only */ }
  }
  function renderLocalCounts(counts) {
    var el = document.getElementById("local-event-counts");
    if (!el) return;
    var names = ["page_view", "product_view", "guide_view", "outbound_click", "search_submit"];
    el.innerHTML = names.map(function (n) {
      return "<tr><td><code>" + n + "</code></td><td>" + (counts[n] || 0) + "</td></tr>";
    }).join("");
  }
  function track(event, productId) {
    var payload = {
      event: event,
      path: location.pathname,
      product_id: productId || null,
      ts: new Date().toISOString()
    };
    if (ENDPOINT) {
      try {
        var body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
          navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
        } else {
          fetch(ENDPOINT, { method: "POST", body: body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(function () {});
        }
      } catch (e) { /* never block navigation for measurement */ }
    } else {
      localCount(event);
    }
  }
  window.DIYTrack = track;
  document.addEventListener("DOMContentLoaded", function () {
    renderLocalCounts((function () { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } })());
    track(document.body && document.body.dataset.pageType === "guide" ? "guide_view" : "page_view");
    /* product_view: count each product card once when it first becomes visible */
    var cards = document.querySelectorAll("[data-product-id]");
    if ("IntersectionObserver" in window && cards.length) {
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var id = en.target.getAttribute("data-product-id");
          if (en.isIntersecting && id && !seen[id]) { seen[id] = 1; track("product_view", id); io.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      cards.forEach(function (c) { io.observe(c); });
    }
    /* outbound_click: every sponsored outbound product link */
    document.querySelectorAll('a[data-outbound="product"]').forEach(function (a) {
      a.addEventListener("click", function () { track("outbound_click", a.getAttribute("data-product-id") || null); });
    });
    /* search_submit: filters/search on the shop front page (no query text recorded) */
    var search = document.getElementById("product-search");
    if (search) {
      search.addEventListener("change", function () { track("search_submit"); });
      var form = document.getElementById("shop-tools");
      if (form) form.addEventListener("submit", function (e) { e.preventDefault(); track("search_submit"); filterCards(); });
      search.addEventListener("input", filterCards);
    }
    var cat = document.getElementById("category-filter");
    if (cat) cat.addEventListener("change", function () { track("search_submit"); filterCards(); });
    function filterCards() {
      var q = (search ? search.value : "").toLowerCase();
      var c = cat ? cat.value : "";
      document.querySelectorAll("[data-product-id]").forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var okQ = !q || text.indexOf(q) !== -1;
        var okC = !c || card.getAttribute("data-category") === c;
        card.style.display = okQ && okC ? "" : "none";
      });
    }
  });
})();
