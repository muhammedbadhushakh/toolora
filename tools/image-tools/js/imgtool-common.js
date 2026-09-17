const IMAGE_TOOLS = [
  { id: 'compress', name: 'Image Compressor', file: '../image-compressor/index.html', status: 'live' },
  { id: 'resize', name: 'Image Resizer', file: 'image-resizer.html', status: 'live' },
  { id: 'crop', name: 'Crop Image', file: 'crop-image.html', status: 'live' },
  { id: 'rotate', name: 'Rotate Image', file: 'rotate-image.html', status: 'live' },
  { id: 'jpg2png', name: 'JPG → PNG', file: 'jpg-to-png.html', status: 'live' },
  { id: 'png2jpg', name: 'PNG → JPG', file: 'png-to-jpg.html', status: 'live' },
  { id: 'jpg2webp', name: 'JPG → WebP', file: 'jpg-to-webp.html', status: 'live' },
  { id: 'png2webp', name: 'PNG → WebP', file: 'png-to-webp.html', status: 'live' },
  { id: 'webp2jpg', name: 'WebP → JPG', file: 'webp-to-jpg.html', status: 'live' },
  { id: 'webp2png', name: 'WebP → PNG', file: 'webp-to-png.html', status: 'live' },
  { id: 'img2pdf', name: 'Image → PDF', file: '../image-to-pdf/image-to-pdf.html', status: 'live' },
  { id: 'bgremove', name: 'Background Remover', file: 'background-remover.html', status: 'live' },
  { id: 'upscale', name: 'Image Upscaler', file: 'image-upscaler.html', status: 'live' },
  { id: 'enhance', name: 'Image Enhancer', file: 'image-enhancer.html', status: 'live' },
  { id: 'blur', name: 'Image Blur', file: 'image-blur.html', status: 'live' },
  { id: 'filter', name: 'Image Filter', file: 'image-filter.html', status: 'live' },
  { id: 'addtext', name: 'Add Text to Image', file: 'add-text-to-image.html', status: 'live' },
  { id: 'watermark', name: 'Image Watermark', file: 'image-watermark.html', status: 'live' },
  { id: 'meme', name: 'Meme Generator', file: 'meme-generator.html', status: 'live' },
  { id: 'favicon', name: 'Favicon Generator', file: 'favicon-generator.html', status: 'live' },
];

function renderImageSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = IMAGE_TOOLS.map((t) => {
    const cls = t.id === current ? 'current' : '';
    return `<li><a class="${cls}" href="${t.file}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${t.name}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All Image Tools</h3><ul>${items}</ul>`;
}
document.addEventListener('DOMContentLoaded', renderImageSidebar);

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

function setupDropzone(zoneId, inputId, onFile) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { if (input.files[0]) onFile(input.files[0]); });
  ['dragenter', 'dragover'].forEach((evt) => zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach((evt) => zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove('drag'); }));
  zone.addEventListener('drop', (e) => { const file = e.dataTransfer.files[0]; if (file) onFile(file); });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve({ img, url });
    img.onerror = reject;
    img.src = url;
  });
}

function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}
