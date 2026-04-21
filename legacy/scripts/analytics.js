// Лёгкий модуль аналитики.
// Собирает события и при наличии подключённых систем (GA / Яндекс.Метрика)
// пробрасывает им данные. Без систем — логирует в консоль (debug).

window.NegroniAnalytics = (function () {
  'use strict';

  var DEBUG = false; // Включить для отладки

  function track(eventName, data) {
    data = data || {};

    if (DEBUG) {
      console.debug('[NegroniAnalytics]', eventName, data);
    }

    // Яндекс.Метрика
    if (typeof window.ym === 'function') {
      try {
        // Замените XXXXXXXX на реальный ID счётчика
        // window.ym(XXXXXXXX, 'reachGoal', eventName, data);
      } catch (e) { /* no-op */ }
    }

    // Google Analytics (gtag)
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, data);
      } catch (e) { /* no-op */ }
    }
  }

  // Автоматическое отслеживание кликов по навигации
  function initAutoTracking() {
    // Отслеживание навигационных кликов
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href') || '';

      // Клик по карте
      if (href.includes('recipes.html')) {
        track('nav_map_click', { from: window.location.pathname });
      }
      // Клик по коллекции
      if (href.includes('collection.html')) {
        track('nav_collection_click', { from: window.location.pathname });
      }
      // Клик по рецепту
      if (href.includes('recipe.html')) {
        var match = href.match(/id=([^&]+)/);
        track('recipe_click', { id: match ? match[1] : 'unknown', from: window.location.pathname });
      }
      // Клик по партнёрам
      if (href.includes('partners.html')) {
        track('nav_partners_click', { from: window.location.pathname });
      }
    });

    // Отслеживание копирования ссылки
    document.addEventListener('click', function (e) {
      if (e.target.closest('#shareCopyButton')) {
        track('share_copy_link', { url: window.location.href });
      }
    });

    // Отслеживание просмотра страницы
    track('page_view', {
      page: window.location.pathname + window.location.search,
      title: document.title
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoTracking);
  } else {
    initAutoTracking();
  }

  return { track: track };
})();
