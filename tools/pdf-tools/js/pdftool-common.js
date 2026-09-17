const PDF_TOOLS = [
  { id: 'editor', name: 'PDF Editor', file: '../pdf-editor/index.html', status: 'live' },
  { id: 'viewer', name: 'PDF Viewer', file: 'pdf-viewer.html', status: 'live' },
  { id: 'pdf2word', name: 'PDF → Word', file: '../pdf-to-word/index.html', status: 'live' },
  { id: 'word2pdf', name: 'Word → PDF', file: '../word-to-pdf/index.html', status: 'live' },
  { id: 'pdf2excel', name: 'PDF → Excel', file: '../pdf-to-excel/index.html', status: 'live' },
  { id: 'excel2pdf', name: 'Excel → PDF', file: '../excel-to-pdf/index.html', status: 'live' },
  { id: 'pdf2ppt', name: 'PDF → PowerPoint', file: '../pdf-to-ppt/index.html', status: 'live' },
  { id: 'ppt2pdf', name: 'PowerPoint → PDF', file: '../ppt-to-pdf/index.html', status: 'live' },
  { id: 'pdf2jpg', name: 'PDF → JPG', file: '../pdf-to-jpg/pdf-to-jpg.html', status: 'live' },
  { id: 'jpg2pdf', name: 'JPG → PDF', file: '../image-to-pdf/image-to-pdf.html', status: 'live' },
  { id: 'merge', name: 'Merge PDF', file: '../pdf-merger/pdf-merger.html', status: 'live' },
  { id: 'split', name: 'Split PDF', file: 'split-pdf.html', status: 'live' },
  { id: 'compress', name: 'Compress PDF', file: 'compress-pdf.html', status: 'live' },
  { id: 'rotate', name: 'Rotate PDF', file: '../PDF-Page-Rotator/index.html', status: 'live' },
  { id: 'extract', name: 'Extract PDF Pages', file: 'extract-pages.html', status: 'live' },
  { id: 'delete', name: 'Delete PDF Pages', file: 'delete-pages.html', status: 'live' },
  { id: 'reorder', name: 'Reorder PDF Pages', file: 'reorder-pages.html', status: 'live' },
  { id: 'watermark', name: 'PDF Watermark', file: 'pdf-watermark.html', status: 'live' },
  { id: 'signature', name: 'PDF Signature', file: 'pdf-signature.html', status: 'live' },
];

// Capture this script's own URL synchronously — document.currentScript is only
// available during the script's initial execution, not later inside the
// DOMContentLoaded handler below.
const PDFTOOL_COMMON_SRC = document.currentScript
  ? document.currentScript.src
  : (document.querySelector('script[src*="pdftool-common.js"]') || {}).src;

// Resolve a PDF_TOOLS entry's file into a correct absolute URL, regardless of
// which folder the calling page lives in.
function resolvePdfToolHref(file) {
  return new URL(file, new URL('../', PDFTOOL_COMMON_SRC)).href;
}

function renderPdfSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = PDF_TOOLS.map((t) => {
    const cls = t.id === current ? 'current' : '';
    const soon = t.status === 'soon' ? ' <span style="opacity:.55;font-weight:500;">(soon)</span>' : '';
    const href = resolvePdfToolHref(t.file);
    return `<li><a class="${cls}" href="${href}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${t.name}${soon}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All PDF Tools</h3><ul>${items}</ul>`;
}
document.addEventListener('DOMContentLoaded', renderPdfSidebar);

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Wires a dropzone + hidden file input.
 * onFile(File) is called once a valid PDF is chosen/dropped.
 */
function setupDropzone(zoneId, inputId, onFile, accept = 'application/pdf') {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    if (input.files[0]) onFile(input.files[0]);
  });
  ['dragenter', 'dragover'].forEach((evt) => {
    zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add('drag'); });
  });
  ['dragleave', 'drop'].forEach((evt) => {
    zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove('drag'); });
  });
  zone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  });
}
