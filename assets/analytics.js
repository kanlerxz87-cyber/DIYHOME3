(() => {
  const { analytics, page, guide } = document.documentElement.dataset;
  if (!analytics || /github\.io$/i.test(location.hostname) || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  const record = (event, target) => {
    fetch('/api/events', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({event, target}), credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true }).catch(() => {});
  };
  record('page_view', page);
  if (guide) record('guide_view', guide);
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-event][data-target]');
    if (link) record(link.dataset.event, link.dataset.target);
  });
})();
