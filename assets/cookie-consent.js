(function () {
  var STORAGE_KEY = 'tcc-consent'; // 'granted' | 'denied'

  // ---- Google Consent Mode v2 defaults ----
  // Must run before any ad/analytics tag loads. Defaults to "denied" until
  // the visitor makes a choice, then is updated below. Safe no-op if no
  // Google tag is ever loaded on the page.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStored(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch (e) {}
  }

  function applyConsent(choice) {
    var granted = choice === 'granted';
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
    });
    window.dispatchEvent(new CustomEvent('tcc:consent', { detail: { choice: choice } }));
  }

  function buildBanner() {
    var el = document.createElement('div');
    el.className = 'tcc-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie consent');
    el.innerHTML =
      '<div class="tcc-inner">' +
        '<p class="tcc-text"><strong>We use cookies.</strong> Toolrua uses cookies for basic site functionality and, if you agree, to show relevant ads. See our <a href="/privacy-policy.html">Privacy Policy</a> for details.</p>' +
        '<div class="tcc-actions">' +
          '<button type="button" class="tcc-btn tcc-decline">Decline</button>' +
          '<button type="button" class="tcc-btn tcc-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);

    el.querySelector('.tcc-accept').addEventListener('click', function () {
      setStored('granted');
      applyConsent('granted');
      el.classList.remove('show');
    });
    el.querySelector('.tcc-decline').addEventListener('click', function () {
      setStored('denied');
      applyConsent('denied');
      el.classList.remove('show');
    });
    return el;
  }

  function init() {
    var stored = getStored();
    if (stored === 'granted' || stored === 'denied') {
      applyConsent(stored);
      return;
    }
    var el = buildBanner();
    // Small delay so it doesn't flash before the page has painted.
    setTimeout(function () { el.classList.add('show'); }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
