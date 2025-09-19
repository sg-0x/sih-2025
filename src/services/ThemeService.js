const THEME_KEY = 'dp_theme_v1';

export function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-bs-theme', theme);
  document.body.dataset.theme = theme;
  // notify listeners (e.g., charts) that theme changed
  const evt = new CustomEvent('themechange', { detail: { theme } });
  window.dispatchEvent(evt);
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(current) {
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
  return next;
}


