const CONVERTERS = [
  { id: 'unit', name: 'Unit Converter', file: 'unit-converter.html' },
  { id: 'length', name: 'Length Converter', file: 'length-converter.html' },
  { id: 'weight', name: 'Weight Converter', file: 'weight-converter.html' },
  { id: 'temperature', name: 'Temperature Converter', file: 'temperature-converter.html' },
  { id: 'area', name: 'Area Converter', file: 'area-converter.html' },
  { id: 'volume', name: 'Volume Converter', file: 'volume-converter.html' },
  { id: 'speed', name: 'Speed Converter', file: 'speed-converter.html' },
  { id: 'timezone', name: 'Time Zone Converter', file: 'timezone-converter.html' },
  { id: 'currency', name: 'Currency Converter', file: 'currency-converter.html' },
  { id: 'datastorage', name: 'Data Storage Converter', file: 'data-storage-converter.html' },
  { id: 'numwords', name: 'Number → Words', file: 'number-to-words.html' },
  { id: 'roman', name: 'Roman Numeral Converter', file: 'roman-numeral-converter.html' },
  { id: 'binary', name: 'Binary Converter', file: 'binary-converter.html' },
  { id: 'decimal', name: 'Decimal Converter', file: 'decimal-converter.html' },
  { id: 'hex', name: 'Hex Converter', file: 'hex-converter.html' },
];

function renderConvSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = CONVERTERS.map((c) => {
    const cls = c.id === current ? 'current' : '';
    return `<li><a class="${cls}" href="${c.file}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${c.name}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All Converters</h3><ul>${items}</ul>`;
}
document.addEventListener('DOMContentLoaded', renderConvSidebar);

function fmt(n, decimals = 6) {
  if (!isFinite(n)) return '—';
  const r = Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return Number(r).toLocaleString('en-US', { maximumFractionDigits: decimals });
}
function showResult(boxId) {
  document.getElementById(boxId).classList.add('show');
}
