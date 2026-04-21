// Рендер коллекции рецептов на странице collection.html.
// Расширенная версия: фильтры по вкусу, тегам, ингредиентам, мини-превью, избранное.

(function () {
  'use strict';

  var gridEl = document.getElementById('collectionGrid');
  var emptyEl = document.getElementById('collectionEmpty');
  var countEl = document.getElementById('collectionCount');
  var searchInput = document.getElementById('searchInput');
  var regionSelect = document.getElementById('regionSelect');
  var ingredientInput = document.getElementById('ingredientInput');
  var tagsContainer = document.getElementById('collectionTags');
  var flavorToggleBtn = document.getElementById('flavorToggle');
  var flavorSlidersEl = document.getElementById('flavorSliders');
  var recipesCountEl = document.getElementById('collectionRecipesCount');
  var citiesCountEl = document.getElementById('collectionCitiesCount');

  var api = window.NegroniAPI;
  var utils = window.NegroniUtils;

  if (!gridEl || !searchInput || !regionSelect || !api || !utils) return;

  var recipes = api.getAll();
  var activeTags = [];
  var flavorFilters = {};
  var flavorOpen = false;

  // === Заполнить селектор регионов ===
  var regions = api.getAllRegions();
  regions.forEach(function (region) {
    var option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });

  // === Заполнить теги ===
  if (tagsContainer) {
    var allTags = api.getAllTags();
    allTags.forEach(function (tag) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'collection-tag-btn';
      btn.textContent = tag;
      btn.addEventListener('click', function () {
        var idx = activeTags.indexOf(tag);
        if (idx === -1) {
          activeTags.push(tag);
          btn.classList.add('active');
        } else {
          activeTags.splice(idx, 1);
          btn.classList.remove('active');
        }
        applyFilters();
      });
      tagsContainer.appendChild(btn);
    });
  }

  // === Фильтры по вкусовому профилю ===
  var i18n = window.NegroniI18n;
  var flavorKeys = ['bitter', 'sweet', 'sour', 'spicy', 'strong'];
  var flavorLabelKeys = ['flavor.bitter', 'flavor.sweet', 'flavor.sour', 'flavor.spicy', 'flavor.strong'];

  if (flavorToggleBtn && flavorSlidersEl) {
    flavorToggleBtn.addEventListener('click', function () {
      flavorOpen = !flavorOpen;
      flavorSlidersEl.classList.toggle('open', flavorOpen);
      flavorToggleBtn.classList.toggle('active', flavorOpen);
    });

    flavorKeys.forEach(function (key, i) {
      var row = document.createElement('div');
      row.className = 'collection-flavor-row';

      var label = document.createElement('label');
      var nameSpan = document.createElement('span');
      nameSpan.textContent = i18n ? i18n.t(flavorLabelKeys[i]) : flavorLabelKeys[i];
      var valueSpan = document.createElement('span');
      valueSpan.textContent = '0–10';
      label.appendChild(nameSpan);
      label.appendChild(valueSpan);

      var input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '10';
      input.step = '1';
      input.value = '0';

      input.addEventListener('input', function () {
        var v = Number(input.value);
        if (v > 0) {
          flavorFilters[key] = [v, 10];
          valueSpan.textContent = v + '–10';
        } else {
          delete flavorFilters[key];
          valueSpan.textContent = '0–10';
        }
        applyFilters();
      });

      row.appendChild(label);
      row.appendChild(input);
      flavorSlidersEl.appendChild(row);
    });
  }

  // === Комбинированная фильтрация ===
  function applyFilters() {
    var opts = {
      query: searchInput.value.trim(),
      region: regionSelect.value,
      tags: activeTags.length ? activeTags : undefined,
      flavor: Object.keys(flavorFilters).length ? flavorFilters : undefined
    };

    var filtered = api.filter(opts);

    // Фильтр по ингредиентам (дополнительный)
    if (ingredientInput && ingredientInput.value.trim()) {
      var ingQuery = ingredientInput.value.trim().toLowerCase().split(/[,;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (ingQuery.length) {
        filtered = filtered.filter(function (r) {
          var ings = ((r.recipe && r.recipe.ingredients) || []).join(' ').toLowerCase();
          return ingQuery.every(function (q) { return ings.includes(q); });
        });
      }
    }

    renderList(filtered);
  }

  // === Рендер карточек ===
  function renderList(list) {
    gridEl.innerHTML = '';

    if (countEl) {
      var foundLabel = (i18n ? i18n.t('collection.found') : 'Найдено');
      countEl.textContent = list.length
        ? foundLabel + ': ' + list.length
        : '';
    }

    if (!list.length) {
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;

    list.forEach(function (r) {
      var card = document.createElement('article');
      card.className = 'card collection-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', r.recipe.name);
      card.style.position = 'relative';

      var href = 'recipe.html?id=' + encodeURIComponent(r.id);
      var isFav = utils.isFavorite(r.id);
      var imgUrl = (r.recipe && r.recipe.image) || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400';

      // Медиа-обложка карточки (для галерейного вида)
      var mediaEl = document.createElement('div');
      mediaEl.className = 'card-media';
      mediaEl.style.backgroundImage = "url('" + imgUrl.replace(/'/g, "\\'") + "')";

      // Кнопка избранного
      var favBtn = document.createElement('button');
      favBtn.type = 'button';
      favBtn.className = 'card-favorite-btn' + (isFav ? ' is-active' : '');
      favBtn.setAttribute('aria-label', isFav ? (i18n ? i18n.t('recipe.removeFavorite') : 'Убрать из избранного') : (i18n ? i18n.t('recipe.addFavorite') : 'В избранное'));
      favBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      favBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var added = utils.toggleFavorite(r.id);
        favBtn.classList.toggle('is-active', added);
        favBtn.querySelector('svg').setAttribute('fill', added ? 'currentColor' : 'none');
        favBtn.setAttribute('aria-label', added ? 'Убрать из избранного' : 'В избранное');
      });

      // Теги
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
        (tagsHtml ? '<div class="card-tag-row card-tags-row">' + tagsHtml + '</div>' : '') +
        buildPreviewHTML(r);

      card.appendChild(mediaEl);
      card.appendChild(cardBody);
      card.insertBefore(favBtn, card.firstChild);

      card.addEventListener('click', function (e) {
        if (e.target.closest('.card-favorite-btn')) return;
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

  // === Мини-превью (тултип при наведении) ===
  function buildPreviewHTML(r) {
    var fp = (r.recipe && r.recipe.flavorProfile) || {};
    var ings = ((r.recipe && r.recipe.ingredients) || []).slice(0, 3);

    var flavorBars = '';
    var previewKeys = ['bitter', 'sweet', 'sour', 'spicy', 'strong'];
    var previewLabelKeys = ['flavor.bitterShort', 'flavor.sweetShort', 'flavor.sourShort', 'flavor.spicyShort', 'flavor.strongShort'];

    previewKeys.forEach(function (key, i) {
      var val = fp[key] || 0;
      var pct = (val / 10 * 100);
      flavorBars +=
        '<div class="card-preview-flavor-item">' +
        '<span>' + (i18n ? i18n.t(previewLabelKeys[i]) : previewLabelKeys[i]) + '</span>' +
        '<div class="card-preview-flavor-bar"><div class="card-preview-flavor-bar-fill" style="width:' + pct + '%"></div></div>' +
        '</div>';
    });

    var ingsText = ings.map(function (s) { return utils.escapeHtml(s); }).join(', ');

    return '<div class="card-preview">' +
      '<div class="card-preview-flavor">' + flavorBars + '</div>' +
      (ingsText ? '<div class="card-preview-ingredients">' + ingsText + '</div>' : '') +
      '</div>';
  }

  // === Pluralize helper ===
  function pluralize(n, one, two, five) {
    var abs = Math.abs(n) % 100;
    var n1 = abs % 10;
    if (abs > 10 && abs < 20) return five;
    if (n1 > 1 && n1 < 5) return two;
    if (n1 === 1) return one;
    return five;
  }

  // === Подписки на события ===
  searchInput.addEventListener('input', applyFilters);
  regionSelect.addEventListener('change', applyFilters);
  if (ingredientInput) ingredientInput.addEventListener('input', applyFilters);

  // Статистика в hero
  if (recipesCountEl) recipesCountEl.textContent = recipes.length;
  if (citiesCountEl) {
    var cities = {};
    recipes.forEach(function (r) { cities[r.city || (r.recipe && r.recipe.region) || ''] = 1; });
    citiesCountEl.textContent = Object.keys(cities).filter(Boolean).length;
  }

  // Инициализация
  applyFilters();
})();
