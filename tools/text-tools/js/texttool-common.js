const TEXT_TOOLS = [
  { id: 'wordcount', name: 'Word Counter', file: 'word-counter.html' },
  { id: 'charcount', name: 'Character Counter', file: 'character-counter.html' },
  { id: 'sentcount', name: 'Sentence Counter', file: 'sentence-counter.html' },
  { id: 'case', name: 'Case Converter', file: 'case-converter.html' },
  { id: 'dedupe', name: 'Remove Duplicate Lines', file: 'remove-duplicate-lines.html' },
  { id: 'sort', name: 'Text Sorter', file: 'text-sorter.html' },
  { id: 'reverse', name: 'Text Reverser', file: 'text-reverser.html' },
  { id: 'lorem', name: 'Lorem Ipsum Generator', file: 'lorem-ipsum-generator.html' },
  { id: 'clean', name: 'Text Cleaner', file: 'text-cleaner.html' },
  { id: 'readability', name: 'Readability Checker', file: 'readability-checker.html' },
];

function renderTextSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = TEXT_TOOLS.map((t) => {
    const cls = t.id === current ? 'current' : '';
    return `<li><a class="${cls}" href="${t.file}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${t.name}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All Text Tools</h3><ul>${items}</ul>`;
}
document.addEventListener('DOMContentLoaded', renderTextSidebar);

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 1400);
    }
  });
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
