const DEV_TOOLS = [
  { id: 'jsonformat', name: 'JSON Formatter & Validator', file: 'json-formatter.html' },
  { id: 'jsoncsv', name: 'JSON ↔ CSV Converter', file: 'json-csv-converter.html' },
  { id: 'jsonyaml', name: 'JSON ↔ YAML Converter', file: 'json-yaml-converter.html' },
  { id: 'xmlformat', name: 'XML Formatter', file: 'xml-formatter.html' },
  { id: 'base64', name: 'Base64 Encoder/Decoder', file: 'base64.html' },
  { id: 'urlencode', name: 'URL Encoder/Decoder', file: 'url-encoder-decoder.html' },
  { id: 'jwt', name: 'JWT Decoder', file: 'jwt-decoder.html' },
  { id: 'hashgen', name: 'Hash Generator', file: 'hash-generator.html' },
  { id: 'uuidgen', name: 'UUID Generator', file: 'uuid-generator.html' },
  { id: 'regex', name: 'Regex Tester', file: 'regex-tester.html' },
  { id: 'codebeautify', name: 'Code Beautifier', file: 'code-beautifier.html' },
  { id: 'codeminify', name: 'Code Minifier', file: 'code-minifier.html' },
  { id: 'cron', name: 'Cron Expression Parser', file: 'cron-expression-parser.html' },
];

function renderDevSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = DEV_TOOLS.map((t) => {
    const cls = t.id === current ? 'current' : '';
    return `<li><a class="${cls}" href="${t.file}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${t.name}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All Developer Tools</h3><ul>${items}</ul>`;
}
document.addEventListener('DOMContentLoaded', renderDevSidebar);

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
