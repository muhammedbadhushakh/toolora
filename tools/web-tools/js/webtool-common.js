const WEB_TOOLS = [
  { id: 'iplookup', name: 'IP Lookup', file: 'ip-lookup.html' },
  { id: 'dnslookup', name: 'DNS Lookup', file: 'dns-lookup.html' },
  { id: 'dnsprop', name: 'DNS Propagation Checker', file: 'dns-propagation-checker.html' },
  { id: 'httpstatus', name: 'HTTP Status Checker', file: 'http-status-checker.html' },
  { id: 'seochecker', name: 'Website SEO Checker', file: 'website-seo-checker.html' },
];

function renderWebSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = WEB_TOOLS.map((t) => {
    const cls = t.id === current ? 'current' : '';
    return `<li><a class="${cls}" href="${t.file}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${t.name}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All Web &amp; SEO Tools</h3><ul>${items}</ul>`;
}
document.addEventListener('DOMContentLoaded', renderWebSidebar);

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = orig), 1400);
    }
  });
}

function showStatus(elId, message, ok = true) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = message;
  el.className = 'status-msg show ' + (ok ? 'ok' : 'error');
}
function hideStatus(elId) {
  const el = document.getElementById(elId);
  if (el) el.classList.remove('show');
}

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Normalizes user input into a full https:// URL when no scheme is given.
function normalizeUrl(input) {
  let v = (input || '').trim();
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try {
    return new URL(v).toString();
  } catch (e) {
    return '';
  }
}

// Basic IPv4 / IPv6 sanity check (not exhaustive, just for quick UX feedback).
function looksLikeIp(str) {
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const v6 = /^[0-9a-fA-F:]+:[0-9a-fA-F:]*$/;
  return v4.test(str) || v6.test(str);
}

// Wraps allorigins.win's /get endpoint, the public CORS proxy this category
// uses to fetch third-party pages/headers directly from the browser.
async function fetchViaProxy(targetUrl) {
  const proxied = 'https://api.allorigins.win/get?url=' + encodeURIComponent(targetUrl);
  const res = await fetch(proxied);
  if (!res.ok) throw new Error('Proxy request failed (' + res.status + ')');
  return res.json();
}

const HTTP_STATUS_TEXT = {
  100: 'Continue', 101: 'Switching Protocols',
  200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content', 206: 'Partial Content',
  301: 'Moved Permanently', 302: 'Found', 303: 'See Other', 304: 'Not Modified',
  307: 'Temporary Redirect', 308: 'Permanent Redirect',
  400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
  405: 'Method Not Allowed', 408: 'Request Timeout', 409: 'Conflict', 410: 'Gone',
  429: 'Too Many Requests',
  500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway',
  503: 'Service Unavailable', 504: 'Gateway Timeout',
};

const DNS_TYPE_NAMES = {
  1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR', 15: 'MX', 16: 'TXT',
  28: 'AAAA', 33: 'SRV', 257: 'CAA',
};

const DNS_STATUS_TEXT = {
  0: 'NOERROR — success', 1: 'FORMERR — format error', 2: 'SERVFAIL — server failure',
  3: 'NXDOMAIN — domain does not exist', 4: 'NOTIMP — not implemented', 5: 'REFUSED — query refused',
};
