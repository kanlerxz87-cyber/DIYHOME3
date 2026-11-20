/*
 * DIYHOME3 — progressive enhancement only.
 *
 * Every page on this site is complete HTML with no client-side rendering, so
 * nothing is hidden behind a script. This file adds four conveniences and each
 * one degrades to a readable static state if JavaScript is off:
 *
 *   1. the mobile navigation toggle
 *   2. the live event counter panel
 *   3. the commission calculator (which has no default rate, by design)
 *   4. the reader-capture form's honest "not configured" state
 */
(function () {
  'use strict';

  /* ---------------- 1. navigation ---------------- */
  (function () {
    var btn = document.querySelector('.nav-toggle');
    var links = document.getElementById('nav-links');
    if (!btn || !links) return;
    btn.setAttribute('aria-controls', 'nav-links');
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
  })();

  /* ---------------- 2. live event panel ---------------- */
  (function () {
    var host = document.getElementById('event-counts');
    var stateEl = document.getElementById('endpoint-state');
    if (!host || !window.DIYHOME3Analytics) return;

    var A = window.DIYHOME3Analytics;

    var DESCRIBE = {
      page_view: 'This browser loaded a page',
      disclosure_view: 'The disclosure strip was actually seen (50%+ visible)',
      outbound_click: 'A click left this site',
      affiliate_click: 'A click left this site toward Amazon',
      reader_capture: 'The capture form reached a configured endpoint',
    };

    function render(snap) {
      var rows = A.events.map(function (name) {
        var n = snap.counts[name] || 0;
        return '<div class="count-row"><span><code class="inline">' + name + '</code>' +
          '<br><span class="tiny muted">' + (DESCRIBE[name] || '') + '</span></span>' +
          '<b>' + n + '</b></div>';
      }).join('');
      host.innerHTML = rows +
        '<div class="count-row" style="border-top:1px solid var(--rule);margin-top:.4rem;padding-top:.5rem">' +
        '<span class="tiny muted">Storage</span><b class="tiny">' +
        (snap.storage ? 'localStorage' : 'memory only') + '</b></div>' +
        '<p class="tiny muted" style="margin:.5rem 0 0"><button type="button" class="btn btn-outline tiny" id="reset-counts">Reset these counters</button></p>';

      var rb = document.getElementById('reset-counts');
      if (rb) rb.addEventListener('click', function () { A.reset(); });

      if (stateEl) {
        stateEl.innerHTML = snap.endpoint
          ? 'Collector endpoint configured: <code class="inline">' + snap.endpoint + '</code>. Events are also sent there.'
          : '<strong>No collector endpoint is configured on this deployment.</strong> These counts exist only in this browser and are not this site\u2019s totals. See flag F-11.';
      }
    }

    A.subscribe(render);
  })();

  /* ---------------- 3. commission calculator ---------------- */
  (function () {
    var box = document.getElementById('commission-calc');
    if (!box) return;
    var asin = document.getElementById('cc-asin');
    var rate = document.getElementById('cc-rate');
    var price = document.getElementById('cc-price');
    var orders = document.getElementById('cc-orders');
    var per = document.getElementById('cc-per');
    var total = document.getElementById('cc-total');
    var note = document.getElementById('cc-note');

    function money(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); }

    function syncPriceFromAsin() {
      var opt = asin.options[asin.selectedIndex];
      if (opt && opt.getAttribute('data-price')) price.value = opt.getAttribute('data-price');
    }

    function calc() {
      var r = parseFloat(rate.value);
      var p = parseFloat(price.value);
      var o = parseInt(orders.value, 10);

      // No default rate. Nothing renders until one is supplied. This is the
      // whole point: the rate is the one number this build could not verify.
      if (!isFinite(r) || r <= 0 || !isFinite(p) || p <= 0) {
        per.textContent = '\u2014';
        total.textContent = '\u2014';
        note.innerHTML = 'Enter a rate to see anything. This calculator has no default rate and publishes no forecast.';
        return;
      }

      var perOrder = p * (r / 100);
      per.textContent = money(perOrder);

      if (isFinite(o) && o > 0) {
        total.textContent = money(perOrder * o);
        note.innerHTML = 'Arithmetic on inputs you supplied: ' + money(p) + ' \u00d7 ' + r + '% \u00d7 ' + o +
          ' order' + (o === 1 ? '' : 's') +
          '. This is an upper bound, not an expectation \u2014 Amazon defines Qualifying Revenue as net of shipping, taxes, fees, credits, rebates and bad debt, and disqualifies purchases arising from improperly formatted links.';
      } else {
        total.textContent = '\u2014';
        note.innerHTML = 'Per-order figure shown. Enter a reported-order count to total it. Only use a count taken from an authorised first-party report \u2014 never an estimate.';
      }
    }

    asin.addEventListener('change', function () { syncPriceFromAsin(); calc(); });
    [rate, price, orders].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  })();

  /* ---------------- 4. reader capture: honest states ---------------- */
  (function () {
    var form = document.getElementById('capture-form');
    if (!form) return;
    var state = document.getElementById('capture-state');
    var email = document.getElementById('capture-email');
    var endpoint = (window.DIYHOME3 && window.DIYHOME3.endpoint) || null;

    // With no endpoint the form is inert. It says so instead of pretending.
    if (!endpoint) {
      form.querySelector('button[type="submit"]').setAttribute('aria-disabled', 'true');
      form.querySelector('button[type="submit"]').textContent = 'Not available';
      if (email) email.setAttribute('disabled', 'disabled');
      if (state) {
        state.className = 'formstate';
        state.style.background = 'var(--warn-soft)';
        state.style.color = 'var(--warn)';
        state.textContent = 'Capture is not configured on this deployment. Nothing you type here is stored or sent anywhere.';
      }
      form.addEventListener('submit', function (ev) { ev.preventDefault(); });
      return;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var value = (email.value || '').trim();
      if (!value || value.indexOf('@') === -1) {
        state.className = 'formstate';
        state.style.background = 'var(--bad-soft)';
        state.style.color = 'var(--bad)';
        state.textContent = 'That does not look like an email address. Nothing was sent.';
        return;
      }
      try {
        var body = JSON.stringify({ email: value, page: (window.DIYHOME3 && window.DIYHOME3.page) || null });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint.replace(/\/collect\/?$/, '/subscribe'), new Blob([body], { type: 'application/json' }));
        } else {
          var x = new XMLHttpRequest();
          x.open('POST', endpoint.replace(/\/collect\/?$/, '/subscribe'), true);
          x.setRequestHeader('Content-Type', 'application/json');
          x.send(body);
        }
        state.className = 'formstate';
        state.style.background = 'var(--ok-soft)';
        state.style.color = 'var(--ok)';
        state.textContent = 'Submitted to the configured endpoint. Confirm delivery in the collector log before treating this as working.';
        email.value = '';
        // Only counted once the beacon was actually dispatched, so this event can
        // never over-report a capture that was silently dropped.
        if (window.DIYHOME3Analytics) window.DIYHOME3Analytics.count('reader_capture');
      } catch (e) {
        state.className = 'formstate';
        state.style.background = 'var(--bad-soft)';
        state.style.color = 'var(--bad)';
        state.textContent = 'The submission could not be sent. Nothing was stored.';
      }
    });
  })();
})();
