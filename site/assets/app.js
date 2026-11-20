/* No persistent visitor identifiers. Static Pages remains disabled without an endpoint. */
(() => {
  'use strict';
  const body = document.body;
  const endpoint = body.dataset.analyticsEndpoint;
  const allowed = new Set(['page_view', 'guide_view', 'product_view', 'outbound_click', 'feed_click']);
  function event(name, record = '') {
    if (!endpoint || !allowed.has(name) || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
    const payload = JSON.stringify({event: name, page: body.dataset.page, record});
    fetch(endpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: payload,
      credentials: 'omit', keepalive: true, referrerPolicy: 'no-referrer'}).catch(() => {});
  }
  event('page_view');
  if (body.dataset.pageType === 'guide') event('guide_view');
  if (body.dataset.pageType === 'product') event('product_view');
  document.querySelectorAll('[data-event]').forEach(a => a.addEventListener('click', () => event(a.dataset.event, a.dataset.record || '')));
  // Evidence links to product listings are also counted, without collecting their destination URL.
  document.querySelectorAll('a[rel~="sponsored"]').forEach(a => {
    if (a.dataset.event) return;
    const match = /\/dp\/([A-Z0-9]{10})/.exec(a.href);
    const shortRecords = {'B0hmGG4m2': 'P01', 'B03QDuGdo': 'P02', 'B0hpD2JGQ': 'P03'};
    const shortId = shortRecords[a.href.split('/').pop()];
    if (match || shortId) a.addEventListener('click', () => event('outbound_click', match ? match[1] : shortId));
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    let count = 0;
    document.querySelectorAll('.product-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    });
    const status = document.getElementById('filter-status');
    if (status) status.textContent = `${count} ${count === 1 ? 'find' : 'finds'} shown`;
  }));
  document.querySelectorAll('.print-button').forEach(b => b.addEventListener('click', () => window.print()));
  document.addEventListener('click', event => document.querySelectorAll('.workspace-nav[open]').forEach(d => { if (!d.contains(event.target)) d.open = false; }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelectorAll('.workspace-nav[open]').forEach(d => {d.open = false; d.querySelector('summary').focus();}); });
})();
