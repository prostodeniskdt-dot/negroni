// Общие утилиты для работы с данными и URL.
// Расширенная версия: progressive enhancement, избранное, экспорт.

window.NegroniUtils = (function () {
  'use strict';

  // === Работа с рецептами (обратная совместимость) ===

  function getRecipeById(id) {
    if (window.NegroniAPI) return window.NegroniAPI.getById(id);
    var list = window.NEGRONI_RECIPES || [];
    return list.find(function (r) { return r.id === id; }) || null;
  }

  // === URL / Query ===

  function getQueryParam(name) {
    if (typeof window === 'undefined') return null;
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // === HTML ===

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  // === Избранное (localStorage) ===

  var FAV_KEY = 'negroni-favorites';

  function getFavorites() {
    try {
      var data = localStorage.getItem(FAV_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function setFavorites(list) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(list));
    } catch (e) { /* no-op */ }
  }

  function isFavorite(id) {
    return getFavorites().indexOf(id) !== -1;
  }

  function toggleFavorite(id) {
    var favs = getFavorites();
    var idx = favs.indexOf(id);
    if (idx === -1) {
      favs.push(id);
    } else {
      favs.splice(idx, 1);
    }
    setFavorites(favs);
    if (window.NegroniAnalytics) {
      window.NegroniAnalytics.track(idx === -1 ? 'favorite_add' : 'favorite_remove', { id: id });
    }
    return idx === -1; // true если добавлено
  }

  function clearFavorites() {
    setFavorites([]);
  }

  // === Экспорт рецепта в текстовый формат (для печати / PDF) ===

  function recipeToText(recipeData) {
    if (!recipeData || !recipeData.recipe) return '';
    var r = recipeData.recipe;
    var lines = [];
    lines.push(r.name || recipeData.city);
    lines.push('Регион: ' + (r.region || recipeData.city));
    if (r.author && r.author !== '—') lines.push('Автор: ' + r.author);
    if (r.bar && r.bar !== '—') lines.push('Бар: ' + r.bar);
    lines.push('');
    if (r.intro) { lines.push(r.intro); lines.push(''); }
    lines.push('Метод: ' + (r.method || '—'));
    lines.push('Бокал: ' + (r.glass || '—'));
    lines.push('Гарнир: ' + (r.garnish || '—'));
    lines.push('Лёд: ' + (r.ice || '—'));
    lines.push('');
    lines.push('ИНГРЕДИЕНТЫ:');
    (r.ingredients || []).forEach(function (item) { lines.push('  • ' + item); });
    lines.push('');
    lines.push('ПРИГОТОВЛЕНИЕ:');
    (r.steps || []).forEach(function (step, i) { lines.push('  ' + (i + 1) + '. ' + step); });

    if (r.prebatch) {
      lines.push('');
      lines.push('ЗАГОТОВКИ:');
      if (typeof r.prebatch === 'string') {
        lines.push('  ' + r.prebatch);
      } else {
        lines.push('  ' + (r.prebatch.name || 'Заготовка'));
        if (r.prebatch.ingredients) {
          r.prebatch.ingredients.forEach(function (item) { lines.push('    • ' + item); });
        }
        if (r.prebatch.steps) {
          r.prebatch.steps.forEach(function (step, i) { lines.push('    ' + (i + 1) + '. ' + step); });
        }
      }
    }

    if (r.tags && r.tags.length) {
      lines.push('');
      lines.push('Теги: ' + r.tags.join(', '));
    }

    lines.push('');
    lines.push('— Музей Негрони • museynegroni.ru');

    return lines.join('\n');
  }

  function printRecipe(recipeData) {
    var text = recipeToText(recipeData);
    if (!text) return;

    var printWindow = window.open('', '_blank');
    if (!printWindow) return;

    var r = recipeData.recipe || {};
    printWindow.document.write(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + escapeHtml(r.name || 'Рецепт') + '</title>' +
      '<style>' +
      'body { font-family: Georgia, serif; max-width: 600px; margin: 2rem auto; padding: 1rem; color: #1a1a1a; line-height: 1.7; }' +
      'h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }' +
      '.meta { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }' +
      '.intro { font-style: italic; margin-bottom: 1.5rem; }' +
      '.tech { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; }' +
      '.tech strong { display: block; font-size: 0.75rem; text-transform: uppercase; color: #BB0A30; }' +
      'h2 { font-size: 1.1rem; color: #BB0A30; margin-top: 1.5rem; }' +
      'ul, ol { padding-left: 1.5rem; }' +
      'li { margin-bottom: 0.3rem; }' +
      '.tags { margin-top: 1rem; font-size: 0.85rem; color: #888; }' +
      '.footer { margin-top: 2rem; border-top: 1px solid #ddd; padding-top: 0.75rem; font-size: 0.8rem; color: #999; }' +
      '@media print { body { margin: 0; } }' +
      '</style></head><body>' +
      '<h1>' + escapeHtml(r.name || recipeData.city) + '</h1>' +
      '<div class="meta">' + escapeHtml(r.region || recipeData.city) +
      (r.author && r.author !== '—' ? ' &bull; Автор: ' + escapeHtml(r.author) : '') +
      (r.bar && r.bar !== '—' ? ' &bull; ' + escapeHtml(r.bar) : '') +
      '</div>' +
      (r.intro ? '<p class="intro">' + escapeHtml(r.intro) + '</p>' : '') +
      '<div class="tech">' +
      '<div><strong>Method</strong>' + escapeHtml(r.method || '—') + '</div>' +
      '<div><strong>Glass</strong>' + escapeHtml(r.glass || '—') + '</div>' +
      '<div><strong>Garnish</strong>' + escapeHtml(r.garnish || '—') + '</div>' +
      '<div><strong>Ice</strong>' + escapeHtml(r.ice || '—') + '</div>' +
      '</div>' +
      '<h2>Ингредиенты</h2><ul>' +
      (r.ingredients || []).map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') +
      '</ul>' +
      '<h2>Приготовление</h2><ol>' +
      (r.steps || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') +
      '</ol>' +
      (r.tags && r.tags.length ? '<p class="tags">Теги: ' + escapeHtml(r.tags.join(', ')) + '</p>' : '') +
      '<div class="footer">Музей Негрони &bull; museynegroni.ru</div>' +
      '</body></html>'
    );
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function () { printWindow.print(); }, 300);
  }

  // === Progressive Enhancement ===

  function supportsFeature(feature) {
    switch (feature) {
      case 'IntersectionObserver': return 'IntersectionObserver' in window;
      case 'localStorage':
        try { localStorage.setItem('__test__', '1'); localStorage.removeItem('__test__'); return true; } catch (e) { return false; }
      case 'clipboard': return !!(navigator.clipboard && navigator.clipboard.writeText);
      case 'fetch': return typeof fetch === 'function';
      default: return false;
    }
  }

  // === Общий навигационный HTML (для вставки на всех страницах) ===

  function getNavHTML(activePage) {
    var favCount = getFavorites().length;
    var favBadge = favCount > 0 ? '<span class="nav-badge">' + favCount + '</span>' : '';

    return '<a href="index.html" class="logo">Музей Негрони</a>' +
      '<nav class="nav" aria-label="Основная навигация">' +
      '<a href="index.html#about"' + (activePage === 'about' ? ' class="active"' : '') + ' data-i18n="nav.about">О проекте</a>' +
      '<a href="collection.html"' + (activePage === 'collection' ? ' class="active"' : '') + ' data-i18n="nav.collection">Коллекция</a>' +
      '<a href="history.html"' + (activePage === 'history' ? ' class="active"' : '') + ' data-i18n="nav.history">История</a>' +
      '<a href="partners.html"' + (activePage === 'partners' ? ' class="active"' : '') + ' data-i18n="nav.partners">Партнёры</a>' +
      '<a href="favorites.html" class="nav-favorites-link' + (activePage === 'favorites' ? ' active' : '') + '" aria-label="Избранное">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
      favBadge + '</a>' +
      '<button type="button" class="theme-toggle-btn nav-icon-btn" aria-label="Переключить тему"></button>' +
      '<button type="button" class="lang-toggle-btn nav-icon-btn" aria-label="Сменить язык">EN</button>' +
      '<a href="recipes.html" class="btn-recipes" data-i18n="nav.map">Карта</a>' +
      '</nav>';
  }

  return {
    getRecipeById: getRecipeById,
    getQueryParam: getQueryParam,
    escapeHtml: escapeHtml,
    getFavorites: getFavorites,
    setFavorites: setFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    clearFavorites: clearFavorites,
    recipeToText: recipeToText,
    printRecipe: printRecipe,
    supportsFeature: supportsFeature,
    getNavHTML: getNavHTML
  };
})();
