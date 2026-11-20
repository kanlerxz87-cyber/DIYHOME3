(function () {
  const ANALYTICS_KEY = "diyhome3_analytics_events";
  const CLICKS_KEY = "diyhome3_outbound_clicks";

  function getEvents() {
    try {
      return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function recordEvent(eventName, detail = {}) {
    const events = getEvents();
    events.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      page: window.location.pathname.split("/").pop() || "index.html",
      detail
    });
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-200)));
    renderAnalyticsSummary();
  }

  function getClicks() {
    try {
      return JSON.parse(localStorage.getItem(CLICKS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function incrementClick(productId, url) {
    const clicks = getClicks();
    clicks[productId] = (clicks[productId] || 0) + 1;
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
    recordEvent("outbound_click", { product_id: productId, url });
  }

  function renderAnalyticsSummary() {
    const el = document.getElementById("analytics-summary");
    if (!el) return;
    const events = getEvents();
    const counts = {
      page_view: 0,
      guide_read: 0,
      outbound_click: 0,
      disclosure_view: 0,
      filter_change: 0
    };
    events.forEach((e) => {
      if (Object.prototype.hasOwnProperty.call(counts, e.event)) {
        counts[e.event] += 1;
      }
    });
    el.innerHTML = Object.entries(counts)
      .map(
        ([k, v]) =>
          `<div class="card"><div class="meta">${k}</div><strong style="font-size:1.5rem">${v}</strong></div>`
      )
      .join("");
  }

  function cell(val) {
    if (val === null || val === undefined || val === "") {
      return `<span class="blank-cell">— (unverified)</span>`;
    }
    return String(val);
  }

  async function loadProducts() {
    try {
      const res = await fetch("data/products.json");
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function bindSponsoredLinks() {
    document.querySelectorAll("a[data-product-id]").forEach((a) => {
      a.addEventListener("click", () => {
        incrementClick(a.getAttribute("data-product-id"), a.getAttribute("href"));
      });
    });
  }

  async function init() {
    recordEvent("page_view");
    if (document.querySelector(".disclosure-strip")) {
      recordEvent("disclosure_view");
    }

    const data = await loadProducts();
    if (data && data.products) {
      const clicks = getClicks();

      // Render front-page product cards if present
      const frontGrid = document.getElementById("front-products");
      if (frontGrid) {
        const unique = data.products.filter((p) => !p.duplicate_of);
        frontGrid.innerHTML = unique
          .map(
            (p) => `
          <article class="card">
            <div class="meta">${p.id} · ${p.category} · <span class="badge badge-warn">${p.verification_status}</span></div>
            <h3>${p.title || "Product Pending Verification"}</h3>
            <p class="meta">Tracking ID: <code>${p.tracking_id}</code> · Compliance: <span class="badge badge-muted">${p.compliance_status}</span></p>
            <p style="font-size:0.9rem;color:var(--muted);">${p.notes}</p>
            <a class="btn btn-primary" href="${p.submitted_link}" rel="sponsored noopener noreferrer" target="_blank" data-product-id="${p.id}">
              Inspect Submitted Link (Sponsored)
            </a>
          </article>`
          )
          .join("");
      }

      // Render dashboard product-intent table if present
      const dashBody = document.getElementById("dashboard-products-body");
      if (dashBody) {
        dashBody.innerHTML = data.products
          .map(
            (p) => `
          <tr>
            <td><strong>${p.id}</strong>${p.duplicate_of ? `<br><span class="badge badge-warn">Duplicate of ${p.duplicate_of}</span>` : ""}</td>
            <td><a href="${p.submitted_link}" rel="sponsored noopener noreferrer" target="_blank" data-product-id="${p.id}">${p.submitted_link}</a></td>
            <td>${cell(p.intended_asin)}</td>
            <td>${cell(p.official_listing_url)}</td>
            <td>${cell(p.observed_redirect_target)}</td>
            <td>${cell(p.confirmation_date)}</td>
            <td>${cell(p.source)}</td>
            <td><span class="badge badge-warn">${p.verification_status}</span></td>
            <td><span class="badge badge-muted">${p.compliance_status}</span></td>
            <td>${clicks[p.id] || 0}</td>
          </tr>`
          )
          .join("");
      }

      // Render flagged-for-review table if present
      const flaggedBody = document.getElementById("flagged-body");
      if (flaggedBody) {
        flaggedBody.innerHTML = data.products
          .map(
            (p) => `
          <tr>
            <td><strong>${p.id}</strong></td>
            <td><a href="${p.submitted_link}" rel="sponsored noopener noreferrer" target="_blank" data-product-id="${p.id}">${p.submitted_link}</a></td>
            <td><span class="badge badge-warn">${p.verification_status}</span></td>
            <td><span class="badge badge-muted">${p.compliance_status}</span></td>
            <td>${p.duplicate_of ? `Duplicate of ${p.duplicate_of}` : "Unverified external link"}</td>
            <td>${p.notes}</td>
          </tr>`
          )
          .join("");
      }

      bindSponsoredLinks();
    }

    // Guide read tracking
    document.querySelectorAll("[data-guide-id]").forEach((el) => {
      el.addEventListener("click", () => {
        recordEvent("guide_read", { guide_id: el.getAttribute("data-guide-id") });
      });
    });

    // Filter change tracking
    const filterEl = document.getElementById("status-filter");
    if (filterEl) {
      filterEl.addEventListener("change", (e) => {
        recordEvent("filter_change", { value: e.target.value });
      });
    }

    // Export analytics button
    const exportBtn = document.getElementById("export-analytics");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const blob = new Blob(
          [JSON.stringify({ events: getEvents(), clicks: getClicks() }, null, 2)],
          { type: "application/json" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diyhome3-analytics.json";
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    renderAnalyticsSummary();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
