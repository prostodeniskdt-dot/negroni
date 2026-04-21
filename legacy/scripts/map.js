// Отрисовка карты на странице recipes.html.
// Расширенная версия: боковая панель городов, тёмные тайлы, подсветка.

(function () {
  'use strict';

  if (typeof L === 'undefined') return;

  var api = window.NegroniAPI;
  var utils = window.NegroniUtils;
  var i18n = window.NegroniI18n;
  var recipes = api ? api.getAll() : (window.NEGRONI_RECIPES || []);

  var mapEl = document.getElementById('map-full');
  var sidebarListEl = document.getElementById('mapSidebarList');
  if (!mapEl) return;

  var map = L.map(mapEl, {
    center: [61, 96],
    zoom: 3.5,
    maxBounds: [[35, 15], [82, 191]],
    maxBoundsViscosity: 0.8
  });

  // Тайлы с поддержкой тёмной подложки
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Кастомный маркер (жёлтый)
  var yellowMarkerSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
    '<circle cx="14" cy="14" r="12" fill="#f8cf2c" stroke="#0d0d0d" stroke-width="2"/>' +
    '</svg>';

  var activeMarkerSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">' +
    '<circle cx="17" cy="17" r="14" fill="#BB0A30" stroke="#f8cf2c" stroke-width="3"/>' +
    '</svg>';

  var defaultIcon = L.divIcon({
    html: yellowMarkerSvg,
    className: 'negroni-custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  var activeIcon = L.divIcon({
    html: activeMarkerSvg,
    className: 'negroni-custom-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  function escapeHtml(s) {
    if (utils && typeof utils.escapeHtml === 'function') {
      return utils.escapeHtml(s);
    }
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  var markersById = {};
  var sidebarItemsById = {};
  var activeId = null;

  // Создание маркеров и боковой панели
  recipes.forEach(function (r) {
    if (r.lat == null || r.lng == null) return;

    var marker = L.marker([r.lat, r.lng], { icon: defaultIcon }).addTo(map);
    markersById[r.id] = marker;

    var html =
      '<strong>' + escapeHtml(r.city) + '</strong><br>' +
      '<em>' + escapeHtml(r.recipe.name) + '</em><br>' +
      '<button type="button" class="popup-btn">' + (i18n ? i18n.t('map.openRecipe') : 'Открыть рецепт') + '</button>';

    marker.bindPopup(html);

    function goToRecipe() {
      var url = 'recipe.html?id=' + encodeURIComponent(r.id) + '&from=map';
      window.location.href = url;
    }

    marker.on('popupopen', function () {
      setActive(r.id);
      var popup = marker.getPopup();
      if (!popup) return;
      var el = popup.getElement();
      if (!el) return;
      var btn = el.querySelector('.popup-btn');
      if (btn) btn.addEventListener('click', goToRecipe);
    });

    marker.on('popupclose', function () {
      if (activeId === r.id) setActive(null);
    });

    // Боковая панель
    if (sidebarListEl) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'map-sidebar-item';
      item.innerHTML =
        '<span class="map-sidebar-item-name">' + escapeHtml(r.recipe.name) + '</span>' +
        '<span class="map-sidebar-item-city">' + escapeHtml(r.city) + '</span>';

      item.addEventListener('click', function () {
        map.setView([r.lat, r.lng], 6, { animate: true });
        marker.openPopup();
        setActive(r.id);
      });

      sidebarItemsById[r.id] = item;
      sidebarListEl.appendChild(item);
    }
  });

  // Подсветка активного элемента
  function setActive(id) {
    // Снять предыдущую подсветку
    if (activeId && markersById[activeId]) {
      markersById[activeId].setIcon(defaultIcon);
    }
    if (activeId && sidebarItemsById[activeId]) {
      sidebarItemsById[activeId].classList.remove('active');
    }

    activeId = id;

    // Установить новую
    if (id && markersById[id]) {
      markersById[id].setIcon(activeIcon);
    }
    if (id && sidebarItemsById[id]) {
      sidebarItemsById[id].classList.add('active');
      // Скроллить к элементу
      sidebarItemsById[id].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Фокусировка карты на конкретном рецепте, если указан ?focus=id
  if (utils && typeof utils.getQueryParam === 'function') {
    var focusId = utils.getQueryParam('focus');
    if (focusId && markersById[focusId]) {
      var marker = markersById[focusId];
      var latLng = marker.getLatLng();
      map.setView(latLng, 5, { animate: true });
      marker.openPopup();
      setActive(focusId);
    }
  }
})();
