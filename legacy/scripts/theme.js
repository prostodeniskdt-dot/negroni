// Переключатель тёмной/светлой темы.
// Сохраняет выбор в localStorage. Класс .theme-light на <html>.
// Кнопка переключения: элемент с id="themeToggle".

(function () {
  'use strict';

  var STORAGE_KEY = 'negroni-theme';
  var root = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setStored(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch (e) { /* no-op */ }
  }

  function apply(theme) {
    if (theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }
    // Обновить aria-label кнопки
    var btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему');
      btn.innerHTML = theme === 'light'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    });
  }

  function toggle() {
    var current = root.classList.contains('theme-light') ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    apply(next);
    setStored(next);
    if (window.NegroniAnalytics) {
      window.NegroniAnalytics.track('theme_toggle', { theme: next });
    }
  }

  function init() {
    // Определяем тему: сохранённая > системная > dark
    var stored = getStored();
    var theme = stored || 'dark';
    if (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme = 'light';
    }
    apply(theme);

    // Привязка кнопок
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.theme-toggle-btn');
      if (btn) {
        e.preventDefault();
        toggle();
      }
    });
  }

  // Инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NegroniTheme = { toggle: toggle };
})();
