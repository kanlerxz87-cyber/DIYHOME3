/* Self-hosted analytics endpoint stub (Cloudflare Worker style).
   Deploy: create a Worker, paste this file, bind a KV namespace or R2 bucket
   as EVENTS, then set window.DIY_ANALYTICS_ENDPOINT in docs/assets/app.js
   to the Worker URL. Stores one JSON line per event. No IP, no UA, no cookies
   are stored — the payload is exactly what docs/assets/app.js sends:
   {event, path, product_id, ts} for the five events defined in
   docs/analytics.html. This file is a stub provided for the site owner;
   it is not deployed by the static site. */
const ALLOWED = new Set(["page_view", "product_view", "guide_view", "outbound_click", "search_submit"]);
export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("POST only", { status: 405 });
    let body;
    try { body = await request.json(); } catch { return new Response("bad json", { status: 400 }); }
    if (!ALLOWED.has(body.event)) return new Response("unknown event", { status: 400 });
    const line = JSON.stringify({
      event: body.event,
      path: String(body.path || "").slice(0, 200),
      product_id: body.product_id || null,
      ts: body.ts || new Date().toISOString(),
    });
    if (env.EVENTS && env.EVENTS.put) {
      await env.EVENTS.put(`evt:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`, line);
    }
    return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
  },
};
