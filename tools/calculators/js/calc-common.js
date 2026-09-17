const CALCULATORS = [
  { id: 'basic', name: 'Basic Calculator', file: 'basic-calculator.html' },
  { id: 'scientific', name: 'Scientific Calculator', file: 'scientific-calculator.html' },
  { id: 'percentage', name: 'Percentage Calculator', file: 'percentage-calculator.html' },
  { id: 'gst', name: 'GST Calculator', file: 'gst-calculator.html' },
  { id: 'discount', name: 'Discount Calculator', file: 'discount-calculator.html' },
  { id: 'profitloss', name: 'Profit & Loss Calculator', file: 'profit-loss-calculator.html' },
  { id: 'emi', name: 'EMI Calculator', file: 'emi-calculator.html' },
  { id: 'si', name: 'Simple Interest Calculator', file: 'simple-interest-calculator.html' },
  { id: 'ci', name: 'Compound Interest Calculator', file: 'compound-interest-calculator.html' },
  { id: 'age', name: 'Age Calculator', file: 'age-calculator.html' },
  { id: 'datecalc', name: 'Date Calculator', file: 'date-calculator.html' },
  { id: 'timecalc', name: 'Time Calculator', file: 'time-calculator.html' },
  { id: 'bmi', name: 'BMI Calculator', file: 'bmi-calculator.html' },
  { id: 'bmr', name: 'BMR Calculator', file: 'bmr-calculator.html' },
  { id: 'salary', name: 'Salary Calculator', file: 'salary-calculator.html' },
];

function renderCalcSidebar() {
  const mount = document.getElementById('calcSidebar');
  if (!mount) return;
  const current = document.body.dataset.tool;
  const items = CALCULATORS.map((c) => {
    const cls = c.id === current ? 'current' : '';
    return `<li><a class="${cls}" href="${c.file}"><i class="fa-solid fa-chevron-right" style="font-size:10px;opacity:.5"></i> ${c.name}</a></li>`;
  }).join('');
  mount.innerHTML = `<h3>All Calculators</h3><ul>${items}</ul>`;
}

document.addEventListener('DOMContentLoaded', renderCalcSidebar);

// ---- shared helpers ----
function fmt(n, decimals = 2) {
  if (!isFinite(n)) return '—';
  return Number(n).toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}
function money(n) {
  return '₹' + fmt(n, 2);
}
function showResult(boxId) {
  document.getElementById(boxId).classList.add('show');
}
