// Логика детальной страницы рецепта (recipe.html).
// Расширенная версия: избранное, экспорт/печать, автор/бар, теги.

(function () {
  'use strict';

  var utils = window.NegroniUtils;
  var api = window.NegroniAPI;
  var i18n = window.NegroniI18n;
  if (!utils) return;

  var id = utils.getQueryParam('id');
  var recipeData = id ? utils.getRecipeById(id) : null;

  var titleEl = document.getElementById('recipeTitle');
  var regionEl = document.getElementById('recipeRegion');
  var methodEl = document.getElementById('recipeMethod');
  var glassEl = document.getElementById('recipeGlass');
  var garnishEl = document.getElementById('recipeGarnish');
  var iceEl = document.getElementById('recipeIce');
  var introEl = document.getElementById('recipeIntro');
  var ingredientsEl = document.getElementById('recipeIngredients');
  var stepsEl = document.getElementById('recipeSteps');
  var prebatchEl = document.getElementById('recipePrebatch');
  var imageEl = document.getElementById('recipeImage');
  var toMapLink = document.getElementById('toMapLink');
  var radarCanvas = document.getElementById('flavorRadar');
  var slidersContainer = document.getElementById('flavorSliders');
  var relatedListEl = document.getElementById('relatedList');
  var shareCopyBtn = document.getElementById('shareCopyButton');
  var shareStatusEl = document.getElementById('shareCopyStatus');
  var authorBarEl = document.getElementById('recipeAuthorBar');
  var tagsEl = document.getElementById('recipeTags');
  var favoriteBtn = document.getElementById('favoriteBtn');
  var favoriteBtnText = document.getElementById('favoriteBtnText');
  var exportBtn = document.getElementById('exportBtn');

  var allRecipes = (api ? api.getAll() : window.NEGRONI_RECIPES) || [];

  if (!titleEl || !regionEl) return;

  if (!recipeData) {
    titleEl.textContent = i18n ? i18n.t('recipe.notFound') : 'Рецепт не найден';
    regionEl.textContent = '';
    if (ingredientsEl) ingredientsEl.innerHTML = '<li><a href="collection.html">' + (i18n ? i18n.t('recipe.backToCollection') : 'Вернуться к коллекции') + '</a></li>';
    return;
  }

  var recipe = recipeData.recipe || {};

  // Динамический title и description для SEO
  if (recipe && recipe.name) {
    var baseTitle = recipe.name + ' — Музей Негрони';
    document.title = baseTitle;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      var introText = recipe.intro || '';
      var desc = (recipe.name + ' — рецепт коктейля Негрони из коллекции Музея Негрони. ' + introText).slice(0, 260);
      metaDesc.setAttribute('content', desc);
    }
  }

  titleEl.textContent = recipe.name || recipeData.city;
  regionEl.textContent = recipe.region || recipeData.city;

  if (introEl) {
    introEl.textContent = recipe.intro || '';
  }

  // Автор и бар
  if (authorBarEl) {
    var authorHtml = '';
    if (recipe.author && recipe.author !== '—') {
      authorHtml += '<div><strong>' + (i18n ? i18n.t('recipe.author') : 'Автор') + '</strong><br>' + utils.escapeHtml(recipe.author) + '</div>';
    }
    if (recipe.bar && recipe.bar !== '—') {
      authorHtml += '<div><strong>' + (i18n ? i18n.t('recipe.bar') : 'Бар') + '</strong><br>' + utils.escapeHtml(recipe.bar) + '</div>';
    }
    authorBarEl.innerHTML = authorHtml;
  }

  // Теги
  if (tagsEl && recipe.tags && recipe.tags.length) {
    tagsEl.innerHTML = recipe.tags.map(function (tag) {
      return '<span class="recipe-tag">' + utils.escapeHtml(tag) + '</span>';
    }).join('');
  }

  // Избранное
  if (favoriteBtn && favoriteBtnText) {
    function updateFavBtn() {
      var isFav = utils.isFavorite(id);
      favoriteBtn.classList.toggle('is-active', isFav);
      favoriteBtnText.textContent = isFav ? (i18n ? i18n.t('recipe.inFavorites') : 'В избранном') : (i18n ? i18n.t('recipe.addFavorite') : 'В избранное');
      favoriteBtn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
    }
    updateFavBtn();

    favoriteBtn.addEventListener('click', function () {
      utils.toggleFavorite(id);
      updateFavBtn();
    });
  }

  // Экспорт / Печать
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      utils.printRecipe(recipeData);
      if (window.NegroniAnalytics) {
        window.NegroniAnalytics.track('recipe_export', { id: id });
      }
    });
  }

  methodEl.textContent = recipe.method || 'Stir';
  glassEl.textContent = recipe.glass || 'Rocks';
  garnishEl.textContent = recipe.garnish || 'Orange';
  iceEl.textContent = recipe.ice || 'Big ice cube';

  if (Array.isArray(recipe.ingredients) && ingredientsEl) {
    ingredientsEl.innerHTML = '';
    recipe.ingredients.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      ingredientsEl.appendChild(li);
    });
  }

  if (Array.isArray(recipe.steps) && stepsEl) {
    stepsEl.innerHTML = '';
    recipe.steps.forEach(function (step) {
      var li = document.createElement('li');
      li.textContent = step;
      stepsEl.appendChild(li);
    });
  }

  // Заготовки (prebatch)
  if (prebatchEl) {
    var prebatch = recipe.prebatch;
    if (!prebatch) {
      prebatchEl.textContent = i18n ? i18n.t('recipe.noPrebatch') : 'Для этого рецепта не требуется отдельная заготовка.';
    } else if (typeof prebatch === 'string') {
      prebatchEl.textContent = prebatch;
    } else {
      var title = document.createElement('h3');
      title.textContent = prebatch.name || (i18n ? i18n.t('recipe.prebatchDefault') : 'Заготовка');

      var ingTitle = document.createElement('h4');
      ingTitle.textContent = i18n ? i18n.t('recipe.prebatchIngredients') : 'Ингредиенты заготовки';

      var ingList = document.createElement('ul');
      (prebatch.ingredients || []).forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        ingList.appendChild(li);
      });

      var stepsTitle = document.createElement('h4');
      stepsTitle.textContent = i18n ? i18n.t('recipe.prebatchSteps') : 'Шаги подготовки';

      var stepsList = document.createElement('ol');
      (prebatch.steps || []).forEach(function (step) {
        var li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
      });

      prebatchEl.appendChild(title);
      prebatchEl.appendChild(ingTitle);
      prebatchEl.appendChild(ingList);
      prebatchEl.appendChild(stepsTitle);
      prebatchEl.appendChild(stepsList);
    }
  }

  if (imageEl) {
    var fallbackSrc = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800';
    var initialSrc = recipe.image || fallbackSrc;

    imageEl.src = initialSrc;
    imageEl.alt = recipe.name || 'Коктейль Негрони';

    imageEl.addEventListener('error', function handleImgError() {
      if (imageEl.dataset.fallbackApplied === '1') return;
      imageEl.dataset.fallbackApplied = '1';
      imageEl.src = fallbackSrc;
    });
  }

  if (toMapLink) {
    toMapLink.href = 'recipes.html?focus=' + encodeURIComponent(recipeData.id);
  }

  // Блок «Похожие рецепты»
  if (relatedListEl && allRecipes.length > 1) {
    var currentRegion = recipe.region || recipeData.city;

    var sameRegion = allRecipes.filter(function (r) {
      if (r.id === recipeData.id) return false;
      var rRegion = (r.recipe && r.recipe.region) || r.city;
      return rRegion === currentRegion;
    });

    var related = sameRegion.slice(0, 3);

    if (related.length < 3) {
      var others = allRecipes.filter(function (r) {
        return r.id !== recipeData.id && !related.includes(r);
      });
      related = related.concat(others.slice(0, 3 - related.length));
    }

    relatedListEl.innerHTML = '';

    related.forEach(function (r) {
      var item = document.createElement('article');
      item.className = 'recipe-related-item';
      item.tabIndex = 0;

      var targetRegion = (r.recipe && r.recipe.region) || r.city;

      item.innerHTML =
        '<h3 class="recipe-related-item-title">' + (r.recipe && r.recipe.name ? r.recipe.name : r.city) + '</h3>' +
        '<p class="recipe-related-item-meta">' + targetRegion + '</p>';

      var href = 'recipe.html?id=' + encodeURIComponent(r.id);

      function go() {
        window.location.href = href;
      }

      item.addEventListener('click', go);
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });

      relatedListEl.appendChild(item);
    });
  }

  // Шаринг — копирование ссылки
  if (shareCopyBtn && shareStatusEl) {
    shareCopyBtn.addEventListener('click', function () {
      var url = window.location.href;

      function showStatus(msg) {
        shareStatusEl.textContent = msg;
        setTimeout(function () {
          shareStatusEl.textContent = '';
        }, 2500);
      }

      var msgOk = i18n ? i18n.t('recipe.linkCopied') : 'Ссылка скопирована в буфер обмена.';
      var msgFail = i18n ? i18n.t('recipe.linkCopyFailed') : 'Не удалось скопировать ссылку. Попробуйте вручную.';

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard
          .writeText(url)
          .then(function () {
            showStatus(msgOk);
          })
          .catch(function () {
            showStatus(msgFail);
          });
      } else {
        var tmp = document.createElement('input');
        tmp.type = 'text';
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        try {
          document.execCommand('copy');
          showStatus(msgOk);
        } catch (e) {
          showStatus(msgFail);
        }
        document.body.removeChild(tmp);
      }
    });
  }

  // Вкусовой профиль через Chart.js
  if (window.Chart && radarCanvas && slidersContainer) {
    var labelKeys = ['flavor.bitter', 'flavor.sweet', 'flavor.sour', 'flavor.spicy', 'flavor.strong'];
    var labels = labelKeys.map(function (k) { return i18n ? i18n.t(k) : k; });
    var keys = ['bitter', 'sweet', 'sour', 'spicy', 'strong'];
    var baseProfile = recipe.flavorProfile || {
      bitter: 7,
      sweet: 4,
      sour: 3,
      spicy: 2,
      strong: 7
    };

    var data = keys.map(function (k) { return baseProfile[k] || 5; });

    var isLight = document.documentElement.classList.contains('theme-light');
    var gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    var angleColor = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.18)';
    var labelColor = isLight ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    var pointBorder = isLight ? '#ffffff' : '#000000';
    var datasetBg = isLight ? 'rgba(187, 10, 48, 0.18)' : 'rgba(248, 207, 44, 0.28)';
    var datasetBorder = isLight ? 'rgba(187, 10, 48, 0.85)' : 'rgba(248, 207, 44, 0.95)';
    var datasetPoint = isLight ? 'rgba(187, 10, 48, 1)' : 'rgba(248, 207, 44, 1)';

    var chart = new Chart(radarCanvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: i18n ? i18n.t('flavor.profile') : 'Вкусовой профиль',
            data: data,
            fill: true,
            backgroundColor: datasetBg,
            borderColor: datasetBorder,
            borderWidth: 2,
            pointBackgroundColor: datasetPoint,
            pointBorderColor: pointBorder,
            pointRadius: 3,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              display: false,
              backdropColor: 'transparent',
              showLabelBackdrop: false
            },
            grid: {
              color: gridColor
            },
            angleLines: {
              color: angleColor
            },
            pointLabels: {
              color: labelColor,
              font: {
                family: "'Oswald', sans-serif",
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });

    // Слайдеры для ручной настройки профиля
    keys.forEach(function (key, index) {
      var wrapper = document.createElement('div');
      wrapper.className = 'recipe-flavor-slider';

      var labelRow = document.createElement('div');
      labelRow.className = 'recipe-flavor-slider-label';
      var label = document.createElement('span');
      label.textContent = labels[index];
      var valueSpan = document.createElement('span');
      valueSpan.textContent = String(data[index]);
      labelRow.appendChild(label);
      labelRow.appendChild(valueSpan);

      var input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '10';
      input.step = '1';
      input.value = String(data[index]);

      input.addEventListener('input', function () {
        var v = Number(input.value);
        chart.data.datasets[0].data[index] = v;
        valueSpan.textContent = String(v);
        chart.update('active');
      });

      wrapper.appendChild(labelRow);
      wrapper.appendChild(input);
      slidersContainer.appendChild(wrapper);
    });
  }
})();
