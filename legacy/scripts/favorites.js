// Логика страницы избранного (favorites.html).
// Рендерит список сохранённых рецептов, позволяет удалять, экспортировать.

(function () {
  'use strict';

  var api = window.NegroniAPI;
  var utils = window.NegroniUtils;
  var i18n = window.NegroniI18n;
  if (!api || !utils) return;

  var gridEl = document.getElementById('favoritesGrid');
  var emptyEl = document.getElementById('favoritesEmpty');
  var exportBtn = document.getElementById('exportFavoritesBtn');
  var clearBtn = document.getElementById('clearFavoritesBtn');

  if (!gridEl) return;

  function render() {
    var favIds = utils.getFavorites();
    gridEl.innerHTML = '';

    if (!favIds.length) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    favIds.forEach(function (id) {
      var r = api.getById(id);
      if (!r) return;

      var card = document.createElement('article');
      card.className = 'card collection-card favorites-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', r.recipe.name);
      card.style.position = 'relative';

      var href = 'recipe.html?id=' + encodeURIComponent(r.id);
      var imgUrl = (r.recipe && r.recipe.image) || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400';

      var mediaEl = document.createElement('div');
      mediaEl.className = 'card-media';
      mediaEl.style.backgroundImage = "url('" + imgUrl.replace(/'/g, "\\'") + "')";

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'favorites-remove-btn';
      removeBtn.setAttribute('aria-label', i18n ? i18n.t('favorites.remove') : 'Удалить из избранного');
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        utils.toggleFavorite(r.id);
        render();
      });

      var tagsHtml = '';
      var tags = (r.recipe && r.recipe.tags) || [];
      if (tags.length) {
        tagsHtml = tags.slice(0, 3).map(function (t) {
          return '<span class="card-tag-secondary">' + utils.escapeHtml(t) + '</span>';
        }).join('');
      }

      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      cardBody.innerHTML =
        '<div class="card-tag-row">' +
        '<span class="card-tag">' + utils.escapeHtml(r.recipe.region || r.city) + '</span>' +
        '</div>' +
        '<h2 class="card-title">' + utils.escapeHtml(r.recipe.name) + '</h2>' +
        '<p class="card-desc">' + utils.escapeHtml(r.recipe.intro || r.city) + '</p>' +
        (tagsHtml ? '<div class="card-tag-row card-tags-row">' + tagsHtml + '</div>' : '');

      card.appendChild(mediaEl);
      card.appendChild(cardBody);
      card.insertBefore(removeBtn, card.firstChild);

      card.addEventListener('click', function (e) {
        if (e.target.closest('.favorites-remove-btn')) return;
        window.location.href = href;
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = href;
        }
      });

      gridEl.appendChild(card);
    });
  }

  // Экспорт списка избранного
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var favIds = utils.getFavorites();
      if (!favIds.length) return;

      var lines = [(i18n ? i18n.t('favorites.exportHeader') : 'МОЯ БАРНАЯ КАРТА — Музей Негрони'), ''];
      favIds.forEach(function (id, i) {
        var r = api.getById(id);
        if (!r) return;
        lines.push((i + 1) + '. ' + r.recipe.name + ' (' + (r.recipe.region || r.city) + ')');
        if (r.recipe.intro) lines.push('   ' + r.recipe.intro);
        lines.push('   ' + (i18n ? i18n.t('favorites.exportIngredients') : 'Ингредиенты') + ': ' + (r.recipe.ingredients || []).join(', '));
        lines.push('');
      });
      lines.push(i18n ? i18n.t('favorites.exportFooter') : '— Музей Негрони • museynegroni.ru');

      var text = lines.join('\n');

      // Скачать как файл
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'moya-barnaya-karta.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.NegroniAnalytics) {
        window.NegroniAnalytics.track('favorites_export', { count: favIds.length });
      }
    });
  }

  // Очистить всё
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (!confirm(i18n ? i18n.t('favorites.removeConfirm') : 'Удалить все рецепты из избранного?')) return;
      utils.clearFavorites();
      render();
    });
  }

  render();
})();
