/* Self-hosted aggregate analytics Worker stub (Cloudflare Worker compatible).
   Matches analytics/server.py, assets/analytics.js, and analytics/targets.json.
   Not deployed on GitHub Pages; intended only for an approved HTTPS editorial host.

   Required Worker bindings / secrets:
   - env.ANALYTICS_ORIGIN : exact allowed HTTPS origin (e.g. "https://example.com")
   - env.ANALYTICS_IMPORT_TOKEN : secret bearer token for POST /api/reports
   - env.TARGETS_JSON : JSON string from analytics/targets.json
   - env.COUNTS_KV : optional KV namespace storing aggregate UTC day:event:target totals

   Stores aggregate counts only — no IP addresses, User-Agent strings, cookies,
   referrers, full URL paths, or free-text queries. */

const BROWSER_EVENTS = new Set(["page_view", "guide_view", "outbound_click", "feed_click"]);
const SLUG_RE = /^[a-z0-9-]{1,72}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function timingSafeEqualStr(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/healthz") {
      return new Response("ok", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    if (request.method !== "POST" || (url.pathname !== "/api/events" && url.pathname !== "/api/reports")) {
      return new Response("not found", { status: 404 });
    }

    const isReport = url.pathname === "/api/reports";
    if (isReport) {
      const expected = env.ANALYTICS_IMPORT_TOKEN ? `Bearer ${env.ANALYTICS_IMPORT_TOKEN}` : "";
      const provided = request.headers.get("Authorization") || "";
      if (!expected || !timingSafeEqualStr(provided, expected)) {
        return new Response("forbidden", { status: 403 });
      }
    } else if (!env.ANALYTICS_ORIGIN || request.headers.get("Origin") !== env.ANALYTICS_ORIGIN) {
      return new Response("forbidden", { status: 403 });
    }

    const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim();
    if (contentType !== "application/json") return new Response("bad content-type", { status: 400 });

    const raw = await request.text();
    if (!raw.length || raw.length > 512) return new Response("bad length", { status: 400 });

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return new Response("bad json", { status: 400 });
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return new Response("bad payload", { status: 400 });
    }

    let targets;
    try {
      targets = JSON.parse(env.TARGETS_JSON || "{}");
    } catch {
      return new Response("misconfigured targets", { status: 500 });
    }

    const keys = Object.keys(payload).sort().join(",");
    const today = new Date().toISOString().slice(0, 10);
    let event;
    let target;
    let day = today;
    let count = 1;

    if (isReport) {
      if (keys !== "count,day,event,report_ref,target") return new Response("bad fields", { status: 400 });
      event = payload.event;
      target = payload.target;
      day = payload.day;
      count = payload.count;
      const ref = payload.report_ref;
      if (
        event !== "reported_order" ||
        typeof target !== "string" || !SLUG_RE.test(target) ||
        typeof day !== "string" || !DAY_RE.test(day) || day > today ||
        !Number.isInteger(count) || count < 0 || count > 1000000 ||
        typeof ref !== "string" || !SLUG_RE.test(ref) ||
        !Array.isArray(targets.reported_order) || !targets.reported_order.includes(target)
      ) {
        return new Response("invalid report", { status: 400 });
      }
      if (env.COUNTS_KV) {
        const importKey = `imp:${ref}:${day}:${target}`;
        if (await env.COUNTS_KV.get(importKey)) return new Response("duplicate import", { status: 409 });
        await env.COUNTS_KV.put(importKey, "1");
      }
    } else {
      if (keys !== "event,target") return new Response("bad fields", { status: 400 });
      event = payload.event;
      target = payload.target;
      if (
        typeof event !== "string" || !BROWSER_EVENTS.has(event) ||
        typeof target !== "string" || !SLUG_RE.test(target) ||
        !Array.isArray(targets[event]) || !targets[event].includes(target)
      ) {
        return new Response("invalid event", { status: 400 });
      }
    }

    if (env.COUNTS_KV) {
      const countKey = `cnt:${day}:${event}:${target}`;
      const prev = Number.parseInt((await env.COUNTS_KV.get(countKey)) || "0", 10) || 0;
      await env.COUNTS_KV.put(countKey, String(prev + count));
    }

    return new Response(null, {
      status: 204,
      headers: isReport ? {} : { "Access-Control-Allow-Origin": env.ANALYTICS_ORIGIN, "Vary": "Origin" },
    });
  },
};
