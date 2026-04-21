// Единая точка доступа к данным рецептов.
// Все страницы и скрипты должны обращаться к данным через NegroniAPI
// вместо прямого чтения window.NEGRONI_RECIPES.

window.NegroniAPI = (function () {
  'use strict';

  function _recipes() {
    return window.NEGRONI_RECIPES || [];
  }

  // === Основные методы ===

  function getAll() {
    return _recipes();
  }

  function getById(id) {
    return _recipes().find(function (r) { return r.id === id; }) || null;
  }

  function getByRegion(region) {
    return _recipes().filter(function (r) {
      return r.recipe && r.recipe.region === region;
    });
  }

  // === Поиск по тексту (имя, город, intro) ===

  function search(query) {
    if (!query) return _recipes();
    var q = query.trim().toLowerCase();
    if (!q) return _recipes();
    return _recipes().filter(function (r) {
      var name = ((r.recipe && r.recipe.name) || '').toLowerCase();
      var city = (r.city || '').toLowerCase();
      var intro = ((r.recipe && r.recipe.intro) || '').toLowerCase();
      var author = ((r.recipe && r.recipe.author) || '').toLowerCase();
      var bar = ((r.recipe && r.recipe.bar) || '').toLowerCase();
      return name.includes(q) || city.includes(q) || intro.includes(q) || author.includes(q) || bar.includes(q);
    });
  }

  // === Фильтр по вкусовому профилю ===
  // filters = { bitter: [min, max], sweet: [min, max], ... }

  function getByFlavor(filters) {
    if (!filters || typeof filters !== 'object') return _recipes();
    var keys = Object.keys(filters);
    if (!keys.length) return _recipes();

    return _recipes().filter(function (r) {
      var fp = r.recipe && r.recipe.flavorProfile;
      if (!fp) return false;
      return keys.every(function (key) {
        var range = filters[key];
        if (!Array.isArray(range) || range.length < 2) return true;
        var val = fp[key] || 0;
        return val >= range[0] && val <= range[1];
      });
    });
  }

  // === Фильтр по ингредиентам (обратный поиск) ===
  // userIngredients = ['джин', 'кампари', ...] — строки, которые ищутся как подстроки

  function getByIngredients(userIngredients) {
    if (!Array.isArray(userIngredients) || !userIngredients.length) return _recipes();

    var lowerUser = userIngredients.map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    if (!lowerUser.length) return _recipes();

    return _recipes().filter(function (r) {
      var ing = (r.recipe && r.recipe.ingredients) || [];
      // Рецепт подходит, если все его ингредиенты совпадают с хотя бы одним из пользователя
      return ing.every(function (recipeIng) {
        var lower = recipeIng.toLowerCase();
        return lowerUser.some(function (userIng) {
          return lower.includes(userIng);
        });
      });
    });
  }

  // === Фильтр по тегам ===

  function getByTags(tags) {
    if (!Array.isArray(tags) || !tags.length) return _recipes();
    var lowerTags = tags.map(function (t) { return t.toLowerCase(); });

    return _recipes().filter(function (r) {
      var recipeTags = (r.recipe && r.recipe.tags) || [];
      return lowerTags.some(function (tag) {
        return recipeTags.some(function (rt) { return rt.toLowerCase() === tag; });
      });
    });
  }

  // === Мета-данные (справочники) ===

  function getAllRegions() {
    var set = {};
    _recipes().forEach(function (r) {
      var region = r.recipe && r.recipe.region;
      if (region) set[region] = true;
    });
    return Object.keys(set).sort();
  }

  function getAllTags() {
    var set = {};
    _recipes().forEach(function (r) {
      var tags = (r.recipe && r.recipe.tags) || [];
      tags.forEach(function (t) { set[t.toLowerCase()] = t; });
    });
    return Object.keys(set).sort().map(function (k) { return set[k]; });
  }

  function getAllIngredients() {
    var set = {};
    _recipes().forEach(function (r) {
      var ings = (r.recipe && r.recipe.ingredients) || [];
      ings.forEach(function (ing) {
        // Очистка от объёмов/примечаний — берём основную часть
        var clean = ing.replace(/^\d[\d\s,.\-–]*\s*(мл|г|ч\.\s*л\.|ст\.\s*л\.|дэш[а-яё]*|капл[а-яё]*)\s*/i, '').trim();
        if (clean) set[clean.toLowerCase()] = clean;
      });
    });
    return Object.keys(set).sort().map(function (k) { return set[k]; });
  }

  // === Комбинированный фильтр ===

  function filter(opts) {
    var result = _recipes();

    if (opts.query) {
      var q = opts.query.trim().toLowerCase();
      if (q) {
        result = result.filter(function (r) {
          var name = ((r.recipe && r.recipe.name) || '').toLowerCase();
          var city = (r.city || '').toLowerCase();
          return name.includes(q) || city.includes(q);
        });
      }
    }

    if (opts.region) {
      result = result.filter(function (r) {
        return r.recipe && r.recipe.region === opts.region;
      });
    }

    if (opts.tags && opts.tags.length) {
      var lt = opts.tags.map(function (t) { return t.toLowerCase(); });
      result = result.filter(function (r) {
        var rt = (r.recipe && r.recipe.tags) || [];
        return lt.some(function (t) { return rt.some(function (x) { return x.toLowerCase() === t; }); });
      });
    }

    if (opts.flavor) {
      var keys = Object.keys(opts.flavor);
      if (keys.length) {
        result = result.filter(function (r) {
          var fp = r.recipe && r.recipe.flavorProfile;
          if (!fp) return false;
          return keys.every(function (key) {
            var range = opts.flavor[key];
            if (!Array.isArray(range)) return true;
            var val = fp[key] || 0;
            return val >= range[0] && val <= range[1];
          });
        });
      }
    }

    if (opts.ingredients && opts.ingredients.length) {
      var li = opts.ingredients.map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
      if (li.length) {
        result = result.filter(function (r) {
          var ing = (r.recipe && r.recipe.ingredients) || [];
          var joined = ing.join(' ').toLowerCase();
          return li.every(function (ui) { return joined.includes(ui); });
        });
      }
    }

    return result;
  }

  // === Статистика (для партнёрской страницы и т.д.) ===

  function getStats() {
    var recipes = _recipes();
    return {
      totalRecipes: recipes.length,
      totalCities: new Set(recipes.map(function (r) { return r.city; })).size,
      totalRegions: getAllRegions().length,
      totalTags: getAllTags().length
    };
  }

  return {
    getAll: getAll,
    getById: getById,
    getByRegion: getByRegion,
    search: search,
    getByFlavor: getByFlavor,
    getByIngredients: getByIngredients,
    getByTags: getByTags,
    getAllRegions: getAllRegions,
    getAllTags: getAllTags,
    getAllIngredients: getAllIngredients,
    filter: filter,
    getStats: getStats
  };
})();
