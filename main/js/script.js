// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

// Theme toggle (light/dark)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const applyTheme = (mode) => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    themeToggle.innerHTML = mode === 'dark'
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  };
  const saved = localStorage.getItem('toolora-theme');
  if (saved) applyTheme(saved);

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('toolora-theme', next);
  });
}

// Live tool search filter
const searchForm = document.getElementById('toolSearch');
const searchInput = document.getElementById('toolSearchInput');
const toolCards = document.querySelectorAll('#toolGrid .tool-card');
const noResults = document.getElementById('noResults');

function filterTools() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  toolCards.forEach((card) => {
    const haystack = `${card.dataset.name} ${card.querySelector('h3').textContent}`.toLowerCase();
    const match = query === '' || haystack.includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visibleCount += 1;
  });

  if (noResults) noResults.hidden = visibleCount !== 0;
}

if (searchInput) {
  searchInput.addEventListener('input', filterTools);
}
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    filterTools();
  });
}

// Popular search chips fill the search box too
document.querySelectorAll('.popular-searches a').forEach((chip) => {
  chip.addEventListener('click', () => {
    if (searchInput) searchInput.value = chip.textContent.trim();
  });
});
